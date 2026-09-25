
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Brain,
  Check,
  ChevronRight,
  FileText,
  Folder,
  Link2,
  Network,
  Search,
  Share2,
  Sparkles,
  Tag,
} from "lucide-react";

/* =========================================================
   DATA
========================================================= */

const features = [
  {
    icon: FileText,
    title: "Capture",
    description:
      "Save notes, ideas, links and anything worth remembering without breaking your flow.",
  },
  {
    icon: Network,
    title: "Connect",
    description:
      "Use tags, collections and references to turn isolated information into connected knowledge.",
  },
  {
    icon: Search,
    title: "Recall",
    description:
      "Find the information you need instead of remembering where you stored it.",
  },
];

const contentTypes = [
  {
    icon: FileText,
    title: "Notes",
    description: "Ideas, thoughts and things you learn.",
  },
  {
    icon: Link2,
    title: "Links",
    description: "Articles, resources and useful websites.",
  },
  {
    icon: Tag,
    title: "Tags",
    description: "Create relationships between your knowledge.",
  },
  {
    icon: Folder,
    title: "Collections",
    description: "Organize related knowledge together.",
  },
];

const navItems = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "How it works",
    href: "#how-it-works",
  },
];

/* =========================================================
   ANIMATION
========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SecondBrainLanding() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0B0B0D] text-white selection:bg-amber-400 selection:text-black">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-[#0B0B0D]/85 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* Logo */}

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-black">
              <Brain size={18} />
            </div>

            <span className="text-sm font-semibold tracking-tight">
              Second<span className="text-amber-400">Brain</span>
            </span>
          </button>

          {/* Desktop Navigation */}

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-500 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Authentication */}

          <div className="flex items-center gap-2">

            {/* SIGN IN */}

            <button
              onClick={() => navigate("/signin")}
              className="
                rounded-lg
                px-3
                py-2
                text-sm
                text-zinc-400
                transition
                hover:bg-white/[0.05]
                hover:text-white
              "
            >
              Sign in
            </button>

            {/* SIGN UP */}

            <button
              onClick={() => navigate("/signup")}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-amber-400
                px-4
                py-2
                text-sm
                font-semibold
                text-black
                transition
                hover:bg-amber-300
                active:scale-95
              "
            >
              Get started
              <ArrowRight size={15} />
            </button>

          </div>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden pt-32">

        {/* Ambient Background */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-400/[0.07] blur-[130px]" />

          <div className="absolute left-[10%] top-[35%] h-40 w-40 rounded-full bg-amber-400/[0.03] blur-[80px]" />

          {/* Grid */}

          <div
            className="
              absolute
              inset-0
              opacity-[0.035]
              [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
              [background-size:64px_64px]
            "
          />

        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

          <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.9fr]">

            {/* =================================================
                HERO LEFT
            ================================================= */}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl"
            >

              {/* Badge */}

              <motion.div
                variants={fadeUp}
                className="
                  mb-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-amber-400/20
                  bg-amber-400/[0.06]
                  px-3
                  py-1.5
                  text-xs
                  text-amber-300
                "
              >
                <Sparkles size={13} />

                Your personal knowledge system
              </motion.div>

              {/* Heading */}

              <motion.h1
                variants={fadeUp}
                className="
                  text-5xl
                  font-bold
                  leading-[1.05]
                  tracking-[-0.04em]
                  sm:text-6xl
                  lg:text-7xl
                "
              >
                Remember
                <span className="text-amber-400">
                  {" "}
                  everything.
                </span>

                <br />

                Connect
                <span className="text-zinc-500">
                  {" "}
                  anything.
                </span>
              </motion.h1>

              {/* Description */}

              <motion.p
                variants={fadeUp}
                className="
                  mt-7
                  max-w-xl
                  text-base
                  leading-7
                  text-zinc-500
                  sm:text-lg
                "
              >
                Second Brain gives your notes, links, ideas and
                resources a home — then helps you connect and
                rediscover them when they matter.
              </motion.p>

              {/* CTA */}

              <motion.div
                variants={fadeUp}
                className="mt-9 flex flex-wrap items-center gap-3"
              >

                {/* START BUILDING */}

                <button
                  onClick={() => navigate("/signup")}
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-amber-400
                    px-5
                    py-3.5
                    text-sm
                    font-semibold
                    text-black
                    shadow-lg
                    shadow-amber-400/10
                    transition
                    hover:bg-amber-300
                    active:scale-[0.98]
                  "
                >
                  Start building your brain

                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-0.5"
                  />
                </button>

                {/* EXISTING ACCOUNT */}

                <button
                  onClick={() => navigate("/signin")}
                  className="
                    rounded-xl
                    border
                    border-white/10
                    px-5
                    py-3.5
                    text-sm
                    text-zinc-300
                    transition
                    hover:border-white/20
                    hover:bg-white/[0.04]
                  "
                >
                  I already have an account
                </button>

              </motion.div>

              {/* Trust */}

              <motion.div
                variants={fadeUp}
                className="mt-7 flex items-center gap-2 text-xs text-zinc-600"
              >
                <Check
                  size={14}
                  className="text-amber-400"
                />

                Capture now. Organize later.
              </motion.div>

            </motion.div>

            {/* =================================================
                PRODUCT PREVIEW
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.2,
              }}
              className="relative"
            >

              {/* Glow */}

              <div className="absolute -inset-10 rounded-full bg-amber-400/[0.06] blur-3xl" />

              {/* Browser Window */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#111114]
                  shadow-2xl
                  shadow-black/50
                "
              >

                {/* Window Header */}

                <div className="flex h-11 items-center justify-between border-b border-white/[0.06] px-4">

                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  </div>

                  <span className="text-[10px] text-zinc-700">
                    secondbrain.app
                  </span>

                  <div className="w-10" />

                </div>

                {/* App */}

                <div className="flex min-h-[420px]">

                  {/* Sidebar */}

                  <aside className="hidden w-44 border-r border-white/[0.06] p-4 sm:block">

                    <div className="mb-7 flex items-center gap-2">

                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-400 text-black">
                        <Brain size={13} />
                      </div>

                      <span className="text-xs font-semibold">
                        SecondBrain
                      </span>

                    </div>

                    <div className="space-y-1">

                      <PreviewSidebarItem
                        icon={FileText}
                        label="All content"
                        active
                      />

                      <PreviewSidebarItem
                        icon={Folder}
                        label="Collections"
                      />

                      <PreviewSidebarItem
                        icon={Tag}
                        label="Tags"
                      />

                    </div>

                    <div className="mt-8">

                      <p className="mb-2 px-2 text-[9px] uppercase tracking-widest text-zinc-700">
                        Collections
                      </p>

                      <div className="space-y-2 px-2">

                        <p className="text-[10px] text-zinc-500">
                          Development
                        </p>

                        <p className="text-[10px] text-zinc-500">
                          Learning
                        </p>

                        <p className="text-[10px] text-zinc-500">
                          Projects
                        </p>

                      </div>

                    </div>

                  </aside>

                  {/* Main */}

                  <div className="min-w-0 flex-1 p-5 sm:p-6">

                    {/* Top */}

                    <div className="mb-6 flex items-center justify-between">

                      <div>

                        <p className="text-[10px] text-zinc-600">
                          YOUR KNOWLEDGE
                        </p>

                        <h3 className="mt-1 text-lg font-semibold">
                          All content
                        </h3>

                      </div>

                      <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-500">
                        <Search size={14} />
                      </button>

                    </div>

                    {/* Search */}

                    <div className="mb-5 flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#0B0B0D] px-3 py-2.5">

                      <Search
                        size={13}
                        className="text-zinc-600"
                      />

                      <span className="text-[10px] text-zinc-700">
                        Search your knowledge...
                      </span>

                    </div>

                    {/* Cards */}

                    <div className="space-y-3">

                      <PreviewContent
                        icon={FileText}
                        type="NOTE"
                        title="Understanding React Context"
                        description="Global state and how providers connect components..."
                        tags={["react", "frontend"]}
                      />

                      <PreviewContent
                        icon={Link2}
                        type="LINK"
                        title="System Design Resources"
                        description="Useful resources for learning scalable backend systems..."
                        tags={["backend", "learning"]}
                      />

                      <PreviewContent
                        icon={FileText}
                        type="NOTE"
                        title="WebSocket Architecture"
                        description="Real-time communication, rooms and connections..."
                        tags={["websocket", "node"]}
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* Floating Connection Card */}

              <motion.div
                animate={{
                  y: [0, -7, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  -bottom-6
                  -left-4
                  hidden
                  w-52
                  rounded-xl
                  border
                  border-white/10
                  bg-[#151518]
                  p-3
                  shadow-xl
                  sm:block
                "
              >

                <div className="mb-2 flex items-center gap-2">

                  <Network
                    size={13}
                    className="text-amber-400"
                  />

                  <span className="text-[10px] font-medium">
                    Connected knowledge
                  </span>

                </div>

                <div className="flex items-center gap-1.5 text-[9px] text-zinc-600">

                  <span className="rounded bg-white/[0.04] px-1.5 py-1">
                    React
                  </span>

                  <ChevronRight size={10} />

                  <span className="rounded bg-white/[0.04] px-1.5 py-1">
                    Context
                  </span>

                  <ChevronRight size={10} />

                  <span className="rounded bg-amber-400/10 px-1.5 py-1 text-amber-400">
                    State
                  </span>

                </div>

              </motion.div>

            </motion.div>

          </div>

        </div>

      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">

        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#101013] sm:grid-cols-4">

          <ValueItem
            value="01"
            label="Place for your knowledge"
          />

          <ValueItem
            value="∞"
            label="Ideas you can connect"
          />

          <ValueItem
            value="24/7"
            label="Access to your brain"
          />

          <ValueItem
            value="1"
            label="Space for everything"
          />

        </div>

      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="mx-auto max-w-7xl px-5 py-28 sm:px-8"
      >

        <div className="max-w-2xl">

          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
            What you can do
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your information finally
            <span className="text-zinc-600">
              {" "}
              works together.
            </span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-zinc-500 sm:text-base">
            Second Brain is built around a simple idea:
            information becomes more valuable when it is
            connected.
          </p>

        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: "-80px",
                }}
                transition={{
                  delay: index * 0.08,
                }}
                className="
                  group
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-[#111114]
                  p-6
                  transition
                  hover:border-amber-400/20
                  hover:bg-[#141417]
                "
              >

                <div
                  className="
                    mb-8
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-amber-400/10
                    text-amber-400
                    transition
                    group-hover:bg-amber-400
                    group-hover:text-black
                  "
                >
                  <Icon size={18} />
                </div>

                <h3 className="text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center gap-1 text-xs text-zinc-700 transition group-hover:text-amber-400">
                  Explore
                  <ArrowRight size={13} />
                </div>

              </motion.div>
            );

          })}

        </div>

      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="
          border-y
          border-white/[0.06]
          bg-[#0E0E11]
        "
      >

        <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8">

          <div className="grid gap-16 lg:grid-cols-[0.7fr_1fr]">

            {/* Heading */}

            <div>

              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
                The idea
              </p>

              <h2 className="max-w-md text-3xl font-bold tracking-tight sm:text-4xl">
                Capture first.
                <br />
                Connect later.
                <br />
                Recall anytime.
              </h2>

            </div>

            {/* Steps */}

            <div className="space-y-0">

              <Step
                number="01"
                title="Capture"
                description="Something useful comes to mind. Save it immediately as a note, link or resource."
                icon={FileText}
              />

              <Step
                number="02"
                title="Organize"
                description="Add tags, place it into a collection, or simply leave it alone. Your brain shouldn't become another filing cabinet."
                icon={Folder}
              />

              <Step
                number="03"
                title="Connect"
                description="Related ideas begin forming a network through tags, references and shared context."
                icon={Network}
              />

              <Step
                number="04"
                title="Recall"
                description="When you need something, search your knowledge instead of trying to remember where you put it."
                icon={Search}
                last
              />

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTENT TYPES
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8">

        <div className="grid gap-14 lg:grid-cols-[0.7fr_1fr]">

          <div>

            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
              Everything in one place
            </p>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your digital memory,
              <span className="text-zinc-600">
                {" "}
                organized your way.
              </span>
            </h2>

          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            {contentTypes.map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    rounded-xl
                    border
                    border-white/[0.06]
                    bg-[#111114]
                    p-5
                    transition
                    hover:border-white/10
                  "
                >

                  <Icon
                    size={18}
                    className="text-amber-400"
                  />

                  <h3 className="mt-4 text-sm font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-zinc-600">
                    {item.description}
                  </p>

                </div>
              );

            })}

          </div>

        </div>

      </section>

      {/* =====================================================
          SHARE
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">

        <div className="relative overflow-hidden rounded-3xl border border-amber-400/10 bg-[#121214]">

          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-400/[0.06] blur-[100px]" />

          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">

            <div>

              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                <Share2 size={18} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight">

                Your knowledge can

                <span className="text-amber-400">
                  {" "}
                  travel with you.
                </span>

              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-500">
                Create a shareable brain when you want to
                expose your knowledge to others — without
                giving up control of your workspace.
              </p>

              <button
                onClick={() => navigate("/signup")}
                className="
                  mt-7
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-amber-400
                  transition
                  hover:text-amber-300
                "
              >
                Build your Second Brain
                <ArrowRight size={15} />
              </button>

            </div>

            {/* Share Preview */}

            <div className="rounded-2xl border border-white/[0.06] bg-[#0B0B0D] p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-semibold">
                    Shared Brain
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-600">
                    akash-second-brain
                  </p>

                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] text-emerald-400">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  Active

                </div>

              </div>

              <div className="mt-5 h-px bg-white/[0.06]" />

              <div className="mt-5 grid grid-cols-3 gap-2">

                <MiniStat
                  value="24"
                  label="Notes"
                />

                <MiniStat
                  value="12"
                  label="Links"
                />

                <MiniStat
                  value="18"
                  label="Tags"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="border-t border-white/[0.06]">

        <div className="mx-auto max-w-4xl px-5 py-28 text-center sm:px-8">

          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-black">
            <Brain size={23} />
          </div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">

            Build a brain that

            <span className="text-amber-400">
              {" "}
              remembers.
            </span>

          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-zinc-500 sm:text-base">
            Stop letting useful information disappear into
            bookmarks, screenshots and random notes.
            Give everything a place.
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="
              mt-8
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-amber-400
              px-6
              py-3.5
              text-sm
              font-semibold
              text-black
              transition
              hover:bg-amber-300
              active:scale-[0.98]
            "
          >
            Create your Second Brain
            <ArrowRight size={17} />
          </button>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/[0.06]">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">

          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400 text-black">
              <Brain size={14} />
            </div>

            <span className="text-xs font-semibold">
              Second<span className="text-amber-400">Brain</span>
            </span>

          </div>

          <p className="text-xs text-zinc-700">
            Built by Akash Rathod
          </p>

        </div>

      </footer>

    </main>
  );
}

/* =========================================================
   PREVIEW SIDEBAR ITEM
========================================================= */

interface PreviewSidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

function PreviewSidebarItem({
  icon: Icon,
  label,
  active = false,
}: PreviewSidebarItemProps) {
  return (
    <div
      className={`
        flex
        items-center
        gap-2
        rounded-md
        px-2
        py-1.5
        text-[10px]

        ${
          active
            ? "bg-amber-400/10 text-amber-400"
            : "text-zinc-600"
        }
      `}
    >
      <Icon size={12} />
      {label}
    </div>
  );
}

/* =========================================================
   PREVIEW CONTENT
========================================================= */

interface PreviewContentProps {
  icon: React.ElementType;
  type: string;
  title: string;
  description: string;
  tags: string[];
}

function PreviewContent({
  icon: Icon,
  type,
  title,
  description,
  tags,
}: PreviewContentProps) {
  return (
    <div
      className="
        rounded-xl
        border
        border-white/[0.06]
        bg-[#0D0D10]
        p-3.5
        transition
        hover:border-white/10
      "
    >

      <div className="flex gap-3">

        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-500">
          <Icon size={13} />
        </div>

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <p className="truncate text-[11px] font-medium">
              {title}
            </p>

            <span className="shrink-0 text-[8px] text-zinc-700">
              {type}
            </span>

          </div>

          <p className="mt-1 truncate text-[9px] text-zinc-700">
            {description}
          </p>

          <div className="mt-2 flex gap-1">

            {tags.map((tag) => (
              <span
                key={tag}
                className="
                  rounded
                  bg-amber-400/[0.06]
                  px-1.5
                  py-0.5
                  text-[8px]
                  text-amber-500/70
                "
              >
                #{tag}
              </span>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   VALUE ITEM
========================================================= */

interface ValueItemProps {
  value: string;
  label: string;
}

function ValueItem({
  value,
  label,
}: ValueItemProps) {
  return (
    <div
      className="
        border-b
        border-white/[0.06]
        p-5
        last:border-0

        sm:border-b-0
        sm:border-r
        sm:last:border-r-0
      "
    >

      <p className="text-xl font-semibold text-amber-400">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-zinc-600">
        {label}
      </p>

    </div>
  );
}

/* =========================================================
   HOW IT WORKS STEP
========================================================= */

interface StepProps {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  last?: boolean;
}

function Step({
  number,
  title,
  description,
  icon: Icon,
  last = false,
}: StepProps) {
  return (
    <div
      className={`
        flex
        gap-5
        ${
          !last
            ? "border-b border-white/[0.06]"
            : ""
        }
        py-7
      `}
    >

      {/* Number / Icon */}

      <div className="flex w-8 shrink-0 flex-col items-center">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
          <Icon size={15} />
        </div>

        {!last && (
          <div className="mt-3 h-full w-px bg-white/[0.06]" />
        )}

      </div>

      {/* Content */}

      <div className="pb-2">

        <div className="flex items-center gap-3">

          <span className="text-[10px] font-medium text-zinc-700">
            {number}
          </span>

          <h3 className="text-base font-semibold">
            {title}
          </h3>

        </div>

        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
          {description}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   MINI STAT
========================================================= */

interface MiniStatProps {
  value: string;
  label: string;
}

function MiniStat({
  value,
  label,
}: MiniStatProps) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">

      <p className="text-sm font-semibold">
        {value}
      </p>

      <p className="mt-1 text-[9px] text-zinc-700">
        {label}
      </p>

    </div>
  );
}
