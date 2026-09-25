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
  description: string;
  tags: string[];
  collection: string;
  favorite: boolean;
  createdAt: string;
  updatedAt?: string;
};

type FilterType = "all" | "favorites" | "recent" | string;

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

      const response = await fetch(`${"http://localhost:8000/api/v1/content/getcontent"}?search=${encodeURIComponent(search)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setNotes([]);
          return;
        }

        throw new Error(
          data.message || "Failed to fetch notes"
        );
      }

      const backendNotes = (data.content || [])
        .filter((item: any) => item.type === "note")
        .map((item: any) => ({
          id: item._id,
          title: item.title || "Untitled Note",
          description:
            item.description ||
            item.content ||
            "No description available.",
          tags: item.tags || [],
          collection:
            item.collection || "Uncategorized",
          favorite: Boolean(item.favorite),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

      setNotes(backendNotes);
    } catch (err) {
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

  const collections = useMemo(() => {
    const unique = new Set(
      notes.map((note) => note.collection)
    );

    return Array.from(unique);
  }, [notes]);

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (filter === "favorites") {
      result = result.filter(
        (note) => note.favorite
      );
    }

    if (filter === "recent") {
      result = result.slice(0, 8);
    }

    if (
      filter !== "all" &&
      filter !== "favorites" &&
      filter !== "recent"
    ) {
      result = result.filter(
        (note) => note.collection === filter
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(
        a.updatedAt || a.createdAt
      ).getTime();

      const dateB = new Date(
        b.updatedAt || b.createdAt
      ).getTime();

      return sort === "updated"
        ? dateB - dateA
        : new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime();
    });

    return result;
  }, [notes, filter, sort]);

  const toggleFavorite = async (id: string) => {
    /*
      We will connect this to your backend
      PATCH favorite API after we create that route.
      
      For now update the UI optimistically.
    */

    setNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
              ...note,
              favorite: !note.favorite,
            }
          : note
      )
    );
  };

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

        {/* Header */}

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
                onChange={(e) =>
                  setSearch(e.target.value)
                }
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

        {/* Main content */}

        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr]">

          {/* Sidebar */}

          <aside className="
            rounded-2xl
            border border-zinc-800
            bg-zinc-900/60
            p-5
            lg:h-fit
          ">

            <p className="text-xs font-medium tracking-wider text-zinc-500">
              LIBRARY
            </p>

            <div className="mt-4 space-y-2">

              <button
                onClick={() => setFilter("all")}
                className={`
                  flex w-full items-center justify-between
                  rounded-xl px-4 py-3
                  text-sm
                  transition
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

              <button
                onClick={() => setFilter("favorites")}
                className={`
                  flex w-full items-center justify-between
                  rounded-xl px-4 py-3
                  text-sm
                  transition
                  ${
                    filter === "favorites"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <FiStar />
                  Favorites
                </span>

                <span className="text-xs text-zinc-500">
                  {
                    notes.filter(
                      (note) => note.favorite
                    ).length
                  }
                </span>
              </button>

              <button
                onClick={() => setFilter("recent")}
                className={`
                  flex w-full items-center justify-between
                  rounded-xl px-4 py-3
                  text-sm
                  transition
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

            {/* Collections */}

            {collections.length > 0 && (
              <>
                <div className="my-6 h-px bg-zinc-800" />

                <p className="text-xs font-medium tracking-wider text-zinc-500">
                  COLLECTIONS
                </p>

                <div className="mt-4 space-y-1">

                  {collections.map((item) => (
                    <button
                      key={item}
                      onClick={() =>
                        setFilter(item)
                      }
                      className={`
                        flex w-full items-center
                        rounded-xl px-4 py-3
                        text-sm
                        transition
                        ${
                          filter === item
                            ? "bg-zinc-800 text-white"
                            : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                        }
                      `}
                    >
                      <span className="mr-3">
                        ●
                      </span>

                      {item}
                    </button>
                  ))}

                </div>
              </>
            )}

          </aside>

          {/* Notes */}

          <section>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <p className="text-xs tracking-wider text-zinc-600">
                  YOUR KNOWLEDGE
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  All Notes
                </h2>
              </div>

              <select
                value={sort}
                onChange={(e) =>
                  setSort(
                    e.target.value as
                      | "updated"
                      | "newest"
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

            {/* Filter buttons */}

            <div className="mt-6 flex flex-wrap gap-2">

              <button
                onClick={() => setFilter("all")}
                className={`
                  rounded-xl px-4 py-2
                  text-sm
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
                onClick={() => setFilter("favorites")}
                className={`
                  rounded-xl px-4 py-2
                  text-sm
                  ${
                    filter === "favorites"
                      ? "bg-amber-400 text-black"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-400"
                  }
                `}
              >
                Favorites
              </button>

              {collections.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`
                    rounded-xl px-4 py-2
                    text-sm
                    ${
                      filter === item
                        ? "bg-amber-400 text-black"
                        : "border border-zinc-800 bg-zinc-900 text-zinc-400"
                    }
                  `}
                >
                  {item}
                </button>
              ))}

            </div>

            {/* Loading */}

            {loading && (
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(
                  (item) => (
                    <div
                      key={item}
                      className="
                        h-80
                        animate-pulse
                        rounded-2xl
                        border border-zinc-800
                        bg-zinc-900
                      "
                    />
                  )
                )}
              </div>
            )}

            {/* Error */}

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

            {/* Empty */}

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
                      onClick={() =>
                        navigate("/create")
                      }
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

            {/* Cards */}

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
                    <div
                      key={note.id}
                      className="
                        group
                        rounded-2xl
                        border border-zinc-800
                        bg-zinc-900
                        p-6
                        transition
                        hover:-translate-y-0.5
                        hover:border-zinc-700
                        hover:shadow-xl
                        hover:shadow-black/20
                      "
                    >

                      <div className="flex items-start justify-between">

                        <span className="
                          rounded-lg
                          bg-amber-400/10
                          px-3 py-1.5
                          text-[11px]
                          font-semibold
                          uppercase
                          tracking-wide
                          text-amber-400
                        ">
                          {note.collection}
                        </span>

                        <button
                          onClick={() =>
                            toggleFavorite(note.id)
                          }
                          className="
                            rounded-lg
                            p-2
                            text-zinc-600
                            hover:bg-zinc-800
                            hover:text-amber-400
                          "
                        >
                          <FiStar
                            size={17}
                            fill={
                              note.favorite
                                ? "currentColor"
                                : "none"
                            }
                            className={
                              note.favorite
                                ? "text-amber-400"
                                : ""
                            }
                          />
                        </button>

                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/content/${note.id}`
                          )
                        }
                        className="mt-6 block w-full text-left"
                      >
                        <h3 className="
                          line-clamp-2
                          text-lg
                          font-semibold
                          leading-7
                          text-white
                        ">
                          {note.title}
                        </h3>

                        <p className="
                          mt-3
                          line-clamp-3
                          text-sm
                          leading-7
                          text-zinc-500
                        ">
                          {note.description}
                        </p>
                      </button>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {note.tags
                          .slice(0, 3)
                          .map((tag) => (
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
                            note.updatedAt ||
                              note.createdAt
                          )}
                        </span>

                        <button
                          onClick={() =>
                            navigate(
                              `/content/${note.id}`
                            )
                          }
                          className="
                            text-xs
                            text-zinc-500
                            hover:text-amber-400
                          "
                        >
                          Open →
                        </button>
                      </div>

                    </div>
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