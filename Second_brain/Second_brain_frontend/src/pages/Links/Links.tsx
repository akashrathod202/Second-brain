import { useEffect, useMemo, useState } from "react";
import {
  FiGrid,
  FiList,
  FiSearch,
  FiPlus,
  FiStar,
  FiExternalLink,
} from "react-icons/fi";

import LinkCard from "./LinkCard";
import LinkListItem from "./LinkListItem";

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  description: string;
  domain: string;
  favicon: string;
  tags: string[];
  favorite: boolean;
  read: boolean;
  added: string;
};

type Filter = "all" | "favorites" | "unread" | "read" | "recent";

function Links() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH LINKS =================

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);
        setError("");
        
        const token=localStorage.getItem("token")

        if(!token){
          setError("your sesssion has expired.please laogin again")
           return
        }
        const response = await fetch(
          "http://localhost:8000/api/v1/content/getcontent",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Backend returns 404 when there is no content
        if (response.status === 404) {
          setLinks([]);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch links");
        }

        const data = await response.json();

        const linkItems: LinkItem[] = (data.content || [])
          .filter((item: any) => item.type === "link")
          .map((item: any) => {
            let domain = "";

            try {
              domain = new URL(item.link).hostname.replace("www.", "");
            } catch {
              domain = item.link;
            }

            return {
              id: item._id,
              title: item.title,
              url: item.link,
              description: "",
              domain,
              favicon: `https://www.google.com/s2/favicons?domain=${item.link}&sz=64`,
              tags: item.tags || [],
              favorite: false,
              read: false,
              added: item.createdAt,
            };
          });

        setLinks(linkItems);
      } catch (err) {
        console.error("Error fetching links:", err);
        setError("Unable to load your links.");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  // ================= SEARCH + FILTER =================

  const filteredLinks = useMemo(() => {
    let result = [...links];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (link) =>
          link.title.toLowerCase().includes(query) ||
          link.description.toLowerCase().includes(query) ||
          link.domain.toLowerCase().includes(query) ||
          link.tags.some((tag) =>
            tag.toLowerCase().includes(query)
          )
      );
    }

    // Filter
    if (filter === "favorites") {
      result = result.filter((link) => link.favorite);
    }

    if (filter === "unread") {
      result = result.filter((link) => !link.read);
    }

    if (filter === "read") {
      result = result.filter((link) => link.read);
    }

    if (filter === "recent") {
      result = result.slice(0, 4);
    }

    return result;
  }, [links, search, filter]);

  // ================= TOGGLE FAVORITE =================

  const toggleFavorite = (id: string) => {
    setLinks((current) =>
      current.map((link) =>
        link.id === id
          ? {
              ...link,
              favorite: !link.favorite,
            }
          : link
      )
    );
  };

  // ================= TOGGLE READ =================

  const toggleRead = (id: string) => {
    setLinks((current) =>
      current.map((link) =>
        link.id === id
          ? {
              ...link,
              read: !link.read,
            }
          : link
      )
    );
  };

  // ================= DELETE =================

  const deleteLink = (id: string) => {
    setLinks((current) =>
      current.filter((link) => link.id !== id)
    );
  };

  // ================= ADD LINK =================

  const handleAddLink = () => {
    console.log("Add link clicked");
  };

  // ================= OPEN LINK =================

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Links
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Save and organize useful resources for your second brain.
            </p>
          </div>

          <button
            onClick={handleAddLink}
            className="
              flex items-center justify-center gap-2
              rounded-xl
              bg-amber-400
              px-4 py-2.5
              text-sm font-medium
              text-black
              transition-all
              hover:bg-amber-300
              active:scale-95
            "
          >
            <FiPlus size={17} />
            Add Link
          </button>
        </div>

        {/* ================= SEARCH + VIEW ================= */}

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* Search */}

          <div className="relative w-full md:max-w-md">
            <FiSearch
              className="
                absolute left-3 top-1/2
                -translate-y-1/2
                text-zinc-500
              "
              size={18}
            />

            <input
              type="text"
              placeholder="Search your links..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                rounded-xl
                border border-zinc-800
                bg-zinc-900
                py-2.5
                pl-10
                pr-4
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-zinc-600
                focus:border-zinc-700
                focus:ring-2
                focus:ring-amber-400/10
              "
            />
          </div>

          {/* View switch */}

          <div
            className="
              flex items-center gap-1
              rounded-xl
              border border-zinc-800
              bg-zinc-900
              p-1
            "
          >
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`
                rounded-lg
                p-2
                transition
                ${
                  view === "grid"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }
              `}
            >
              <FiGrid size={17} />
            </button>

            <button
              type="button"
              onClick={() => setView("list")}
              className={`
                rounded-lg
                p-2
                transition
                ${
                  view === "list"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }
              `}
            >
              <FiList size={17} />
            </button>
          </div>
        </div>

        {/* ================= FILTERS ================= */}

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {[
            ["all", "All"],
            ["favorites", "Favorites"],
            ["unread", "Unread"],
            ["read", "Read"],
            ["recent", "Recently Added"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value as Filter)}
              className={`
                flex
                items-center
                whitespace-nowrap
                rounded-lg
                px-4
                py-2
                text-sm
                font-medium
                transition
                ${
                  filter === value
                    ? "bg-zinc-800 text-white"
                    : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                }
              `}
            >
              {value === "favorites" && (
                <FiStar
                  className="mr-1.5"
                  size={14}
                  fill={
                    filter === "favorites"
                      ? "currentColor"
                      : "none"
                  }
                />
              )}

              {label}
            </button>
          ))}
        </div>

        {/* ================= RESULT HEADER ================= */}

        <div className="mt-8 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Your Links
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {filteredLinks.length} resources
            </p>
          </div>
        </div>

        {/* ================= CONTENT ================= */}

        {loading ? (
          <div
            className="
              mt-6
              rounded-2xl
              border border-zinc-800
              bg-zinc-900/50
              p-16
              text-center
            "
          >
            <p className="text-sm text-zinc-500">
              Loading your links...
            </p>
          </div>
        ) : error ? (
          <div
            className="
              mt-6
              rounded-2xl
              border border-red-900/50
              bg-red-950/20
              p-16
              text-center
            "
          >
            <p className="font-medium text-white">
              Something went wrong
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {error}
            </p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div
            className="
              mt-6
              rounded-2xl
              border border-dashed
              border-zinc-800
              bg-zinc-900/50
              p-16
              text-center
            "
          >
            <p className="font-medium text-white">
              No links found
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Try another search or add a new resource.
            </p>
          </div>
        ) : view === "grid" ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLinks.map((link) => (
              <div key={link.id} className="relative">
                <LinkCard
                  link={link}
                  onFavorite={toggleFavorite}
                  onRead={toggleRead}
                  onDelete={deleteLink}
                />

                {/* Open link */}

                <button
                  type="button"
                  onClick={() => openLink(link.url)}
                  className="
                    absolute
                    right-4
                    top-4
                    rounded-lg
                    border border-zinc-700
                    bg-zinc-900/90
                    p-2
                    text-zinc-400
                    backdrop-blur
                    transition
                    hover:border-amber-400/40
                    hover:text-amber-400
                  "
                  title="Open link"
                >
                  <FiExternalLink size={15} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {filteredLinks.map((link) => (
              <div key={link.id} className="relative">
                <LinkListItem
                  link={link}
                  onFavorite={toggleFavorite}
                  onRead={toggleRead}
                  onDelete={deleteLink}
                />

                {/* Open link */}

                <button
                  type="button"
                  onClick={() => openLink(link.url)}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    rounded-lg
                    border border-zinc-700
                    bg-zinc-900
                    p-2
                    text-zinc-400
                    transition
                    hover:border-amber-400/40
                    hover:text-amber-400
                  "
                  title="Open link"
                >
                  <FiExternalLink size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Links;