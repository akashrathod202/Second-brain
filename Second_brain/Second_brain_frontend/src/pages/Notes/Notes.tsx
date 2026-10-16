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
  isFavorite: boolean;
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

  // ----------------------------------------
  // Fetch notes
  // ----------------------------------------
  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please login again.");
        return;
      }

      const url = `${API_URL}/getContent?search=${encodeURIComponent(
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
          content: item.link || "",
          tags: item.tags || [],
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          isFavorite: item.isFavorite || false,
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

  // ----------------------------------------
  // Filter + sort
  // ----------------------------------------
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (filter === "favorites") {
      result = result.filter((note) => note.isFavorite);
    }

    if (filter === "recent") {
      result = result
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime()
        )
        .slice(0, 8);
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

  // ----------------------------------------
  // Format date
  // ----------------------------------------
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

  // ----------------------------------------
  // Filter button
  // ----------------------------------------
  const filterButton = (
    value: FilterType,
    label: string,
    count?: number
  ) => (
    <button
      type="button"
      onClick={() => setFilter(value)}
      className={`
        rounded-lg
        px-3.5
        py-2
        text-sm
        transition
        ${
          filter === value
            ? "bg-zinc-800 text-white"
            : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
        }
      `}
    >
      {label}

      {count !== undefined && (
        <span
          className={`ml-2 text-xs ${
            filter === value ? "text-zinc-400" : "text-zinc-700"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-zinc-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          {/* TITLE */}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Notes
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Your personal knowledge
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <div
              className="
                flex
                w-full
                items-center
                gap-2
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
                px-3.5
                py-2.5
                transition
                focus-within:border-zinc-700
                sm:w-60
              "
            >
              <FiSearch
                size={16}
                className="shrink-0 text-zinc-600"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="
                  w-full
                  bg-transparent
                  text-sm
                  text-zinc-200
                  outline-none
                  placeholder:text-zinc-600
                "
              />
            </div>

            {/* NEW NOTE */}
            <button
              type="button"
              onClick={() => navigate("/create")}
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-xl
                bg-amber-400
                px-4
                py-2.5
                text-sm
                font-medium
                text-zinc-950
                transition
                hover:bg-amber-300
                active:scale-[0.98]
              "
            >
              <span className="text-lg leading-none">+</span>
              <span>New Note</span>
            </button>
          </div>
        </header>

        {/* ================================================= */}
        {/* TOOLBAR */}
        {/* ================================================= */}

        <div className="mt-9 flex flex-col gap-4 border-b border-zinc-900 pb-4 sm:flex-row sm:items-center sm:justify-between">

          {/* FILTERS */}
          <div className="flex items-center gap-1">
            {filterButton("all", "All", notes.length)}

            {filterButton(
              "favorites",
              "Favorites",
              notes.filter((note) => note.isFavorite).length
            )}

            {filterButton(
              "recent",
              "Recent",
              Math.min(notes.length, 8)
            )}
          </div>

          {/* SORT */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600">
              Sort
            </span>

            <select
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target.value as "updated" | "newest"
                )
              }
              className="
                cursor-pointer
                bg-transparent
                text-sm
                text-zinc-400
                outline-none
              "
            >
              <option
                value="updated"
                className="bg-zinc-900"
              >
                Updated
              </option>

              <option
                value="newest"
                className="bg-zinc-900"
              >
                Newest
              </option>
            </select>
          </div>
        </div>

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (
          <div className="mt-6 space-y-3">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  h-32
                  animate-pulse
                  rounded-xl
                  border
                  border-zinc-900
                  bg-zinc-900/60
                "
              />
            ))}

          </div>
        )}

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {!loading && error && (
          <div
            className="
              mt-6
              rounded-xl
              border
              border-red-500/20
              bg-red-500/5
              p-8
              text-center
            "
          >
            <p className="text-sm text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchNotes}
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-zinc-800
                bg-zinc-900
                px-4
                py-2
                text-sm
                text-zinc-300
                transition
                hover:bg-zinc-800
              "
            >
              <FiRefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* ================================================= */}
        {/* EMPTY */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          filteredNotes.length === 0 && (
            <div
              className="
                mt-6
                rounded-xl
                border
                border-dashed
                border-zinc-800
                px-6
                py-20
                text-center
              "
            >
              <FiBookOpen
                size={28}
                className="mx-auto text-zinc-700"
              />

              <h3 className="mt-4 text-sm font-medium text-zinc-300">
                No notes found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">
                {filter === "favorites"
                  ? "You don't have any favorite notes yet."
                  : search
                  ? "Try a different search."
                  : "Create your first note to start building your knowledge base."}
              </p>

              {!search && filter !== "favorites" && (
                <button
                  type="button"
                  onClick={() => navigate("/create")}
                  className="
                    mt-5
                    rounded-lg
                    bg-amber-400
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-zinc-950
                    transition
                    hover:bg-amber-300
                  "
                >
                  Create Note
                </button>
              )}
            </div>
          )}

        {/* ================================================= */}
        {/* NOTES LIST */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          filteredNotes.length > 0 && (
            <div className="mt-6 space-y-3">

              {filteredNotes.map((note) => (
                <article
                  key={note.id}
                  onClick={() =>
                    navigate(`/content/${note.id}`)
                  }
                  className="
                    group
                    cursor-pointer
                    rounded-xl
                    border
                    border-zinc-900
                    bg-zinc-900/60
                    px-5
                    py-5
                    transition
                    hover:border-zinc-800
                    hover:bg-zinc-900
                  "
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">
                        <FiBookOpen
                          size={15}
                          className="shrink-0 text-amber-400"
                        />

                        <h2
                          className="
                            truncate
                            text-base
                            font-medium
                            text-zinc-100
                            transition
                            group-hover:text-amber-300
                          "
                        >
                          {note.title}
                        </h2>
                      </div>

                      {/* PREVIEW */}
                      <p
                        className="
                          mt-2
                          line-clamp-2
                          max-w-3xl
                          text-sm
                          leading-6
                          text-zinc-500
                        "
                      >
                        {note.content ||
                          "No content available."}
                      </p>

                    </div>

                    {/* FAVORITE */}
                    <FiStar
                      size={17}
                      className={`
                        mt-1
                        shrink-0
                        ${
                          note.isFavorite
                            ? "fill-amber-400 text-amber-400"
                            : "text-zinc-700"
                        }
                      `}
                    />

                  </div>

                  {/* BOTTOM */}
                  <div className="mt-4 flex items-center justify-between gap-4">

                    {/* TAGS */}
                    <div className="flex min-w-0 flex-wrap gap-2">

                      {note.tags
                        .slice(0, 3)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="
                              rounded-md
                              bg-zinc-800
                              px-2
                              py-1
                              text-[11px]
                              text-zinc-500
                            "
                          >
                            #{tag}
                          </span>
                        ))}

                    </div>

                    {/* DATE + OPEN */}
                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-4
                        text-xs
                        text-zinc-600
                      "
                    >
                      <span>
                        {formatDate(
                          note.updatedAt ||
                            note.createdAt
                        )}
                      </span>

                      <span className="hidden transition group-hover:text-amber-400 sm:inline">
                        Open →
                      </span>
                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}

      </div>
    </div>
  );
}

export default Notes;