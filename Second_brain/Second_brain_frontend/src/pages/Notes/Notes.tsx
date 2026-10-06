import { useEffect, useMemo, useState } from "react";
import {
  FiBookOpen,
  FiClock,
  FiRefreshCw,
  FiSearch,
  FiStar,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
};

type FilterType = "all" | "favorites" | "recent";

const API_URL = "http://localhost:8000/api/v1/content";

function Notes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<"updated" | "newest">("updated");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please login again.");
        return;
      }

      const url = `${API_URL}/getcontent?search=${encodeURIComponent(
        search
      )}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      console.log("NOTES STATUS:", response.status);
      console.log("NOTES RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch notes");
      }

      const backendNotes = (data.content || [])
        .filter((item: any) => item.type === "note")
        .map((item: any) => ({
          id: item._id,
          title: item.title || "Untitled Note",

          // Your backend currently stores note text in `link`
          content: item.link || "",

          tags: item.tags || [],
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

      setNotes(backendNotes);
    } catch (err) {
      console.error("FETCH NOTES ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while fetching notes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (filter === "favorites") {
      // Favorite API isn't implemented yet.
      // Keeping this filter disabled logically for now.
      result = result;
    }

    if (filter === "recent") {
      result = result.slice(0, 8);
    }

    result.sort((a, b) => {
      if (sort === "updated") {
        return (
          new Date(b.updatedAt || b.createdAt).getTime() -
          new Date(a.updatedAt || a.createdAt).getTime()
        );
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

    return result;
  }, [notes, filter, sort]);

  const formatDate = (date: string) => {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "Recently";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Notes
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Capture ideas, knowledge and things worth remembering
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* SEARCH */}

            <div className="
              flex items-center gap-2
              rounded-xl
              border border-zinc-800
              bg-zinc-900
              px-3 py-2.5
              focus-within:border-zinc-700
            ">
              <FiSearch
                size={17}
                className="text-zinc-500"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="
                  w-44
                  bg-transparent
                  text-sm text-white
                  outline-none
                  placeholder:text-zinc-600
                  md:w-56
                "
              />
            </div>

            {/* NEW NOTE */}

            <button
              type="button"
              onClick={() => navigate("/create")}
              className="
                flex items-center gap-2
                rounded-xl
                bg-amber-400
                px-4 py-2.5
                text-sm font-medium
                text-black
                transition
                hover:bg-amber-300
                active:scale-95
              "
            >
              + New Note
            </button>
          </div>
        </div>

        {/* MAIN */}

        <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">

          {/* SIDEBAR */}

          <aside className="
            h-fit
            rounded-2xl
            border border-zinc-800
            bg-zinc-900/60
            p-5
          ">

            <p className="text-xs font-medium tracking-wider text-zinc-500">
              LIBRARY
            </p>

            <div className="mt-4 space-y-2">

              {/* ALL */}

              <button
                onClick={() => setFilter("all")}
                className={`
                  flex w-full items-center justify-between
                  rounded-xl px-4 py-3
                  text-sm transition
                  ${
                    filter === "all"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <FiBookOpen />
                  All Notes
                </span>

                <span className="text-xs text-zinc-500">
                  {notes.length}
                </span>
              </button>

              {/* RECENT */}

              <button
                onClick={() => setFilter("recent")}
                className={`
                  flex w-full items-center justify-between
                  rounded-xl px-4 py-3
                  text-sm transition
                  ${
                    filter === "recent"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <FiClock />
                  Recent
                </span>

                <span className="text-xs text-zinc-500">
                  {Math.min(notes.length, 8)}
                </span>
              </button>

            </div>
          </aside>

          {/* NOTES */}

          <section>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <p className="text-xs tracking-wider text-zinc-600">
                  YOUR KNOWLEDGE
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {filter === "recent"
                    ? "Recent Notes"
                    : "All Notes"}
                </h2>
              </div>

              <select
                value={sort}
                onChange={(e) =>
                  setSort(
                    e.target.value as "updated" | "newest"
                  )
                }
                className="
                  rounded-xl
                  border border-zinc-800
                  bg-zinc-900
                  px-4 py-2.5
                  text-sm text-zinc-300
                  outline-none
                "
              >
                <option value="updated">
                  Recently Updated
                </option>

                <option value="newest">
                  Newest First
                </option>
              </select>
            </div>

            {/* FILTERS */}

            <div className="mt-6 flex flex-wrap gap-2">

              <button
                onClick={() => setFilter("all")}
                className={`
                  rounded-xl px-4 py-2 text-sm
                  ${
                    filter === "all"
                      ? "bg-amber-400 text-black"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-400"
                  }
                `}
              >
                All
              </button>

              <button
                onClick={() => setFilter("recent")}
                className={`
                  rounded-xl px-4 py-2 text-sm
                  ${
                    filter === "recent"
                      ? "bg-amber-400 text-black"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-400"
                  }
                `}
              >
                Recent
              </button>
            </div>

            {/* LOADING */}

            {loading && (
              <div className="
                mt-8
                grid
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
              ">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="
                      h-72
                      animate-pulse
                      rounded-2xl
                      border border-zinc-800
                      bg-zinc-900
                    "
                  />
                ))}
              </div>
            )}

            {/* ERROR */}

            {!loading && error && (
              <div className="
                mt-8
                rounded-2xl
                border border-red-500/20
                bg-red-500/5
                p-8
                text-center
              ">
                <p className="text-sm text-red-400">
                  {error}
                </p>

                <button
                  onClick={fetchNotes}
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border border-zinc-800
                    bg-zinc-900
                    px-4 py-2
                    text-sm
                    text-zinc-300
                    hover:bg-zinc-800
                  "
                >
                  <FiRefreshCw size={14} />
                  Retry
                </button>
              </div>
            )}

            {/* EMPTY */}

            {!loading &&
              !error &&
              filteredNotes.length === 0 && (
                <div className="
                  mt-8
                  rounded-2xl
                  border border-dashed
                  border-zinc-800
                  bg-zinc-900/40
                  p-16
                  text-center
                ">
                  <FiBookOpen
                    size={30}
                    className="mx-auto text-zinc-700"
                  />

                  <h3 className="mt-4 font-medium">
                    No notes found
                  </h3>

                  <p className="mt-2 text-sm text-zinc-600">
                    {search
                      ? "Try a different search."
                      : "Create your first note to start building your knowledge base."}
                  </p>

                  {!search && (
                    <button
                      onClick={() => navigate("/create")}
                      className="
                        mt-5
                        rounded-xl
                        bg-amber-400
                        px-4 py-2.5
                        text-sm font-medium
                        text-black
                        hover:bg-amber-300
                      "
                    >
                      Create Note
                    </button>
                  )}
                </div>
              )}

            {/* NOTE CARDS */}

            {!loading &&
              !error &&
              filteredNotes.length > 0 && (
                <div className="
                  mt-8
                  grid
                  gap-5
                  md:grid-cols-2
                  xl:grid-cols-3
                ">
                  {filteredNotes.map((note) => (
                    <article
                      key={note.id}
                      onClick={() =>
                        navigate(`/content/${note.id}`)
                      }
                      className="
                        group
                        cursor-pointer
                        rounded-2xl
                        border border-zinc-800
                        bg-zinc-900
                        p-6
                        transition
                        hover:-translate-y-1
                        hover:border-zinc-700
                        hover:shadow-xl
                        hover:shadow-black/20
                      "
                    >

                      {/* ICON */}

                      <div className="flex items-start justify-between">

                        <div className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          bg-amber-400/10
                          text-amber-400
                        ">
                          <FiBookOpen size={18} />
                        </div>

                        <FiStar
                          size={17}
                          className="text-zinc-700"
                        />
                      </div>

                      {/* TITLE */}

                      <h3 className="
                        mt-6
                        line-clamp-2
                        text-lg
                        font-semibold
                        leading-7
                        text-white
                        transition
                        group-hover:text-amber-300
                      ">
                        {note.title}
                      </h3>

                      {/* CONTENT PREVIEW */}

                      <p className="
                        mt-3
                        line-clamp-4
                        min-h-[96px]
                        text-sm
                        leading-6
                        text-zinc-500
                      ">
                        {note.content}
                      </p>

                      {/* TAGS */}

                      {note.tags.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {note.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="
                                rounded-md
                                bg-zinc-800
                                px-2 py-1
                                text-xs
                                text-zinc-400
                              "
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* FOOTER */}

                      <div className="
                        mt-6
                        flex
                        items-center
                        justify-between
                        border-t
                        border-zinc-800
                        pt-4
                      ">
                        <span className="text-xs text-zinc-600">
                          {formatDate(
                            note.updatedAt || note.createdAt
                          )}
                        </span>

                        <span className="
                          text-xs
                          text-zinc-600
                          transition
                          group-hover:text-amber-400
                        ">
                          Open →
                        </span>
                      </div>

                    </article>
                  ))}
                </div>
              )}

          </section>
        </div>
      </div>
    </div>
  );
}

export default Notes;