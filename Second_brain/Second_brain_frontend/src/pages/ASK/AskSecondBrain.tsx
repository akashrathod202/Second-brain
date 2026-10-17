import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { IconType } from "react-icons";
import {
  FaArrowLeft,
  FaArrowUp,
  FaArrowUpRightFromSquare,
  FaBookmark,
  FaBookOpen,
  FaBrain,
  FaCheck,
  FaCircleExclamation,
  FaCopy,
  FaFileLines,
  FaLightbulb,
  FaLink,
  FaMagnifyingGlass,
  FaPenToSquare,
  FaRotateRight,
  FaVideo,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

/* =========================================================
   TYPES
========================================================= */

type Source = {
  id: string;
  title: string;
  type: string;
  url?: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

type AskResult = {
  answer: string;
  sources: Source[];
};

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

type ChatError = {
  message: string;
  question: string;
};

/* =========================================================
   CONFIGURATION
========================================================= */

const configuredApiBase =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "http://localhost:8000";

const API_BASE = configuredApiBase
  .replace(/\/+$/, "")
  .replace(/\/api\/v1$/i, "");

const ASK_ENDPOINT = `${API_BASE}/api/v1/ai/ask`;

const MAX_TEXTAREA_HEIGHT = 160;

/* =========================================================
   SUGGESTIONS
========================================================= */

const SUGGESTIONS: {
  icon: IconType;
  text: string;
}[] = [
  {
    icon: FaMagnifyingGlass,
    text: "Find my React notes",
  },
  {
    icon: FaLightbulb,
    text: "Explain what I saved about APIs",
  },
  {
    icon: FaBookOpen,
    text: "Summarize my Node.js resources",
  },
  {
    icon: FaLink,
    text: "Find useful links I saved",
  },
];

const SOURCE_TYPES: Record<
  string,
  {
    label: string;
    icon: IconType;
  }
> = {
  link: {
    label: "Link",
    icon: FaLink,
  },
  note: {
    label: "Note",
    icon: FaFileLines,
  },
  video: {
    label: "Video",
    icon: FaVideo,
  },
  videos: {
    label: "Video",
    icon: FaVideo,
  },
  article: {
    label: "Article",
    icon: FaBookOpen,
  },
};

/* =========================================================
   HELPERS
========================================================= */

let idCounter = 0;

const nextId = () => `m-${Date.now()}-${idCounter++}`;

const cx = (
  ...classes: Array<string | false | null | undefined>
) => classes.filter(Boolean).join(" ");

const isRecord = (
  value: unknown
): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isSafeUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);

    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

const getSourceMeta = (type: string) => {
  const key = type.toLowerCase();

  return (
    SOURCE_TYPES[key] ?? {
      label: key
        ? key.charAt(0).toUpperCase() + key.slice(1)
        : "Item",
      icon: FaBookmark,
    }
  );
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

/* =========================================================
   API ERROR HANDLING
========================================================= */

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const messageForStatus = (status: number) => {
  if (status === 401 || status === 403) {
    return "Your session has expired. Sign in again to continue.";
  }

  if (status === 429) {
    return "Too many requests. Wait a moment, then try again.";
  }

  if (status >= 500) {
    return "The AI service ran into a problem. Try again in a moment.";
  }

  return "The request could not be completed. Try again.";
};

const readServerMessage = (
  payload: unknown
): string | null => {
  if (!isRecord(payload)) {
    return null;
  }

  const candidate = payload.message ?? payload.error;

  return typeof candidate === "string" && candidate.trim()
    ? candidate
    : null;
};

const normalizeSources = (raw: unknown): Source[] => {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.filter(isRecord).map((item, index) => {
    const id = item._id ?? item.id ?? index;
    const title = item.title ?? item.name;
    const type = item.type ?? item.contentType;
    const url = item.url ?? item.link;

    return {
      id: String(id),
      title:
        typeof title === "string" && title.trim()
          ? title
          : "Untitled item",
      type: typeof type === "string" ? type : "",
      url:
        typeof url === "string" && isSafeUrl(url)
          ? url
          : undefined,
    };
  });
};

/* =========================================================
   API REQUEST
   IMPORTANT:
   - Read JWT from localStorage.
   - Send Authorization: Bearer <token>.
   - Use this same function for sending and retrying.
========================================================= */

async function askSecondBrain(
  question: string,
  history: ChatTurn[],
  signal: AbortSignal
): Promise<AskResult> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new ApiError(
      "Your session is missing. Please sign in again.",
      401
    );
  }

  const response = await fetch(ASK_ENDPOINT, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    credentials: "include",

    body: JSON.stringify({
      question,
      history,
    }),

    signal,
  });

  const payload: unknown = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      readServerMessage(payload) ??
        messageForStatus(response.status),
      response.status
    );
  }

  const data =
    isRecord(payload) && isRecord(payload.data)
      ? payload.data
      : payload;

  if (!isRecord(data)) {
    throw new ApiError(
      "The AI service returned an unexpected response."
    );
  }

  const answer =
    data.answer ?? data.response ?? data.message;

  if (
    typeof answer !== "string" ||
    !answer.trim()
  ) {
    throw new ApiError(
      "The AI service returned an empty answer."
    );
  }

  return {
    answer,
    sources: normalizeSources(data.sources),
  };
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof TypeError) {
    return "Could not reach the server. Check your connection and try again.";
  }

  return "Something went wrong. Try again.";
};

/* =========================================================
   AVATAR
========================================================= */

function Avatar() {
  return (
    <div
      aria-hidden="true"
      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900"
    >
      <FaBrain
        size={13}
        className="text-amber-400"
      />
    </div>
  );
}

/* =========================================================
   STATUS INDICATOR
========================================================= */

function StatusIndicator({
  busy,
}: {
  busy: boolean;
}) {
  return (
    <div
      role="status"
      className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-400"
    >
      <span
        aria-hidden="true"
        className={cx(
          "h-1.5 w-1.5 rounded-full",
          busy
            ? "bg-amber-400 motion-safe:animate-pulse"
            : "bg-emerald-500"
        )}
      />

      <span>{busy ? "Thinking…" : "Ready"}</span>
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

type HeaderProps = {
  busy: boolean;
  canReset: boolean;
  onBack: () => void;
  onReset: () => void;
};

function Header({
  busy,
  canReset,
  onBack,
  onReset,
}: HeaderProps) {
  return (
    <header className="shrink-0 border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className={cx(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white",
              focusRing
            )}
          >
            <FaArrowLeft size={13} />
          </button>

          <div className="flex min-w-0 items-center gap-2.5">
            <div
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900"
            >
              <FaBrain
                size={13}
                className="text-amber-400"
              />
            </div>

            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold text-zinc-100">
                SecondBrain
              </p>

              <p className="hidden truncate text-xs text-zinc-500 sm:block">
                AI Knowledge Assistant
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <StatusIndicator busy={busy} />

          <button
            type="button"
            onClick={onReset}
            disabled={!canReset}
            className={cx(
              "inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-800 px-3 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-300",
              focusRing
            )}
          >
            <FaPenToSquare
              size={12}
              aria-hidden="true"
            />

            <span className="hidden sm:inline">
              New chat
            </span>

            <span className="sr-only sm:hidden">
              New chat
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   WELCOME SCREEN
========================================================= */

function Welcome({
  onPick,
}: {
  onPick: (text: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
      <div
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900"
      >
        <FaBrain
          size={20}
          className="text-amber-400"
        />
      </div>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
        Your knowledge, one question away.
      </h1>

      <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
        Chat naturally, ask general questions, or let
        SecondBrain use your saved notes, links, and
        resources when they are relevant.
      </p>

      <ul className="mt-8 grid w-full max-w-xl gap-2 text-left sm:grid-cols-2">
        {SUGGESTIONS.map(({ icon: Icon, text }) => (
          <li key={text}>
            <button
              type="button"
              onClick={() => onPick(text)}
              className={cx(
                "flex w-full items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-3 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-white",
                focusRing
              )}
            >
              <Icon
                size={13}
                aria-hidden="true"
                className="shrink-0 text-zinc-500"
              />

              <span>{text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =========================================================
   SOURCE CARD
========================================================= */

function SourceCard({
  source,
}: {
  source: Source;
}) {
  const {
    label,
    icon: Icon,
  } = getSourceMeta(source.type);

  const body = (
    <>
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-zinc-400"
      >
        <Icon size={12} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-zinc-200">
          {source.title}
        </span>

        <span className="block text-xs text-zinc-500">
          {label}
        </span>
      </span>

      {source.url && (
        <FaArrowUpRightFromSquare
          size={10}
          aria-hidden="true"
          className="shrink-0 text-zinc-600 transition-colors group-hover:text-zinc-300"
        />
      )}
    </>
  );

  const base =
    "group flex w-full items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-2 text-left sm:max-w-[16rem]";

  if (!source.url) {
    return (
      <div className={base}>
        {body}
      </div>
    );
  }

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        base,
        "transition-colors hover:border-zinc-700 hover:bg-zinc-800/70",
        focusRing
      )}
    >
      {body}

      <span className="sr-only">
        (opens in a new tab)
      </span>
    </a>
  );
}

/* =========================================================
   SOURCE LIST
========================================================= */

function SourceList({
  sources,
}: {
  sources: Source[];
}) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Sources"
      className="mt-4"
    >
      <p className="mb-2 text-xs font-medium text-zinc-500">
        Sources ({sources.length})
      </p>

      <ul className="flex flex-wrap gap-2">
        {sources.map((source) => (
          <li
            key={source.id}
            className="w-full sm:w-auto"
          >
            <SourceCard source={source} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* =========================================================
   MESSAGE
========================================================= */

type MessageItemProps = {
  message: Message;
  copied: boolean;
  onCopy: (id: string, content: string) => void;
};

function MessageItem({
  message,
  copied,
  onCopy,
}: MessageItemProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-zinc-800 px-4 py-2.5 text-sm leading-6 text-zinc-100 sm:max-w-[75%]">
          <span className="sr-only">
            You:
          </span>

          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Avatar />

      <div className="min-w-0 flex-1">
        <div className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-200">
          <span className="sr-only">
            SecondBrain:
          </span>

          {message.content}
        </div>

        <SourceList
          sources={message.sources ?? []}
        />

        <button
          type="button"
          onClick={() =>
            onCopy(message.id, message.content)
          }
          className={cx(
            "mt-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200",
            focusRing
          )}
        >
          {copied ? (
            <FaCheck
              size={10}
              aria-hidden="true"
              className="text-emerald-500"
            />
          ) : (
            <FaCopy
              size={10}
              aria-hidden="true"
            />
          )}

          <span aria-live="polite">
            {copied
              ? "Copied"
              : "Copy response"}
          </span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   THINKING INDICATOR
========================================================= */

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <Avatar />

      <div
        className="flex items-center gap-1.5 py-2"
        aria-hidden="true"
      >
        {["-0.3s", "-0.15s", "0s"].map((delay) => (
          <span
            key={delay}
            style={{
              animationDelay: delay,
            }}
            className="h-1.5 w-1.5 rounded-full bg-zinc-500 motion-safe:animate-bounce"
          />
        ))}
      </div>

      <span className="sr-only">
        SecondBrain is thinking
      </span>
    </div>
  );
}

/* =========================================================
   ERROR NOTICE
========================================================= */

type ErrorNoticeProps = {
  error: ChatError;
  disabled: boolean;
  onRetry: () => void;
};

function ErrorNotice({
  error,
  disabled,
  onRetry,
}: ErrorNoticeProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4"
    >
      <FaCircleExclamation
        size={14}
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-red-400"
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-100">
          Could not get an answer
        </p>

        <p className="mt-1 text-sm leading-6 text-zinc-400">
          {error.message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          disabled={disabled}
          className={cx(
            "mt-3 inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50",
            focusRing
          )}
        >
          <FaRotateRight
            size={10}
            aria-hidden="true"
          />

          Try again
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   MESSAGE COMPOSER
========================================================= */

type ComposerProps = {
  value: string;
  loading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

function Composer({
  value,
  loading,
  textareaRef,
  onChange,
  onSubmit,
}: ComposerProps) {
  const canSend =
    value.trim().length > 0 && !loading;

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing
    ) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="shrink-0 border-t border-zinc-800 bg-zinc-950 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex items-end gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-2 transition-colors focus-within:border-amber-400/50"
        >
          <label
            htmlFor="ask-secondbrain-input"
            className="sr-only"
          >
            Ask your Second Brain
          </label>

          <textarea
            id="ask-secondbrain-input"
            ref={textareaRef}
            value={value}
            onChange={(e) =>
              onChange(e.target.value)
            }
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask about your saved notes, links, and resources"
            className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-2.5 py-2 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-500"
          />

          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            className={cx(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-zinc-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600",
              focusRing
            )}
          >
            <FaArrowUp
              size={13}
              aria-hidden="true"
            />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between gap-4 px-1 text-xs text-zinc-500">
          <p>
            SecondBrain can use your saved content when
            relevant. Check important details.
          </p>

          <p className="hidden shrink-0 sm:block">
            <kbd className="font-sans text-zinc-400">
              Enter
            </kbd>{" "}
            to send,{" "}
            <kbd className="font-sans text-zinc-400">
              Shift + Enter
            </kbd>{" "}
            for a new line
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

const AskSecondBrain = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<ChatError | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const controllerRef =
    useRef<AbortController | null>(null);

  const copyTimerRef =
    useRef<number | undefined>(undefined);

  const hasConversation =
    messages.length > 0 ||
    loading ||
    error !== null;

  /* Focus input when the page opens */
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  /* Cancel requests and timers on unmount */
  useEffect(() => {
    return () => {
      controllerRef.current?.abort();

      window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  /* Automatically resize textarea */
  useEffect(() => {
    const el = textareaRef.current;

    if (!el) {
      return;
    }

    el.style.height = "auto";

    el.style.height = `${Math.min(
      el.scrollHeight,
      MAX_TEXTAREA_HEIGHT
    )}px`;
  }, [input]);

  /* Scroll to the latest message */
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    messagesEndRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "end",
    });
  }, [messages, loading, error]);

  /* =======================================================
     SEND QUESTION

     Every request goes through askSecondBrain().
     This prevents the main send and retry logic from
     using different authentication headers.
  ======================================================= */

  const submitQuestion = useCallback(
    async (question: string) => {
      controllerRef.current?.abort();

      const controller = new AbortController();

      controllerRef.current = controller;

      setError(null);
      setLoading(true);

      /*
       * Exclude the last user message if it is the question
       * being retried. The question is sent separately.
       */
      const history: ChatTurn[] = messages
        .filter(
          (message, index) =>
            !(
              index === messages.length - 1 &&
              message.role === "user" &&
              message.content === question
            )
        )
        .slice(-10)
        .map(({ role, content }) => ({
          role,
          content,
        }));

      try {
        const result = await askSecondBrain(
          question,
          history,
          controller.signal
        );

        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            content: result.answer,
            sources: result.sources,
          },
        ]);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError({
          message: getErrorMessage(err),
          question,
        });
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
          setLoading(false);
        }
      }
    },
    [messages]
  );

  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const handleSend = () => {
    const question = input.trim();

    if (!question || loading) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "user",
        content: question,
      },
    ]);

    setInput("");
    setError(null);

    void submitQuestion(question);
  };

  /* =======================================================
     RETRY FAILED REQUEST
  ======================================================= */

  const handleRetry = () => {
    if (!error || loading) {
      return;
    }

    void submitQuestion(error.question);
  };

  /* =======================================================
     SUGGESTION BUTTON
  ======================================================= */

  const handleSuggestion = (text: string) => {
    setInput(text);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  /* =======================================================
     COPY RESPONSE
  ======================================================= */

  const handleCopy = async (
    id: string,
    content: string
  ) => {
    try {
      await navigator.clipboard.writeText(content);

      setCopiedId(id);

      window.clearTimeout(copyTimerRef.current);

      copyTimerRef.current = window.setTimeout(() => {
        setCopiedId(null);
      }, 1800);
    } catch {
      console.error("Failed to copy message");
    }
  };

  /* =======================================================
     CLEAR CHAT
  ======================================================= */

  const clearChat = () => {
    controllerRef.current?.abort();

    controllerRef.current = null;

    setMessages([]);
    setError(null);
    setInput("");
    setLoading(false);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="flex h-[100dvh] flex-col bg-zinc-950 text-zinc-100">
      <Header
        busy={loading}
        canReset={
          hasConversation || input.length > 0
        }
        onBack={() => navigate(-1)}
        onReset={clearChat}
      />

      <main
        className="flex-1 overflow-y-auto"
        aria-busy={loading}
      >
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 sm:px-6">
          {hasConversation ? (
            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-label="Conversation"
              className="space-y-8 py-8"
            >
              {messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  copied={copiedId === message.id}
                  onCopy={handleCopy}
                />
              ))}

              {loading && <ThinkingIndicator />}

              {error && (
                <ErrorNotice
                  error={error}
                  disabled={loading}
                  onRetry={handleRetry}
                />
              )}

              <div ref={messagesEndRef} />
            </div>
          ) : (
            <Welcome onPick={handleSuggestion} />
          )}
        </div>
      </main>

      <Composer
        value={input}
        loading={loading}
        textareaRef={textareaRef}
        onChange={setInput}
        onSubmit={handleSend}
      />
    </div>
  );
};

export default AskSecondBrain;