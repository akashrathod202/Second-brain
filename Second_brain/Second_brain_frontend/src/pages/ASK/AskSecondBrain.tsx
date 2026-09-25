import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowUp,
  FaBrain,
  FaCopy,
  FaLightbulb,
  FaMagnifyingGlass,
  FaRotateRight,
  FaUser,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  {
    icon: FaMagnifyingGlass,
    text: "Find my React notes",
  },
  {
    icon: FaLightbulb,
    text: "Explain what I saved about APIs",
  },
  {
    icon: FaBrain,
    text: "What did I save about Node.js?",
  },
];

const AskSecondBrain = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /*
   * Scroll to latest message
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  /*
   * Focus input when page opens
   */
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  /*
   * Handle textarea input
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);

    const textarea = e.target;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      160
    )}px`;
  };

  /*
   * Send message
   */
  const handleSend = async () => {
    const question = input.trim();

    if (!question || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setLoading(true);

    /*
     * Temporary frontend response.
     *
     * Later replace this with:
     *
     * POST /api/v1/ai/ask
     */
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I’m ready to search through your Second Brain. Once we connect the AI backend, I’ll find the most relevant saved content and answer your question using your knowledge base.",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      setLoading(false);
    }, 1200);
  };

  /*
   * Enter = send
   * Shift + Enter = new line
   */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /*
   * Suggestion click
   */
  const handleSuggestion = (text: string) => {
    setInput(text);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  /*
   * Copy AI response
   */
  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      console.error("Failed to copy message");
    }
  };

  /*
   * Clear conversation
   */
  const clearChat = () => {
    setMessages([]);
    setInput("");

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#09090b] text-white">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Grid */}
        <div
          className="
            absolute inset-0 opacity-[0.025]
            [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]
            [background-size:50px_50px]
          "
        />

        {/* Amber glow */}
        <div
          className="
            absolute -left-40 -top-40
            h-[500px] w-[500px]
            rounded-full
            bg-amber-400/10
            blur-[130px]
          "
        />

        {/* Purple glow */}
        <div
          className="
            absolute -bottom-40 -right-40
            h-[500px] w-[500px]
            rounded-full
            bg-purple-500/10
            blur-[130px]
          "
        />

        {/* Center AI glow */}
        <div
          className="
            absolute left-1/2 top-1/3
            h-[400px] w-[400px]
            -translate-x-1/2
            rounded-full
            bg-amber-400/[0.025]
            blur-[120px]
          "
        />
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          relative z-10
          border-b border-zinc-800/70
          bg-zinc-950/40
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto flex h-16
            max-w-5xl
            items-center
            justify-between
            px-4 sm:px-6
          "
        >
          {/* Back */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              group inline-flex
              items-center gap-2
              rounded-xl
              border border-zinc-800
              bg-zinc-900/50
              px-3.5 py-2
              text-sm text-zinc-400
              transition-all
              hover:border-zinc-700
              hover:bg-zinc-800
              hover:text-white
            "
          >
            <FaArrowLeft
              size={11}
              className="
                transition-transform
                group-hover:-translate-x-0.5
              "
            />

            <span>Back</span>
          </button>

          {/* Logo */}

          <div className="flex items-center gap-2.5">
            <div
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-lg
                border border-amber-400/20
                bg-amber-400/10
              "
            >
              <FaBrain
                size={14}
                className="text-amber-400"
              />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-zinc-200">
                SecondBrain
              </p>

              <p className="text-[10px] text-zinc-600">
                AI Knowledge Assistant
              </p>
            </div>
          </div>

          {/* New Chat */}

          {messages.length > 0 ? (
            <button
              type="button"
              onClick={clearChat}
              className="
                inline-flex
                items-center gap-2
                rounded-xl
                px-3 py-2
                text-xs text-zinc-500
                transition
                hover:bg-zinc-800
                hover:text-zinc-200
              "
            >
              <FaRotateRight size={10} />
              New chat
            </button>
          ) : (
            <div className="w-[82px]" />
          )}
        </div>
      </header>

      {/* =====================================================
          CHAT
      ====================================================== */}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div
          className="
            mx-auto flex
            w-full max-w-4xl
            flex-1 flex-col
            px-4 sm:px-6
          "
        >
          {messages.length === 0 ? (
            /* =================================================
               EMPTY STATE
            ================================================== */

            <div
              className="
                flex flex-1
                flex-col
                items-center
                justify-center
                py-12
              "
            >
              {/* AI ICON */}

              <div className="relative">
                <div
                  className="
                    absolute inset-0
                    animate-pulse
                    rounded-3xl
                    bg-amber-400/10
                    blur-2xl
                  "
                />

                <div
                  className="
                    relative
                    flex h-20 w-20
                    items-center justify-center
                    rounded-3xl
                    border border-amber-400/20
                    bg-gradient-to-br
                    from-amber-400/10
                    to-purple-500/10
                    shadow-[0_0_60px_rgba(251,191,36,0.08)]
                  "
                >
                  <FaWandMagicSparkles
                    size={30}
                    className="text-amber-400"
                  />
                </div>
              </div>

              {/* Heading */}

              <h1
                className="
                  mt-7
                  text-center
                  text-3xl
                  font-semibold
                  tracking-tight
                  sm:text-4xl
                "
              >
                Ask your{" "}
                <span
                  className="
                    bg-gradient-to-r
                    from-white
                    via-zinc-300
                    to-amber-400
                    bg-clip-text
                    text-transparent
                  "
                >
                  Second Brain
                </span>
              </h1>

              <p
                className="
                  mt-3
                  max-w-lg
                  text-center
                  text-sm
                  leading-6
                  text-zinc-500
                "
              >
                Ask questions about the knowledge, links,
                notes and resources you have saved.
              </p>

              {/* Suggestions */}

              <div
                className="
                  mt-9
                  grid
                  w-full
                  max-w-3xl
                  gap-3
                  sm:grid-cols-3
                "
              >
                {suggestions.map((suggestion) => {
                  const Icon = suggestion.icon;

                  return (
                    <button
                      key={suggestion.text}
                      type="button"
                      onClick={() =>
                        handleSuggestion(
                          suggestion.text
                        )
                      }
                      className="
                        group
                        rounded-2xl
                        border border-zinc-800
                        bg-zinc-900/40
                        p-4
                        text-left
                        transition-all
                        hover:-translate-y-0.5
                        hover:border-amber-400/20
                        hover:bg-zinc-900
                      "
                    >
                      <div
                        className="
                          flex h-9 w-9
                          items-center justify-center
                          rounded-xl
                          bg-zinc-800
                          transition
                          group-hover:bg-amber-400/10
                        "
                      >
                        <Icon
                          size={14}
                          className="
                            text-zinc-500
                            transition
                            group-hover:text-amber-400
                          "
                        />
                      </div>

                      <p
                        className="
                          mt-3
                          text-xs
                          leading-5
                          text-zinc-400
                          transition
                          group-hover:text-zinc-200
                        "
                      >
                        {suggestion.text}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* =================================================
               MESSAGES
            ================================================== */

            <div className="flex-1 overflow-y-auto py-8">
              <div className="space-y-8">
                {messages.map((message) => {
                  const isUser = message.role === "user";

                  return (
                    <div
                      key={message.id}
                      className={`
                        flex gap-3
                        ${
                          isUser
                            ? "justify-end"
                            : "justify-start"
                        }
                      `}
                    >
                      {/* AI ICON */}

                      {!isUser && (
                        <div
                          className="
                            mt-1
                            flex h-8 w-8
                            shrink-0
                            items-center justify-center
                            rounded-xl
                            border border-amber-400/20
                            bg-amber-400/10
                          "
                        >
                          <FaWandMagicSparkles
                            size={12}
                            className="text-amber-400"
                          />
                        </div>
                      )}

                      {/* MESSAGE */}

                      <div
                        className={`
                          max-w-[85%]
                          sm:max-w-[75%]
                          ${isUser ? "order-first" : ""}
                        `}
                      >
                        <div
                          className={`
                            rounded-2xl
                            px-4 py-3.5
                            text-sm
                            leading-6
                            ${
                              isUser
                                ? `
                                  rounded-br-md
                                  bg-amber-400
                                  text-black
                                `
                                : `
                                  rounded-bl-md
                                  border border-zinc-800
                                  bg-zinc-900/80
                                  text-zinc-300
                                `
                            }
                          `}
                        >
                          {message.content}
                        </div>

                        {/* Copy */}

                        {!isUser && (
                          <button
                            type="button"
                            onClick={() =>
                              copyMessage(
                                message.content
                              )
                            }
                            className="
                              mt-2
                              inline-flex
                              items-center gap-1.5
                              text-[10px]
                              text-zinc-700
                              transition
                              hover:text-zinc-400
                            "
                          >
                            <FaCopy size={9} />
                            Copy
                          </button>
                        )}
                      </div>

                      {/* USER ICON */}

                      {isUser && (
                        <div
                          className="
                            mt-1
                            flex h-8 w-8
                            shrink-0
                            items-center justify-center
                            rounded-xl
                            border border-zinc-700
                            bg-zinc-800
                          "
                        >
                          <FaUser
                            size={11}
                            className="text-zinc-400"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* =================================================
                    AI THINKING
                ================================================== */}

                {loading && (
                  <div className="flex gap-3">
                    <div
                      className="
                        mt-1
                        flex h-8 w-8
                        shrink-0
                        items-center justify-center
                        rounded-xl
                        border border-amber-400/20
                        bg-amber-400/10
                      "
                    >
                      <FaWandMagicSparkles
                        size={12}
                        className="
                          animate-pulse
                          text-amber-400
                        "
                      />
                    </div>

                    <div
                      className="
                        flex items-center gap-1.5
                        rounded-2xl
                        rounded-bl-md
                        border border-zinc-800
                        bg-zinc-900/80
                        px-5 py-4
                      "
                    >
                      <span
                        className="
                          h-1.5 w-1.5
                          animate-bounce
                          rounded-full
                          bg-zinc-500
                          [animation-delay:-0.3s]
                        "
                      />

                      <span
                        className="
                          h-1.5 w-1.5
                          animate-bounce
                          rounded-full
                          bg-zinc-500
                          [animation-delay:-0.15s]
                        "
                      />

                      <span
                        className="
                          h-1.5 w-1.5
                          animate-bounce
                          rounded-full
                          bg-zinc-500
                        "
                      />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* =====================================================
              INPUT
          ====================================================== */}

          <div className="pb-5 pt-3 sm:pb-7">
            <div
              className="
                rounded-2xl
                border border-zinc-800
                bg-zinc-900/80
                p-2
                shadow-2xl
                backdrop-blur-xl
                transition-all
                focus-within:border-amber-400/30
                focus-within:shadow-[0_0_40px_rgba(251,191,36,0.04)]
              "
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  rows={1}
                  placeholder="Ask your Second Brain..."
                  className="
                    max-h-40
                    min-h-[48px]
                    flex-1
                    resize-none
                    bg-transparent
                    px-3 py-3
                    text-sm
                    leading-6
                    text-white
                    outline-none
                    placeholder:text-zinc-600
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />

                {/* SEND */}

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="
                    mb-1
                    flex h-10 w-10
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-amber-400
                    text-black
                    transition-all
                    hover:bg-amber-300
                    hover:shadow-[0_0_25px_rgba(251,191,36,0.15)]
                    disabled:cursor-not-allowed
                    disabled:bg-zinc-800
                    disabled:text-zinc-600
                    disabled:shadow-none
                  "
                >
                  <FaArrowUp size={13} />
                </button>
              </div>
            </div>

            {/* Footer */}

            <div
              className="
                mt-2.5
                flex
                items-center
                justify-between
                px-1
              "
            >
              <p className="text-[10px] text-zinc-700">
                Your AI answers using your saved knowledge.
              </p>

              <p
                className="
                  hidden
                  text-[10px]
                  text-zinc-700
                  sm:block
                "
              >
                Enter to send · Shift + Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AskSecondBrain;