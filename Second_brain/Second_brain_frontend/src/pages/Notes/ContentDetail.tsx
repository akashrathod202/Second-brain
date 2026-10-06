import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCalendar,
  FiRefreshCw,
  FiTag,
  FiUser,
} from "react-icons/fi";

type Content = {
  _id: string;
  title: string;
  link: string;
  type: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  userId?: {
    _id: string;
    name: string;
  };
};

const API_URL = "http://localhost:8000/api/v1/content";

function ContentDetail() {
  const navigate = useNavigate();
  const { contentId } = useParams<{ contentId: string }>();

  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please login again.");
        return;
      }

      if (!contentId) {
        setError("Content ID is missing.");
        return;
      }

      const response = await fetch(
        `${API_URL}/getOneContent/${contentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log("STATUS:", response.status);
      console.log("CONTENT RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch content"
        );
      }

      if (!data.content) {
        throw new Error("Content data is missing from response.");
      }

      setContent(data.content);
    } catch (err) {
      console.error("Fetch content error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while fetching the content."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [contentId]);

  const formatDate = (date?: string) => {
    if (!date) {
      return "Unknown";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "Unknown";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(value);
  };

  const formatDateTime = (date?: string) => {
    if (!date) {
      return "Unknown";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "Unknown";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(value);
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
        <div className="mx-auto max-w-5xl">

          <div className="h-6 w-24 animate-pulse rounded bg-zinc-800" />

          <div className="mt-10 animate-pulse">
            <div className="h-4 w-20 rounded bg-zinc-800" />

            <div className="mt-5 h-10 w-3/4 rounded bg-zinc-800" />

            <div className="mt-4 h-5 w-1/2 rounded bg-zinc-900" />

            <div className="mt-10 h-96 rounded-2xl bg-zinc-900" />
          </div>

        </div>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
        <div className="mx-auto max-w-5xl">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              px-3
              py-2
              text-sm
              text-zinc-400
              transition
              hover:bg-zinc-900
              hover:text-white
            "
          >
            <FiArrowLeft size={17} />
            Back
          </button>

          <div
            className="
              mt-12
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/5
              p-10
              text-center
            "
          >
            <FiBookOpen
              size={32}
              className="mx-auto text-red-400"
            />

            <h2 className="mt-4 text-xl font-semibold">
              Unable to load content
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              {error}
            </p>

            <div className="mt-6 flex justify-center gap-3">

              <button
                type="button"
                onClick={fetchContent}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-amber-400
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-black
                  transition
                  hover:bg-amber-300
                "
              >
                <FiRefreshCw size={15} />
                Try Again
              </button>

              <button
                type="button"
                onClick={() => navigate("/notes")}
                className="
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-900
                  px-4
                  py-2.5
                  text-sm
                  text-zinc-300
                  transition
                  hover:bg-zinc-800
                "
              >
                Back to Notes
              </button>

            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ---------------- NO CONTENT ---------------- */

  if (!content) {
    return (
      <div className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
        <div className="mx-auto max-w-5xl">

          <button
            type="button"
            onClick={() => navigate("/notes")}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              px-3
              py-2
              text-sm
              text-zinc-400
              hover:bg-zinc-900
              hover:text-white
            "
          >
            <FiArrowLeft size={17} />
            Back to Notes
          </button>

          <div className="mt-12 text-center">
            <h2 className="text-xl font-semibold">
              Content not found
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              This content may have been deleted or is unavailable.
            </p>
          </div>

        </div>
      </div>
    );
  }

  /* ---------------- CONTENT ---------------- */

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Back */}

        <button
          type="button"
          onClick={() => navigate("/notes")}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            px-3
            py-2
            text-sm
            text-zinc-400
            transition
            hover:bg-zinc-900
            hover:text-white
          "
        >
          <FiArrowLeft size={17} />
          Back to Notes
        </button>

        {/* Header */}

        <div className="mt-10">

          <div className="flex flex-wrap items-center gap-3">

            <span
              className="
                rounded-lg
                bg-amber-400/10
                px-3
                py-1.5
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-amber-400
              "
            >
              {content.type}
            </span>

            {content.tags?.map((tag) => (
              <span
                key={tag}
                className="
                  flex
                  items-center
                  gap-1
                  rounded-lg
                  bg-zinc-900
                  px-3
                  py-1.5
                  text-xs
                  text-zinc-400
                "
              >
                <FiTag size={12} />
                {tag}
              </span>
            ))}

          </div>

          <h1
            className="
              mt-6
              max-w-4xl
              text-3xl
              font-bold
              leading-tight
              tracking-tight
              sm:text-4xl
            "
          >
            {content.title}
          </h1>

          {/* Metadata */}

          <div
            className="
              mt-6
              flex
              flex-wrap
              items-center
              gap-x-6
              gap-y-3
              text-sm
              text-zinc-500
            "
          >

            {content.userId?.name && (
              <div className="flex items-center gap-2">
                <FiUser size={15} />
                <span>{content.userId.name}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <FiCalendar size={15} />
              <span>
                Created {formatDate(content.createdAt)}
              </span>
            </div>

            {content.updatedAt &&
              content.updatedAt !== content.createdAt && (
                <div className="text-zinc-600">
                  Updated {formatDate(content.updatedAt)}
                </div>
              )}

          </div>

        </div>

        {/* Divider */}

        <div className="my-10 h-px bg-zinc-800" />

        {/* Note content */}

        <article
          className="
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900/60
            p-6
            sm:p-8
            lg:p-10
          "
        >

          <div className="mb-8 flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-amber-400/10
                text-amber-400
              "
            >
              <FiBookOpen size={19} />
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                Note
              </p>

              <p className="text-xs text-zinc-600">
                {formatDateTime(content.createdAt)}
              </p>
            </div>

          </div>

          <div
            className="
              whitespace-pre-wrap
              break-words
              text-base
              leading-8
              text-zinc-300
              sm:text-lg
            "
          >
            {content.link}
          </div>

        </article>

        {/* Bottom information */}

        <div
          className="
            mt-6
            flex
            flex-col
            gap-4
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900/40
            p-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-600">
              Content ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-zinc-500">
              {content._id}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/notes")}
            className="
              rounded-xl
              border
              border-zinc-800
              bg-zinc-900
              px-4
              py-2.5
              text-sm
              text-zinc-300
              transition
              hover:border-zinc-700
              hover:bg-zinc-800
              hover:text-white
            "
          >
            Back to Notes
          </button>

        </div>

      </div>
    </div>
  );
}

export default ContentDetail;