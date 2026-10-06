import { useState } from "react";
import {
  FaArrowLeft,
  FaBrain,
  FaCheck,
  FaCircleExclamation,
  FaLink,
  FaNoteSticky,
  FaPlus,
  FaSpinner,
  FaVideo,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

type ContentType = "link" | "note" | "videos";

interface FormData {
  title: string;
  content: string;
  type: ContentType;
}

const initialFormData: FormData = {
  title: "",
  content: "",
  type: "link",
};

const API_URL = "http://localhost:8000/api/v1/content";

const CreateContent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<FormData>(initialFormData);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------
  // Handle input changes
  // --------------------------------

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess(false);
  };

  // --------------------------------
  // Change content type
  // --------------------------------

  const handleTypeChange = (type: ContentType) => {
    setFormData((prev) => ({
      ...prev,
      type,
      content: "",
      title: "",
    }));

    setError("");
    setSuccess(false);
  };

  // --------------------------------
  // Generate title
  // --------------------------------

  const generateTitle = (content: string) => {
    const enteredTitle = formData.title.trim();

    // User entered title
    if (enteredTitle) {
      return enteredTitle;
    }

    // Default title for note
    if (formData.type === "note") {
      return "Quick Note";
    }

    // Generate title from URL
    try {
      const url = new URL(content);

      return url.hostname.replace("www.", "");
    } catch {
      return formData.type === "videos"
        ? "Saved Video"
        : "Saved Link";
    }
  };

  // --------------------------------
  // Submit
  // --------------------------------

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    // Remove extra spaces
    const content = formData.content.trim();

    let title = formData.title.trim();

    // --------------------------------
    // Validate content
    // --------------------------------

    if (!content) {
      setError(
        formData.type === "note"
          ? "Write something before saving."
          : "Paste a link before saving."
      );

      return;
    }

    // --------------------------------
    // Generate title
    // --------------------------------

    title = generateTitle(content);

    if (!title) {
      setError("Title is required.");
      return;
    }

    // --------------------------------
    // Validate URL
    // Only links and videos
    // --------------------------------

    if (
      formData.type === "link" ||
      formData.type === "videos"
    ) {
      try {
        new URL(content);
      } catch {
        setError("Please enter a valid URL.");
        return;
      }
    }

    try {
      setLoading(true);

      // --------------------------------
      // Get authentication token
      // --------------------------------

      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      /*
       * IMPORTANT
       *
       * Your current backend expects:
       *
       * {
       *   title,
       *   link,
       *   type,
       *   tags
       * }
       *
       * For a NOTE:
       *
       * link = actual note text
       *
       * Example:
       *
       * {
       *   title: "Learning MongoDB",
       *   link: "MongoDB is a NoSQL database...",
       *   type: "note",
       *   tags: []
       * }
       */

      const requestBody = {
        title: title,
        link: content,
        type: formData.type,
        tags: [],
      };

      // --------------------------------
      // Debug request
      // --------------------------------

      console.log(
        "================================="
      );

      console.log("CREATING CONTENT");

      console.log(
        "================================="
      );

      console.log(
        "TYPE:",
        formData.type
      );

      console.log(
        "TITLE:",
        title
      );

      console.log(
        "CONTENT:",
        content
      );

      console.log(
        "REQUEST BODY:",
        requestBody
      );

      console.log(
        "TOKEN EXISTS:",
        Boolean(token)
      );

      // --------------------------------
      // API request
      // --------------------------------

      const response = await fetch(
        `${API_URL}/createcontent`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          credentials: "include",

          body: JSON.stringify(requestBody),
        }
      );

      // --------------------------------
      // Read response
      // --------------------------------

      const responseText =
        await response.text();

      let data: any = {};

      try {
        data = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        data = {
          message: responseText,
        };
      }

      // --------------------------------
      // Debug response
      // --------------------------------

      console.log(
        "================================="
      );

      console.log(
        "BACKEND RESPONSE"
      );

      console.log(
        "================================="
      );

      console.log(
        "STATUS:",
        response.status
      );

      console.log(
        "STATUS TEXT:",
        response.statusText
      );

      console.log(
        "RESPONSE:",
        data
      );

      // --------------------------------
      // Handle API error
      // --------------------------------

      if (!response.ok) {
        const backendMessage =
          data?.message ||
          data?.error ||
          data?.errors?.[0]?.message ||
          data?.errors?.[0] ||
          `Request failed with status ${response.status}`;

        throw new Error(backendMessage);
      }

      // --------------------------------
      // Make sure backend returned content
      // --------------------------------

      console.log(
        "CREATED CONTENT:",
        data?.content
      );

      // --------------------------------
      // Success
      // --------------------------------

      setSuccess(true);

      // Reset form
      setFormData(initialFormData);

      /*
       * If we created a note,
       * go directly to Notes page.
       */
      if (formData.type === "note") {
        setTimeout(() => {
          navigate("/notes");
        }, 700);
      } else {
        /*
         * For links/videos,
         * keep the success message visible.
         */
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error(
        "CREATE CONTENT ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090b] text-white">

      {/* =====================================
          BACKGROUND
      ====================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div
          className="
            absolute inset-0
            opacity-[0.025]
            [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]
            [background-size:50px_50px]
          "
        />

        <div
          className="
            absolute
            -left-40
            -top-40
            h-[450px]
            w-[450px]
            rounded-full
            bg-amber-400/10
            blur-[130px]
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -right-40
            h-[450px]
            w-[450px]
            rounded-full
            bg-purple-500/10
            blur-[130px]
          "
        />

      </div>

      {/* =====================================
          MAIN
      ====================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-4xl
          px-4
          py-6
          sm:px-6
          sm:py-8
          lg:px-8
        "
      >

        {/* =====================================
            TOP BAR
        ====================================== */}

        <div className="flex items-center justify-between">

          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-zinc-800
              bg-zinc-900/60
              px-4
              py-2.5
              text-sm
              text-zinc-400
              transition
              hover:border-zinc-700
              hover:bg-zinc-800
              hover:text-white
              disabled:opacity-50
            "
          >
            <FaArrowLeft
              size={12}
              className="
                transition-transform
                group-hover:-translate-x-1
              "
            />

            Back
          </button>

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-zinc-600
            "
          >
            <FaBrain className="text-amber-400/70" />

            SecondBrain
          </div>

        </div>

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mx-auto mt-14 max-w-2xl text-center">

          <div
            className="
              mx-auto
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-amber-400/20
              bg-amber-400/5
              px-3
              py-1.5
              text-[11px]
              font-medium
              tracking-wide
              text-amber-400
            "
          >
            <FaPlus size={9} />

            QUICK CAPTURE
          </div>

          <h1
            className="
              mt-5
              text-3xl
              font-semibold
              tracking-tight
              sm:text-4xl
            "
          >
            Save something for{" "}

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
              later.
            </span>
          </h1>

          <p
            className="
              mx-auto
              mt-4
              max-w-md
              text-sm
              leading-6
              text-zinc-500
            "
          >
            Capture useful knowledge now.
            Organize it later.
          </p>

        </div>

        {/* =====================================
            SUCCESS
        ====================================== */}

        {success && (
          <div
            className="
              mx-auto
              mt-7
              max-w-2xl
              rounded-2xl
              border
              border-emerald-400/20
              bg-emerald-400/5
              px-5
              py-4
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-400/10
                  text-emerald-400
                "
              >
                <FaCheck size={14} />
              </div>

              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-emerald-300
                  "
                >
                  Saved to SecondBrain
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-emerald-400/60
                  "
                >
                  Your knowledge has been captured successfully.
                </p>

              </div>

            </div>

          </div>
        )}

        {/* =====================================
            FORM
        ====================================== */}

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 max-w-2xl"
        >

          <div
            className="
              overflow-hidden
              rounded-3xl
              border
              border-zinc-800
              bg-zinc-900/60
              shadow-2xl
              backdrop-blur-xl
            "
          >

            <div className="p-5 sm:p-8">

              {/* =====================================
                  TYPE
              ====================================== */}

              <div>

                <p
                  className="
                    mb-3
                    text-sm
                    font-medium
                    text-zinc-300
                  "
                >
                  What are you saving?
                </p>

                <div className="grid grid-cols-3 gap-3">

                  {/* LINK */}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      handleTypeChange("link")
                    }
                    className={`
                      group
                      flex
                      flex-col
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      p-4
                      text-center
                      transition-all

                      ${
                        formData.type === "link"
                          ? `
                            border-amber-400/40
                            bg-amber-400/10
                          `
                          : `
                            border-zinc-800
                            bg-zinc-950/40
                            hover:border-zinc-700
                            hover:bg-zinc-800/50
                          `
                      }
                    `}
                  >

                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl

                        ${
                          formData.type === "link"
                            ? "bg-amber-400/10 text-amber-400"
                            : "bg-zinc-800 text-zinc-500"
                        }
                      `}
                    >
                      <FaLink size={16} />
                    </div>

                    <p className="mt-3 text-sm font-medium">
                      Link
                    </p>

                    <p
                      className="
                        mt-1
                        hidden
                        text-[11px]
                        text-zinc-600
                        sm:block
                      "
                    >
                      Save a resource
                    </p>

                  </button>

                  {/* NOTE */}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      handleTypeChange("note")
                    }
                    className={`
                      group
                      flex
                      flex-col
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      p-4
                      text-center
                      transition-all

                      ${
                        formData.type === "note"
                          ? `
                            border-amber-400/40
                            bg-amber-400/10
                          `
                          : `
                            border-zinc-800
                            bg-zinc-950/40
                            hover:border-zinc-700
                            hover:bg-zinc-800/50
                          `
                      }
                    `}
                  >

                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl

                        ${
                          formData.type === "note"
                            ? "bg-amber-400/10 text-amber-400"
                            : "bg-zinc-800 text-zinc-500"
                        }
                      `}
                    >
                      <FaNoteSticky size={16} />
                    </div>

                    <p className="mt-3 text-sm font-medium">
                      Note
                    </p>

                    <p
                      className="
                        mt-1
                        hidden
                        text-[11px]
                        text-zinc-600
                        sm:block
                      "
                    >
                      Capture an idea
                    </p>

                  </button>

                  {/* VIDEO */}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      handleTypeChange("videos")
                    }
                    className={`
                      group
                      flex
                      flex-col
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      p-4
                      text-center
                      transition-all

                      ${
                        formData.type === "videos"
                          ? `
                            border-amber-400/40
                            bg-amber-400/10
                          `
                          : `
                            border-zinc-800
                            bg-zinc-950/40
                            hover:border-zinc-700
                            hover:bg-zinc-800/50
                          `
                      }
                    `}
                  >

                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl

                        ${
                          formData.type === "videos"
                            ? "bg-amber-400/10 text-amber-400"
                            : "bg-zinc-800 text-zinc-500"
                        }
                      `}
                    >
                      <FaVideo size={16} />
                    </div>

                    <p className="mt-3 text-sm font-medium">
                      Video
                    </p>

                    <p
                      className="
                        mt-1
                        hidden
                        text-[11px]
                        text-zinc-600
                        sm:block
                      "
                    >
                      Save to watch later
                    </p>

                  </button>

                </div>

              </div>

              {/* =====================================
                  TITLE
              ====================================== */}

              <div className="mt-7">

                <div className="mb-3 flex items-center justify-between">

                  <label
                    className="
                      text-sm
                      font-medium
                      text-zinc-300
                    "
                  >
                    Title
                  </label>

                  <span
                    className="
                      text-[11px]
                      text-zinc-700
                    "
                  >
                    Optional
                  </span>

                </div>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder={
                    formData.type === "note"
                      ? "Give your note a name..."
                      : formData.type === "videos"
                      ? "Give this video a name..."
                      : "Give this link a name..."
                  }
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-950/70
                    px-4
                    py-4
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-zinc-700
                    transition
                    hover:border-zinc-700
                    focus:border-amber-400/50
                    focus:ring-4
                    focus:ring-amber-400/5
                    disabled:opacity-50
                  "
                />

              </div>

              {/* =====================================
                  CONTENT
              ====================================== */}

              <div className="mt-7">

                <label
                  className="
                    mb-3
                    block
                    text-sm
                    font-medium
                    text-zinc-300
                  "
                >
                  {formData.type === "note"
                    ? "Your Note"
                    : formData.type === "videos"
                    ? "Video URL"
                    : "Paste Link"}
                </label>

                {formData.type === "note" ? (

                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    disabled={loading}
                    autoFocus
                    rows={9}
                    placeholder="Write your thought, idea, learning, reminder..."
                    className="
                      w-full
                      resize-none
                      rounded-2xl
                      border
                      border-zinc-800
                      bg-zinc-950/70
                      px-4
                      py-4
                      text-sm
                      leading-6
                      text-white
                      outline-none
                      placeholder:text-zinc-700
                      transition
                      hover:border-zinc-700
                      focus:border-amber-400/50
                      focus:ring-4
                      focus:ring-amber-400/5
                      disabled:opacity-50
                    "
                  />

                ) : (

                  <div className="relative">

                    {formData.type === "videos" ? (
                      <FaVideo
                        size={14}
                        className="
                          pointer-events-none
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-zinc-600
                        "
                      />
                    ) : (
                      <FaLink
                        size={14}
                        className="
                          pointer-events-none
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-zinc-600
                        "
                      />
                    )}

                    <input
                      type="url"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      disabled={loading}
                      autoFocus
                      placeholder={
                        formData.type === "videos"
                          ? "https://youtube.com/..."
                          : "https://..."
                      }
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-zinc-800
                        bg-zinc-950/70
                        py-4
                        pl-11
                        pr-4
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-zinc-700
                        transition
                        hover:border-zinc-700
                        focus:border-amber-400/50
                        focus:ring-4
                        focus:ring-amber-400/5
                        disabled:opacity-50
                      "
                    />

                  </div>

                )}

                <p
                  className="
                    mt-2
                    text-[11px]
                    text-zinc-700
                  "
                >
                  {formData.type === "note"
                    ? "You can organize and add tags later."
                    : formData.type === "videos"
                    ? "Paste a YouTube or video URL."
                    : "Paste any useful website, article, GitHub or resource."}
                </p>

              </div>

              {/* =====================================
                  ERROR
              ====================================== */}

              {error && (

                <div
                  className="
                    mt-6
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-red-500/20
                    bg-red-500/5
                    px-4
                    py-3
                    text-sm
                    text-red-400
                  "
                >

                  <FaCircleExclamation
                    className="mt-0.5 shrink-0"
                    size={14}
                  />

                  <span>{error}</span>

                </div>

              )}

            </div>

            {/* =====================================
                FOOTER
            ====================================== */}

            <div
              className="
                flex
                flex-col
                gap-4
                border-t
                border-zinc-800
                bg-zinc-950/30
                p-5
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-8
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-zinc-600
                "
              >
                <FaBrain size={12} />

                <span>
                  Capture first. Organize later.
                </span>
              </div>

              <div className="flex w-full gap-3 sm:w-auto">

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => navigate(-1)}
                  className="
                    flex-1
                    rounded-xl
                    border
                    border-zinc-800
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-zinc-400
                    transition
                    hover:border-zinc-700
                    hover:bg-zinc-800
                    hover:text-white
                    disabled:opacity-50
                    sm:flex-none
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    inline-flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-amber-400
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-black
                    transition
                    hover:bg-amber-300
                    hover:shadow-[0_0_30px_rgba(251,191,36,0.12)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    sm:flex-none
                  "
                >

                  {loading ? (
                    <>
                      <FaSpinner
                        size={12}
                        className="animate-spin"
                      />

                      Saving...
                    </>
                  ) : success ? (
                    <>
                      <FaCheck size={12} />

                      Saved
                    </>
                  ) : (
                    <>
                      <FaPlus size={11} />

                      Save to SecondBrain
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

          <p
            className="
              mt-5
              text-center
              text-[11px]
              text-zinc-700
            "
          >
            Your knowledge is yours. Capture it,
            organize it, remember it.
          </p>

        </form>

      </div>

    </main>
  );
};

export default CreateContent;