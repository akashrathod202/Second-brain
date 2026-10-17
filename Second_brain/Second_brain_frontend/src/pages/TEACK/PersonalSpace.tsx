import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import type { IconType } from "react-icons";
import {
  FaCalendarDays,
  FaCheck,
  FaDownload,
  FaFire,
  FaListCheck,
  FaPause,
  FaPen,
  FaPlay,
  FaPlus,
  FaRotateLeft,
  FaStopwatch,
  FaTrash,
  FaUpload,
  FaXmark,
} from "react-icons/fa6";

/* ==========================================================================
   Types, constants, defaults
   ========================================================================== */

const PRIORITIES = ["High", "Medium", "Low"] as const;
const CATEGORIES = ["Study", "Project", "Career", "Personal"] as const;
const DEADLINE_KINDS = ["Exam", "Assignment", "Interview", "Project", "Other"] as const;
const FOCUS_TARGETS = [60, 90, 120, 180, 240] as const;

type Priority = (typeof PRIORITIES)[number];
type Category = (typeof CATEGORIES)[number];
type DeadlineKind = (typeof DEADLINE_KINDS)[number];

type Task = {
  id: number;
  title: string;
  priority: Priority;
  completed: boolean;
  category?: Category;
  completedAt?: string;
};

type Habit = {
  id: number;
  title: string;
  icon?: string; // kept so previously saved habits round-trip untouched
  completed: boolean;
};

type Deadline = { id: number; title: string; date: string; kind: DeadlineKind };
type FocusDay = { minutes: number; sessions: number };
type HabitDay = { done: number; total: number };

const initialTasks: Task[] = [
  { id: 1, title: "Review today's priorities", priority: "High", completed: false },
  { id: 2, title: "Spend 30 minutes learning", priority: "Medium", completed: false },
  { id: 3, title: "Read or review my notes", priority: "Low", completed: true },
];

const initialHabits: Habit[] = [
  { id: 1, title: "Exercise", icon: "🏃", completed: false },
  { id: 2, title: "Learn something", icon: "📚", completed: false },
  { id: 3, title: "Drink enough water", icon: "💧", completed: false },
  { id: 4, title: "Reflect on my day", icon: "✍️", completed: false },
];

const DEFAULT_GOAL = "Build a consistent daily routine";
const DEFAULT_FOCUS_TARGET = 120;

const KEYS = {
  tasks: "personal-tasks",
  habits: "personal-habits",
  goal: "personal-goal",
  journal: (date: string) => `personal-journal-${date}`,
  habitsDate: "personal-habits-date",
  habitHistory: "personal-habit-history",
  taskLog: "personal-task-log",
  focusLog: "personal-focus-log",
  focusTarget: "personal-focus-target",
  deadlines: "personal-deadlines",
  timer: "personal-timer",
} as const;

/* ==========================================================================
   Date helpers
   ========================================================================== */

const pad = (value: number) => String(value).padStart(2, "0");

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseDateKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const shiftDate = (key: string, days: number) => {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
};

const isDateKey = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

const daysBetween = (from: string, to: string) =>
  Math.round((parseDateKey(to).getTime() - parseDateKey(from).getTime()) / 86_400_000);

const describeDays = (days: number) => {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days > 1) return `In ${days} days`;
  if (days === -1) return "1 day overdue";
  return `${-days} days overdue`;
};

const getGreeting = (hour: number) => {
  if (hour < 5) return "Working late";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const formatClock = (ms: number) => {
  const total = Math.ceil(ms / 1000);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
};

/** Consecutive active days ending today (or yesterday, if today has no activity yet). */
const computeStreak = (active: Set<string>, today: string) => {
  let cursor = active.has(today) ? today : shiftDate(today, -1);
  let streak = 0;

  while (active.has(cursor)) {
    streak += 1;
    cursor = shiftDate(cursor, -1);
  }

  return streak;
};

/* ==========================================================================
   Storage helpers and validators
   ========================================================================== */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isCount = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

const isTask = (value: unknown): value is Task =>
  isRecord(value) &&
  typeof value.id === "number" &&
  typeof value.title === "string" &&
  PRIORITIES.includes(value.priority as Priority) &&
  typeof value.completed === "boolean" &&
  (value.category === undefined || CATEGORIES.includes(value.category as Category)) &&
  (value.completedAt === undefined || typeof value.completedAt === "string");

const isHabit = (value: unknown): value is Habit =>
  isRecord(value) &&
  typeof value.id === "number" &&
  typeof value.title === "string" &&
  typeof value.completed === "boolean";

const isDeadline = (value: unknown): value is Deadline =>
  isRecord(value) &&
  typeof value.id === "number" &&
  typeof value.title === "string" &&
  isDateKey(value.date) &&
  DEADLINE_KINDS.includes(value.kind as DeadlineKind);

const isFocusDay = (value: unknown): value is FocusDay =>
  isRecord(value) && isCount(value.minutes) && isCount(value.sessions);

const isHabitDay = (value: unknown): value is HabitDay =>
  isRecord(value) && isCount(value.done) && isCount(value.total);

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
    return false;
  }
};

/** Reads a stored list and falls back if the saved data is malformed. */
const readList = <T,>(
  key: string,
  fallback: T[],
  guard: (item: unknown) => item is T
): T[] => {
  const saved = readStorage<unknown>(key, null);
  return Array.isArray(saved) && saved.every(guard) ? saved : fallback;
};

/** Reads a { "YYYY-MM-DD": value } map, dropping malformed entries. */
const readRecord = <T,>(
  key: string,
  guard: (item: unknown) => item is T
): Record<string, T> => {
  const saved = readStorage<unknown>(key, null);
  if (!isRecord(saved)) return {};

  return Object.fromEntries(
    Object.entries(saved).filter(([date, value]) => isDateKey(date) && guard(value))
  ) as Record<string, T>;
};

const readString = (key: string, fallback: string): string => {
  const saved = readStorage<unknown>(key, null);
  return typeof saved === "string" ? saved : fallback;
};

/** useState that mirrors its value into localStorage. */
function usePersistentState<T>(key: string, init: () => T) {
  const [value, setValue] = useState<T>(init);

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

/** Resets habits at the start of a new day and archives yesterday's result. */
function bootHabits(today: string) {
  const habits = readList(KEYS.habits, initialHabits, isHabit);
  const history = readRecord(KEYS.habitHistory, isHabitDay);
  const lastDate = readString(KEYS.habitsDate, "");

  if (lastDate && lastDate !== today) {
    return {
      habits: habits.map((habit) => ({ ...habit, completed: false })),
      history: {
        ...history,
        [lastDate]: {
          done: habits.filter((habit) => habit.completed).length,
          total: habits.length,
        },
      },
    };
  }

  return { habits, history };
}

/* ==========================================================================
   Focus timer hook
   ========================================================================== */

type TimerMode = "focus" | "deep" | "short" | "long";

const TIMER_MODES: Record<
  TimerMode,
  { label: string; minutes: number; focus: boolean; next: TimerMode }
> = {
  focus: { label: "Focus", minutes: 25, focus: true, next: "short" },
  deep: { label: "Deep work", minutes: 50, focus: true, next: "long" },
  short: { label: "Short break", minutes: 5, focus: false, next: "focus" },
  long: { label: "Long break", minutes: 15, focus: false, next: "deep" },
};

type TimerState = { mode: TimerMode; remainingMs: number; endsAt: number | null };

const freshTimer = (mode: TimerMode): TimerState => ({
  mode,
  remainingMs: TIMER_MODES[mode].minutes * 60_000,
  endsAt: null,
});

const isTimerState = (value: unknown): value is TimerState =>
  isRecord(value) &&
  typeof value.mode === "string" &&
  value.mode in TIMER_MODES &&
  typeof value.remainingMs === "number" &&
  (value.endsAt === null || typeof value.endsAt === "number");

const loadTimer = (): TimerState => {
  const saved = readStorage<unknown>(KEYS.timer, null);
  if (!isTimerState(saved)) return freshTimer("focus");

  // A session that ended while the page was closed is not counted.
  if (saved.endsAt !== null && saved.endsAt <= Date.now()) {
    return freshTimer(saved.mode);
  }

  return saved;
};

function useFocusTimer(onFocusComplete: (minutes: number) => void) {
  const [timer, setTimer] = useState<TimerState>(loadTimer);
  const [now, setNow] = useState(() => Date.now());
  const [notice, setNotice] = useState("");

  const onCompleteRef = useRef(onFocusComplete);
  useEffect(() => {
    onCompleteRef.current = onFocusComplete;
  });

  const running = timer.endsAt !== null;
  const remainingMs =
    timer.endsAt !== null ? Math.max(0, timer.endsAt - now) : timer.remainingMs;
  const finished = running && remainingMs === 0;

  useEffect(() => {
    writeStorage(KEYS.timer, timer);
  }, [timer]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const previous = document.title;
    document.title = `${formatClock(remainingMs)} - ${TIMER_MODES[timer.mode].label}`;
    return () => {
      document.title = previous;
    };
  }, [running, remainingMs, timer.mode]);

  useEffect(() => {
    if (!finished) return;
    const config = TIMER_MODES[timer.mode];

    if (config.focus) {
      onCompleteRef.current(config.minutes);
      setNotice(`${config.label} session complete. Take a break.`);
    } else {
      setNotice("Break over. Ready for the next session.");
    }

    setTimer(freshTimer(config.next));
  }, [finished, timer.mode]);

  const start = () => {
    const current = Date.now();
    setNow(current);
    setNotice("");
    setTimer((prev) =>
      prev.endsAt !== null ? prev : { ...prev, endsAt: current + prev.remainingMs }
    );
  };

  const pause = () => {
    const current = Date.now();
    setTimer((prev) =>
      prev.endsAt === null
        ? prev
        : { ...prev, remainingMs: Math.max(0, prev.endsAt - current), endsAt: null }
    );
  };

  const reset = () => {
    setNotice("");
    setTimer((prev) => freshTimer(prev.mode));
  };

  const selectMode = (mode: TimerMode) => {
    setNotice("");
    setTimer(freshTimer(mode));
  };

  const toggle = () => (running ? pause() : start());

  return { timer, running, remainingMs, notice, start, pause, reset, selectMode, toggle };
}

type TimerApi = ReturnType<typeof useFocusTimer>;

/* ==========================================================================
   Style tokens
   ========================================================================== */

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const muted = "text-zinc-500 dark:text-zinc-400";
const strong = "font-medium text-zinc-900 dark:text-zinc-100";

const cardClass =
  "rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-amber-400/70 dark:focus-visible:ring-offset-zinc-950";

const fieldClass =
  "h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-amber-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 sm:h-10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-amber-400/60 dark:focus-visible:ring-amber-400/30";

const primaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-amber-400 sm:h-10";

const quietButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100";

const outlineButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-300 px-3 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800";

const iconButton =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:text-red-500 focus-visible:opacity-100 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100 dark:hover:text-red-400";

const priorityDot: Record<Priority, string> = {
  High: "bg-red-500 dark:bg-red-400",
  Medium: "bg-amber-500 dark:bg-amber-400",
  Low: "bg-zinc-400 dark:bg-zinc-500",
};

/* ==========================================================================
   Shared components
   ========================================================================== */

function Card({
  title,
  subtitle,
  action,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className={cx(cardClass, "p-5", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id={headingId} className="text-base font-semibold tracking-tight">
            {title}
          </h2>
          {subtitle && <p className={cx("mt-0.5 text-sm", muted)}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className="h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
    >
      <div
        className="h-full rounded-full bg-amber-400 transition-[width] duration-300 motion-reduce:transition-none"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  detail,
  progress,
}: {
  icon: IconType;
  label: string;
  value: string;
  detail: string;
  progress?: number;
}) {
  return (
    <div className={cx(cardClass, "p-4")}>
      <p className={cx("flex items-center gap-2 text-xs", muted)}>
        <Icon size={12} aria-hidden="true" />
        {label}
      </p>
      <p className="mt-2 truncate text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      <p className={cx("mt-1 truncate text-xs", muted)}>{detail}</p>
      {progress !== undefined && (
        <div className="mt-3">
          <ProgressBar value={progress} label={`${label} progress`} />
        </div>
      )}
    </div>
  );
}

function CheckCircle({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 motion-reduce:transition-none",
        checked
          ? "border-amber-400 bg-amber-400 text-zinc-950"
          : "border-zinc-300 text-transparent group-hover:border-zinc-400 dark:border-zinc-600 dark:group-hover:border-zinc-500"
      )}
    >
      <FaCheck size={9} />
    </span>
  );
}

/* ==========================================================================
   Tasks
   ========================================================================== */

type TaskActions = {
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

function TaskRow({ task, onToggle, onDelete }: { task: Task } & TaskActions) {
  return (
    <li className="group flex items-start gap-1">
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.title}
        onClick={() => onToggle(task.id)}
        className={cx(
          "-ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10",
          focusRing
        )}
      >
        <CheckCircle checked={task.completed} />
      </button>

      <span
        className={cx(
          "min-w-0 flex-1 break-words py-3 text-sm leading-5 transition-colors duration-200 motion-reduce:transition-none sm:py-2.5",
          task.completed
            ? "text-zinc-500 line-through dark:text-zinc-400"
            : "text-zinc-900 dark:text-zinc-100"
        )}
      >
        {task.title}
      </span>

      {task.category && (
        <span
          className={cx(
            "hidden h-10 shrink-0 items-center text-xs md:flex",
            muted,
            task.completed && "opacity-60"
          )}
        >
          {task.category}
        </span>
      )}

      <span
        className={cx(
          "flex h-11 shrink-0 items-center gap-1.5 text-xs sm:h-10",
          muted,
          task.completed && "opacity-60"
        )}
      >
        <span
          aria-hidden="true"
          className={cx("h-1.5 w-1.5 rounded-full", priorityDot[task.priority])}
        />
        <span className="hidden sm:inline">{task.priority}</span>
        <span className="sr-only sm:hidden">{task.priority} priority</span>
      </span>

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task: ${task.title}`}
        className={cx(iconButton, "h-11 w-11 sm:h-10 sm:w-10", focusRing)}
      >
        <FaTrash size={12} aria-hidden="true" />
      </button>
    </li>
  );
}

function TaskGroup({
  label,
  tasks,
  action,
  onToggle,
  onDelete,
}: {
  label: string;
  tasks: Task[];
  action?: ReactNode;
} & TaskActions) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h3 className={cx("text-xs font-medium", muted)}>
          {label} ({tasks.length})
        </h3>
        {action}
      </div>
      <ul className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
}

/* ==========================================================================
   Focus timer
   ========================================================================== */

const RING_RADIUS = 78;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function FocusTimerCard({
  api,
  todayFocus,
  target,
  onTargetChange,
}: {
  api: TimerApi;
  todayFocus: FocusDay;
  target: number;
  onTargetChange: (value: number) => void;
}) {
  const { timer, running, remainingMs, notice } = api;
  const config = TIMER_MODES[timer.mode];
  const remainingFraction = remainingMs / (config.minutes * 60_000);

  return (
    <Card title="Focus timer" subtitle="Work in short, protected blocks.">
      <div
        role="group"
        aria-label="Timer mode"
        className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/60"
      >
        {(Object.keys(TIMER_MODES) as TimerMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={timer.mode === mode}
            disabled={running}
            onClick={() => api.selectMode(mode)}
            className={cx(
              "rounded-lg px-2 py-2 text-xs transition-colors disabled:cursor-not-allowed",
              timer.mode === mode
                ? "bg-white font-medium text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-100",
              focusRing
            )}
          >
            {TIMER_MODES[mode].label} {TIMER_MODES[mode].minutes}m
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-5 h-44 w-44">
        <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle
            cx="90"
            cy="90"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="6"
            className="stroke-zinc-200 dark:stroke-zinc-800"
          />
          <circle
            cx="90"
            cy="90"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - remainingFraction)}
            className="stroke-amber-400 transition-[stroke-dashoffset] duration-500 ease-linear motion-reduce:transition-none"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-4xl font-semibold tabular-nums tracking-tight">
            {formatClock(remainingMs)}
          </p>
          <p className={cx("mt-1 text-xs", muted)}>
            {running ? `${config.label} in progress` : config.label}
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={api.toggle}
          className={cx(primaryButton, "flex-1", focusRing)}
        >
          {running ? (
            <FaPause size={11} aria-hidden="true" />
          ) : (
            <FaPlay size={11} aria-hidden="true" />
          )}
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={api.reset}
          aria-label="Reset timer"
          className={cx(quietButton, "border border-zinc-300 dark:border-zinc-700", focusRing)}
        >
          <FaRotateLeft size={12} aria-hidden="true" />
        </button>
      </div>

      <p role="status" className={cx("mt-3 min-h-5 text-center text-xs", muted)}>
        {notice}
      </p>

      <div className="mt-2 flex items-center justify-between gap-3 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
        <p className={muted}>
          <span className={strong}>{todayFocus.minutes} min</span> today,{" "}
          {todayFocus.sessions} {todayFocus.sessions === 1 ? "session" : "sessions"}
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="focus-target" className={cx("text-xs", muted)}>
            Daily target
          </label>
          <select
            id="focus-target"
            value={target}
            onChange={(event) => onTargetChange(Number(event.target.value))}
            className="h-9 rounded-lg border border-zinc-300 bg-white px-2 text-xs text-zinc-900 focus:border-amber-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {FOCUS_TARGETS.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} min
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}

/* ==========================================================================
   Habits
   ========================================================================== */

function HabitsCard({
  habits,
  onToggle,
  onAdd,
  onDelete,
}: {
  habits: Habit[];
  onToggle: (id: number) => void;
  onAdd: (title: string) => void;
  onDelete: (id: number) => void;
}) {
  const [input, setInput] = useState("");
  const done = habits.filter((habit) => habit.completed).length;
  const allDone = habits.length > 0 && done === habits.length;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = input.trim();
    if (!title) return;
    onAdd(title);
    setInput("");
  };

  return (
    <Card
      title="Daily habits"
      subtitle="Resets every morning."
      action={
        <p className={cx("pt-0.5 text-sm tabular-nums", muted)}>
          {done} of {habits.length}
        </p>
      }
    >
      {habits.length === 0 ? (
        <p className={cx("text-sm", muted)}>No habits yet. Add one below.</p>
      ) : (
        <ul className="space-y-1">
          {habits.map((habit) => (
            <li key={habit.id} className="group flex items-center gap-1">
              <button
                type="button"
                onClick={() => onToggle(habit.id)}
                aria-pressed={habit.completed}
                className={cx(
                  "-ml-2 flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg px-2 text-left text-sm transition-colors hover:bg-zinc-100 sm:min-h-10 dark:hover:bg-zinc-800/60",
                  focusRing
                )}
              >
                <CheckCircle checked={habit.completed} />
                <span
                  className={cx(
                    "min-w-0 flex-1 break-words transition-colors duration-200 motion-reduce:transition-none",
                    habit.completed && muted
                  )}
                >
                  {habit.title}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(habit.id)}
                aria-label={`Remove habit: ${habit.title}`}
                className={cx(iconButton, focusRing)}
              >
                <FaXmark size={12} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p role="status" className={cx("mt-3 min-h-5 text-xs", muted)}>
        {allDone ? "All habits done for today." : ""}
      </p>

      <form onSubmit={submit} className="mt-2 flex gap-2">
        <label htmlFor="new-habit" className="sr-only">
          New habit
        </label>
        <input
          id="new-habit"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Add a habit"
          autoComplete="off"
          className={fieldClass}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Add habit"
          className={cx(primaryButton, "w-11 shrink-0 px-0 sm:w-10", focusRing)}
        >
          <FaPlus size={11} aria-hidden="true" />
        </button>
      </form>
    </Card>
  );
}

/* ==========================================================================
   Deadlines
   ========================================================================== */

function DeadlinesCard({
  deadlines,
  setDeadlines,
  today,
}: {
  deadlines: Deadline[];
  setDeadlines: (update: (current: Deadline[]) => Deadline[]) => void;
  today: string;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [kind, setKind] = useState<DeadlineKind>("Assignment");

  const sorted = useMemo(
    () => [...deadlines].sort((a, b) => a.date.localeCompare(b.date)),
    [deadlines]
  );

  const add = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = title.trim();
    if (!value || !isDateKey(date)) return;

    setDeadlines((current) => [...current, { id: Date.now(), title: value, date, kind }]);
    setTitle("");
  };

  return (
    <Card title="Deadlines" subtitle="Exams, submissions, interviews.">
      <form onSubmit={add} className="space-y-2">
        <label htmlFor="deadline-title" className="sr-only">
          Deadline title
        </label>
        <input
          id="deadline-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What is due?"
          autoComplete="off"
          className={fieldClass}
        />

        <div className="flex gap-2">
          <label htmlFor="deadline-date" className="sr-only">
            Due date
          </label>
          <input
            id="deadline-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={cx(fieldClass, "min-w-0 flex-1 dark:[color-scheme:dark]")}
          />

          <label htmlFor="deadline-kind" className="sr-only">
            Deadline type
          </label>
          <select
            id="deadline-kind"
            value={kind}
            onChange={(event) => setKind(event.target.value as DeadlineKind)}
            className={cx(fieldClass, "w-28 shrink-0")}
          >
            {DEADLINE_KINDS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!title.trim() || !isDateKey(date)}
            aria-label="Add deadline"
            className={cx(primaryButton, "w-11 shrink-0 px-0 sm:w-10", focusRing)}
          >
            <FaPlus size={11} aria-hidden="true" />
          </button>
        </div>
      </form>

      {sorted.length === 0 ? (
        <p className={cx("mt-5 text-sm", muted)}>
          Nothing due. Add an exam, submission, or interview date to see a countdown.
        </p>
      ) : (
        <ul className="mt-4 max-h-64 divide-y divide-zinc-200 overflow-y-auto border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {sorted.map((item) => {
            const days = daysBetween(today, item.date);

            return (
              <li key={item.id} className="group flex items-center gap-2 py-2">
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm leading-5">{item.title}</p>
                  <p className={cx("text-xs", muted)}>
                    {item.kind},{" "}
                    {parseDateKey(item.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>

                <span
                  className={cx(
                    "shrink-0 text-xs font-medium",
                    days < 0
                      ? "text-red-600 dark:text-red-400"
                      : days === 0
                        ? "text-amber-600 dark:text-amber-400"
                        : muted
                  )}
                >
                  {describeDays(days)}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setDeadlines((current) => current.filter((entry) => entry.id !== item.id))
                  }
                  aria-label={`Remove deadline: ${item.title}`}
                  className={cx(iconButton, focusRing)}
                >
                  <FaTrash size={12} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

/* ==========================================================================
   Weekly activity
   ========================================================================== */

type WeekDay = { key: string; label: string; minutes: number; tasks: number };

function WeekCard({ week, today }: { week: WeekDay[]; today: string }) {
  const maxMinutes = Math.max(...week.map((day) => day.minutes), 0);
  const totalMinutes = week.reduce((sum, day) => sum + day.minutes, 0);
  const totalTasks = week.reduce((sum, day) => sum + day.tasks, 0);

  return (
    <Card title="This week" subtitle="Focus minutes and tasks completed.">
      {totalMinutes === 0 && totalTasks === 0 ? (
        <p className={cx("py-6 text-sm", muted)}>
          Finish a focus session or complete a task to see your week.
        </p>
      ) : (
        <>
          <div className="flex gap-2" aria-hidden="true">
            {week.map((day) => (
              <div key={day.key} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-24 w-full items-end">
                  <div
                    className="w-full rounded-md bg-amber-400/80 transition-[height] duration-300 motion-reduce:transition-none"
                    style={{
                      height: maxMinutes > 0 ? `${(day.minutes / maxMinutes) * 100}%` : "0%",
                      minHeight: day.minutes > 0 ? 4 : 0,
                    }}
                  />
                </div>
                <span
                  className={cx(
                    "text-xs",
                    day.key === today ? strong : muted
                  )}
                >
                  {day.label}
                </span>
                <span className={cx("text-xs tabular-nums", muted)}>{day.tasks}</span>
              </div>
            ))}
          </div>

          <p className={cx("mt-3 text-xs", muted)}>
            Bars show focus minutes. Numbers show tasks completed. Total: {totalMinutes} min,{" "}
            {totalTasks} {totalTasks === 1 ? "task" : "tasks"}.
          </p>

          <ul className="sr-only">
            {week.map((day) => (
              <li key={day.key}>
                {day.label}: {day.minutes} focus minutes, {day.tasks} tasks completed
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}

/* ==========================================================================
   Page
   ========================================================================== */

const PersonalSpace = () => {
  const today = toDateKey(new Date());

  const [boot] = useState(() => bootHabits(today));

  const [tasks, setTasks] = usePersistentState<Task[]>(KEYS.tasks, () =>
    readList(KEYS.tasks, initialTasks, isTask)
  );
  const [habits, setHabits] = usePersistentState<Habit[]>(KEYS.habits, () => boot.habits);
  const [habitHistory] = usePersistentState<Record<string, HabitDay>>(
    KEYS.habitHistory,
    () => boot.history
  );
  const [taskLog, setTaskLog] = usePersistentState<Record<string, number>>(KEYS.taskLog, () =>
    readRecord(KEYS.taskLog, isCount)
  );
  const [focusLog, setFocusLog] = usePersistentState<Record<string, FocusDay>>(
    KEYS.focusLog,
    () => readRecord(KEYS.focusLog, isFocusDay)
  );
  const [deadlines, setDeadlines] = usePersistentState<Deadline[]>(KEYS.deadlines, () =>
    readList(KEYS.deadlines, [], isDeadline)
  );
  const [focusTarget, setFocusTarget] = usePersistentState<number>(KEYS.focusTarget, () => {
    const saved = readStorage<unknown>(KEYS.focusTarget, null);
    return FOCUS_TARGETS.includes(saved as (typeof FOCUS_TARGETS)[number])
      ? (saved as number)
      : DEFAULT_FOCUS_TARGET;
  });
  const [goal, setGoal] = usePersistentState<string>(KEYS.goal, () =>
    readString(KEYS.goal, DEFAULT_GOAL)
  );

  /* Task form */
  const [taskInput, setTaskInput] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [category, setCategory] = useState<Category>("Study");
  const [filter, setFilter] = useState<"All" | Category>("All");

  /* Goal */
  const [goalInput, setGoalInput] = useState(goal);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalSaved, setGoalSaved] = useState(false);

  /* Journal */
  const [journal, setJournal] = useState(() => readString(KEYS.journal(today), ""));
  const [savedJournal, setSavedJournal] = useState(journal);
  const [journalError, setJournalError] = useState(false);

  /* Backup */
  const [backupMessage, setBackupMessage] = useState("");

  const newTaskRef = useRef<HTMLInputElement>(null);
  const goalInputRef = useRef<HTMLInputElement>(null);
  const goalEditButtonRef = useRef<HTMLButtonElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const goalTimerRef = useRef<number | undefined>(undefined);
  const backupTimerRef = useRef<number | undefined>(undefined);

  /* Focus timer: log finished focus sessions per day */
  const timer = useFocusTimer((minutes) => {
    const date = toDateKey(new Date());
    setFocusLog((current) => ({
      ...current,
      [date]: {
        minutes: (current[date]?.minutes ?? 0) + minutes,
        sessions: (current[date]?.sessions ?? 0) + 1,
      },
    }));
  });

  const toggleTimerRef = useRef(timer.toggle);
  useEffect(() => {
    toggleTimerRef.current = timer.toggle;
  });

  useEffect(() => {
    writeStorage(KEYS.habitsDate, today);
  }, [today]);

  useEffect(() => {
    if (editingGoal) goalInputRef.current?.focus();
  }, [editingGoal]);

  useEffect(
    () => () => {
      window.clearTimeout(goalTimerRef.current);
      window.clearTimeout(backupTimerRef.current);
    },
    []
  );

  /* Keyboard shortcuts: N = new task, T = start or pause timer */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "n") {
        event.preventDefault();
        newTaskRef.current?.focus();
      } else if (event.key === "t") {
        event.preventDefault();
        toggleTimerRef.current();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /* Derived data */
  const visibleTasks = filter === "All" ? tasks : tasks.filter((t) => t.category === filter);
  const todoTasks = visibleTasks.filter((task) => !task.completed);
  const doneTasks = visibleTasks.filter((task) => task.completed);

  const totalDone = tasks.filter((task) => task.completed).length;
  const totalLeft = tasks.length - totalDone;
  const taskProgress = tasks.length > 0 ? (totalDone / tasks.length) * 100 : 0;

  const todayFocus = focusLog[today] ?? { minutes: 0, sessions: 0 };
  const focusProgress = focusTarget > 0 ? (todayFocus.minutes / focusTarget) * 100 : 0;

  const streak = useMemo(() => {
    const active = new Set<string>();

    Object.entries(habitHistory).forEach(([date, day]) => day.done > 0 && active.add(date));
    Object.entries(taskLog).forEach(([date, count]) => count > 0 && active.add(date));
    Object.entries(focusLog).forEach(([date, day]) => day.sessions > 0 && active.add(date));
    if (habits.some((habit) => habit.completed)) active.add(today);

    return computeStreak(active, today);
  }, [habitHistory, taskLog, focusLog, habits, today]);

  const nextDeadline = useMemo(
    () =>
      [...deadlines]
        .filter((item) => item.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))[0],
    [deadlines, today]
  );

  const week = useMemo<WeekDay[]>(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const key = shiftDate(today, index - 6);
        return {
          key,
          label: parseDateKey(key).toLocaleDateString("en-IN", { weekday: "short" }),
          minutes: focusLog[key]?.minutes ?? 0,
          tasks: taskLog[key] ?? 0,
        };
      }),
    [focusLog, taskLog, today]
  );

  const journalDirty = journal !== savedJournal;
  const journalStatus = journalError
    ? "Could not save. Browser storage may be full or blocked."
    : journalDirty
      ? "Unsaved changes"
      : journal.trim()
        ? "Saved on this device"
        : "Stored in this browser only";

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const summary =
    tasks.length === 0
      ? "Add a task to plan your day."
      : totalLeft === 0
        ? "Everything on your list is done."
        : `${totalLeft} ${totalLeft === 1 ? "task" : "tasks"} left today.`;

  /* Task actions */
  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = taskInput.trim();
    if (!title) return;

    setTasks((current) => [
      ...current,
      { id: Date.now(), title, priority, category, completed: false },
    ]);

    setTaskInput("");
    setPriority("Medium");
  };

  const toggleTask = (id: number) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    const completing = !task.completed;

    setTasks((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, completed: completing, completedAt: completing ? today : undefined }
          : item
      )
    );

    const logDate = completing ? today : task.completedAt;
    if (logDate) {
      setTaskLog((current) => ({
        ...current,
        [logDate]: Math.max(0, (current[logDate] ?? 0) + (completing ? 1 : -1)),
      }));
    }
  };

  const deleteTask = (id: number) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks((current) => current.filter((task) => !task.completed));
  };

  /* Habit actions */
  const toggleHabit = (id: number) => {
    setHabits((current) =>
      current.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const addHabit = (title: string) => {
    setHabits((current) => [...current, { id: Date.now(), title, completed: false }]);
  };

  const deleteHabit = (id: number) => {
    setHabits((current) => current.filter((habit) => habit.id !== id));
  };

  /* Goal actions */
  const closeGoalEditor = () => {
    setEditingGoal(false);
    requestAnimationFrame(() => goalEditButtonRef.current?.focus());
  };

  const saveGoal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = goalInput.trim();
    if (!value) return;

    setGoal(value);
    setGoalSaved(true);
    window.clearTimeout(goalTimerRef.current);
    goalTimerRef.current = window.setTimeout(() => setGoalSaved(false), 2500);

    closeGoalEditor();
  };

  const handleGoalKeyDown = (event: ReactKeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Escape") closeGoalEditor();
  };

  /* Journal actions */
  const saveJournal = () => {
    const saved = writeStorage(KEYS.journal(today), journal);
    setJournalError(!saved);
    if (saved) setSavedJournal(journal);
  };

  /* Backup actions */
  const flash = (message: string) => {
    setBackupMessage(message);
    window.clearTimeout(backupTimerRef.current);
    backupTimerRef.current = window.setTimeout(() => setBackupMessage(""), 4000);
  };

  const exportData = () => {
    const data: Record<string, unknown> = {};

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key && key.startsWith("personal-") && key !== KEYS.timer) {
        data[key] = readStorage<unknown>(key, null);
      }
    }

    const blob = new Blob(
      [
        JSON.stringify(
          {
            app: "secondbrain-personal-space",
            version: 1,
            exportedAt: new Date().toISOString(),
            data,
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `personal-space-${today}.json`;
    link.click();
    URL.revokeObjectURL(url);

    flash("Backup downloaded.");
  };

  const importData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const parsed: unknown = JSON.parse(await file.text());
      const data = isRecord(parsed) ? parsed.data : null;
      if (!isRecord(data)) throw new Error("Invalid backup");

      const entries = Object.entries(data).filter(
        ([key]) => key.startsWith("personal-") && key !== KEYS.timer
      );
      if (entries.length === 0) throw new Error("Empty backup");

      const confirmed = window.confirm(
        "Importing overwrites matching Personal Space data on this device. Continue?"
      );
      if (!confirmed) return;

      entries.forEach(([key, value]) => writeStorage(key, value));
      window.location.reload();
    } catch {
      flash("That file is not a valid Personal Space backup.");
    }
  };

  return (
    <main className="min-h-screen w-full bg-zinc-50 px-4 py-8 text-zinc-900 transition-colors sm:px-6 lg:px-8 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Personal Space
            </h1>
            <p className={cx("mt-1 text-sm", muted)}>
              {getGreeting(new Date().getHours())}.{" "}
              <time dateTime={today}>{formattedDate}</time>. {summary}
            </p>
            <p className={cx("mt-1 hidden text-xs sm:block", muted)}>
              Shortcuts:{" "}
              <kbd className="rounded border border-zinc-300 px-1.5 py-0.5 font-sans dark:border-zinc-700">
                N
              </kbd>{" "}
              new task,{" "}
              <kbd className="rounded border border-zinc-300 px-1.5 py-0.5 font-sans dark:border-zinc-700">
                T
              </kbd>{" "}
              start or pause timer
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={exportData}
                className={cx(outlineButton, focusRing)}
              >
                <FaDownload size={12} aria-hidden="true" />
                Export
              </button>
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className={cx(outlineButton, focusRing)}
              >
                <FaUpload size={12} aria-hidden="true" />
                Import
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json,.json"
                onChange={importData}
                className="sr-only"
                tabIndex={-1}
                aria-label="Import backup file"
              />
            </div>
            <p role="status" className={cx("min-h-4 text-xs", muted)}>
              {backupMessage}
            </p>
          </div>
        </header>

        {/* Overview */}
        <section aria-label="Daily overview" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            icon={FaListCheck}
            label="Tasks"
            value={`${totalDone}/${tasks.length}`}
            detail={totalLeft === 0 && tasks.length > 0 ? "All done" : `${totalLeft} left`}
            progress={taskProgress}
          />
          <StatTile
            icon={FaStopwatch}
            label="Focus today"
            value={`${todayFocus.minutes} min`}
            detail={`Target ${focusTarget} min`}
            progress={focusProgress}
          />
          <StatTile
            icon={FaFire}
            label="Day streak"
            value={`${streak} ${streak === 1 ? "day" : "days"}`}
            detail={streak > 0 ? "Active days in a row" : "Do one thing today to start"}
          />
          <StatTile
            icon={FaCalendarDays}
            label="Next deadline"
            value={nextDeadline ? describeDays(daysBetween(today, nextDeadline.date)) : "None"}
            detail={nextDeadline ? nextDeadline.title : "No upcoming deadlines"}
          />
        </section>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="space-y-6 lg:col-span-8">
            {/* Tasks */}
            <Card
              title="Today's tasks"
              subtitle="Plan the work, then protect time for it."
              action={
                <p className={cx("pt-0.5 text-sm tabular-nums", muted)}>
                  {todoTasks.length} left
                </p>
              }
            >
              <form onSubmit={addTask} className="space-y-2">
                <label htmlFor="new-task" className="sr-only">
                  New task
                </label>
                <input
                  id="new-task"
                  ref={newTaskRef}
                  value={taskInput}
                  onChange={(event) => setTaskInput(event.target.value)}
                  placeholder="What do you want to get done?"
                  autoComplete="off"
                  className={fieldClass}
                />

                <div className="flex gap-2">
                  <label htmlFor="task-category" className="sr-only">
                    Task category
                  </label>
                  <select
                    id="task-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value as Category)}
                    className={cx(fieldClass, "min-w-0 flex-1 sm:w-32 sm:flex-none")}
                  >
                    {CATEGORIES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="task-priority" className="sr-only">
                    Task priority
                  </label>
                  <select
                    id="task-priority"
                    value={priority}
                    onChange={(event) => setPriority(event.target.value as Priority)}
                    className={cx(fieldClass, "min-w-0 flex-1 sm:w-28 sm:flex-none")}
                  >
                    {PRIORITIES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    disabled={!taskInput.trim()}
                    className={cx(primaryButton, "ml-auto", focusRing)}
                  >
                    <FaPlus size={11} aria-hidden="true" />
                    Add task
                  </button>
                </div>
              </form>

              {tasks.length > 0 && (
                <div
                  role="group"
                  aria-label="Filter tasks by category"
                  className="mt-4 flex flex-wrap gap-1.5"
                >
                  {(["All", ...CATEGORIES] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={filter === option}
                      onClick={() => setFilter(option)}
                      className={cx(
                        "rounded-full border px-3 py-1 text-xs transition-colors",
                        filter === option
                          ? "border-amber-400/60 bg-amber-400/10 text-zinc-900 dark:text-amber-300"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800",
                        focusRing
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {tasks.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center dark:border-zinc-800">
                  <p className="text-sm font-medium">No tasks yet</p>
                  <p className={cx("mt-1 text-sm", muted)}>
                    Add the one thing that would make today a good day.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-6">
                  {todoTasks.length > 0 ? (
                    <TaskGroup
                      label="To do"
                      tasks={todoTasks}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ) : (
                    <p className={cx("py-2 text-sm", muted)}>
                      {filter === "All"
                        ? "Everything on your list is done."
                        : `Nothing left in ${filter}.`}
                    </p>
                  )}

                  {doneTasks.length > 0 && (
                    <TaskGroup
                      label="Completed"
                      tasks={doneTasks}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      action={
                        <button
                          type="button"
                          onClick={clearCompleted}
                          className={cx(
                            "rounded px-1 text-xs underline-offset-2 hover:underline",
                            muted,
                            focusRing
                          )}
                        >
                          Clear all completed
                        </button>
                      }
                    />
                  )}
                </div>
              )}
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <WeekCard week={week} today={today} />
              <DeadlinesCard
                deadlines={deadlines}
                setDeadlines={setDeadlines}
                today={today}
              />
            </div>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <FocusTimerCard
              api={timer}
              todayFocus={todayFocus}
              target={focusTarget}
              onTargetChange={setFocusTarget}
            />
            <HabitsCard
              habits={habits}
              onToggle={toggleHabit}
              onAdd={addHabit}
              onDelete={deleteHabit}
            />
          </div>
        </div>

        {/* Goal and journal */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <Card title="Current goal" subtitle="Keep your focus in sight." className="lg:col-span-4">
            {editingGoal ? (
              <form onSubmit={saveGoal} onKeyDown={handleGoalKeyDown} className="space-y-3">
                <label htmlFor="goal-input" className="sr-only">
                  Edit current goal
                </label>
                <input
                  id="goal-input"
                  ref={goalInputRef}
                  value={goalInput}
                  onChange={(event) => setGoalInput(event.target.value)}
                  className={fieldClass}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!goalInput.trim()}
                    className={cx(primaryButton, focusRing)}
                  >
                    Save goal
                  </button>
                  <button
                    type="button"
                    onClick={closeGoalEditor}
                    className={cx(quietButton, focusRing)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="break-words text-base leading-7">{goal}</p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    ref={goalEditButtonRef}
                    type="button"
                    onClick={() => {
                      setGoalInput(goal);
                      setEditingGoal(true);
                    }}
                    className={cx(quietButton, "-ml-3", focusRing)}
                  >
                    <FaPen size={11} aria-hidden="true" />
                    Edit goal
                  </button>
                  <span role="status" className={cx("text-xs", muted)}>
                    {goalSaved ? "Goal updated" : ""}
                  </span>
                </div>
              </>
            )}
          </Card>

          <Card
            title="Daily reflection"
            subtitle="What mattered today?"
            className="lg:col-span-8"
          >
            <label htmlFor="journal-input" className="sr-only">
              Daily reflection
            </label>
            <textarea
              id="journal-input"
              value={journal}
              onChange={(event) => {
                setJournal(event.target.value);
                setJournalError(false);
              }}
              rows={5}
              placeholder="A thought, a win, or something to remember..."
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white p-3 text-sm leading-6 text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-amber-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-amber-400/60 dark:focus-visible:ring-amber-400/30"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <p
                role="status"
                className={cx(
                  "min-w-0 text-xs",
                  journalError ? "text-red-600 dark:text-red-400" : muted
                )}
              >
                {journalStatus}
              </p>
              <button
                type="button"
                onClick={saveJournal}
                disabled={!journalDirty}
                className={cx(primaryButton, "shrink-0", focusRing)}
              >
                Save note
              </button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default PersonalSpace;