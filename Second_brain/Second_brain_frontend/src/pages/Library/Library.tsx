import { useEffect, useMemo, useState } from "react";

import LibraryHeader from "./LibraryHeader";
import LibraryStats from "./LibraryStats";
// import SmartActions from "./SmartActions";
import LibraryFilters from "./LibraryFilters";
import RecentItems from "./RecentItems";

/*
|--------------------------------------------------------------------------
| Library item types used by the frontend
|--------------------------------------------------------------------------
*/

export type LibraryItemType =
  | "note"
  | "link"
  | "video"
  | "youtube"
  | "pdf"
  | "code";

export type LibraryItem = {
  id: string;
  title: string;
  description: string;
  type: LibraryItemType;
  tags: string[];
  collection: string;
  favorite: boolean;
  createdAt: string;

  // Original URL from the database
  link?: string;
};

/*
|--------------------------------------------------------------------------
| Backend content type
|--------------------------------------------------------------------------
|
| This represents the data coming from MongoDB.
| We keep it separate from LibraryItem because the backend
| and frontend structures are not exactly the same.
|
*/

type BackendContent = {
  _id: string;
  title: string;
  link?: string;
  type: LibraryItemType;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  favorite?: boolean;
  collection?: string;
};

/*
|--------------------------------------------------------------------------
| Filter types
|--------------------------------------------------------------------------
*/

type FilterType =
  | "all"
  | "notes"
  | "links"
  | "videos"
  | "favorites"
  | "recent";

/*
|--------------------------------------------------------------------------
| Convert backend data → Library UI data
|--------------------------------------------------------------------------
*/

const mapBackendContent = (
  item: BackendContent
): LibraryItem => {
  return {
    id: item._id,

    title: item.title,

    /*
     * Your current Library UI expects a description.
     *
     * Your create API currently sends title, link, type and tags.
     * So if backend doesn't have description, we use the link
     * as a fallback.
     */
    description:
      item.link ||
      "Saved content in your Second Brain.",

    type: item.type,

    tags: item.tags || [],

    /*
     * Your current UI has collections, but your create API
     * does not currently send a collection.
     *
     * Therefore we temporarily show "General".
     */
    collection:
      item.collection || "General",

    /*
     * If your backend has favorite, use it.
     * Otherwise default to false.
     */
    favorite: item.favorite ?? false,

    createdAt: item.createdAt
      ? formatCreatedAt(item.createdAt)
      : "Recently",

    link: item.link,
  };
};

/*
|--------------------------------------------------------------------------
| Format createdAt
|--------------------------------------------------------------------------
*/

const formatCreatedAt = (
  dateString: string
): string => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const now = new Date();

  const diffMs =
    now.getTime() - date.getTime();

  const diffMinutes =
    Math.floor(diffMs / (1000 * 60));

  const diffHours =
    Math.floor(diffMs / (1000 * 60 * 60));

  const diffDays =
    Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} ${
      diffMinutes === 1
        ? "minute"
        : "minutes"
    } ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} ${
      diffHours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/*
|--------------------------------------------------------------------------
| Library component
|--------------------------------------------------------------------------
*/

function Library() {
  const [items, setItems] =
    useState<LibraryItem[]>([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<FilterType>("all");

  const [collection, setCollection] =
    useState("All Collections");

  /*
  |--------------------------------------------------------------------------
  | Loading / Error
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch content from backend
  |--------------------------------------------------------------------------
  */

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/v1/content/getcontent",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          credentials: "include",
        }
      );

      /*
       * Your backend returns 404 when there is
       * no content.
       *
       * We treat that as an empty library instead
       * of showing an error.
       */
      if (response.status === 404) {
        setItems([]);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch your library."
        );
      }

      /*
       * Backend response:
       *
       * {
       *   message: "...",
       *   status: "success",
       *   content: [...]
       * }
       */

      const backendItems =
        data.content || [];

      const formattedItems =
        backendItems.map(
          (item: BackendContent) =>
            mapBackendContent(item)
        );

      setItems(formattedItems);
    } catch (err) {
      console.error(
        "Library fetch error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading your library."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Fetch when Library opens
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchContent();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Filter items
  |--------------------------------------------------------------------------
  */

  const filteredItems = useMemo(() => {
    let result = [...items];

    /*
     * Search
     */

    if (search.trim()) {
      const query =
        search.toLowerCase().trim();

      result = result.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(query) ||

          item.description
            .toLowerCase()
            .includes(query) ||

          item.tags.some((tag) =>
            tag
              .toLowerCase()
              .includes(query)
          )
      );
    }

    /*
     * Notes
     */

    if (filter === "notes") {
      result = result.filter(
        (item) =>
          item.type === "note"
      );
    }

    /*
     * Links
     */

    if (filter === "links") {
      result = result.filter(
        (item) =>
          item.type === "link"
      );
    }

    /*
     * Videos
     *
     * Your create feature supports:
     * - video
     * - videos
     * - youtube
     *
     * Our current type is "video" / "youtube".
     */

    if (filter === "videos") {
      result = result.filter(
        (item) =>
          item.type === "video" ||
          item.type === "youtube"
      );
    }

    /*
     * Favorites
     */

    if (filter === "favorites") {
      result = result.filter(
        (item) => item.favorite
      );
    }

    /*
     * Recently added
     */

    if (filter === "recent") {
      result = [...result]
        .sort(
          (a, b) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        )
        .slice(0, 5);
    }

    /*
     * Collection
     */

    if (
      collection !==
      "All Collections"
    ) {
      result = result.filter(
        (item) =>
          item.collection ===
          collection
      );
    }

    return result;
  }, [
    items,
    search,
    filter,
    collection,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Toggle favorite
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | At this stage this only changes the frontend state.
  |
  | We have not yet created a backend endpoint
  | for updating favorites.
  |
  */

  const toggleFavorite = (
    id: string
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              favorite:
                !item.favorite,
            }
          : item
      )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Loading UI
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
        <div className="mx-auto max-w-7xl">

          <LibraryHeader
            search={search}
            onSearchChange={setSearch}
          />

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            {[1, 2, 3, 4, 5].map(
              (item) => (
                <div
                  key={item}
                  className="
                    h-24
                    animate-pulse
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                  "
                />
              )
            )}
          </div>

          <div className="mt-8">
            <div
              className="
                h-6
                w-40
                animate-pulse
                rounded
                bg-zinc-900
              "
            />

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <div
                    key={item}
                    className="
                      h-64
                      animate-pulse
                      rounded-2xl
                      border
                      border-zinc-800
                      bg-zinc-900
                    "
                  />
                )
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">

        <LibraryHeader
          search={search}
          onSearchChange={setSearch}
        />

        {/*
        |--------------------------------------------------------------------------
        | Error
        |--------------------------------------------------------------------------
        */}

        {error && (
          <div
            className="
              mt-6
              flex items-center justify-between
              rounded-xl
              border border-red-500/20
              bg-red-500/5
              px-4 py-3
              text-sm
              text-red-400
            "
          >
            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={fetchContent}
              className="
                rounded-lg
                bg-red-500/10
                px-3 py-1.5
                text-xs
                text-red-300
                transition
                hover:bg-red-500/20
              "
            >
              Retry
            </button>
          </div>
        )}

        {/*
        |--------------------------------------------------------------------------
        | Statistics
        |--------------------------------------------------------------------------
        */}

        <LibraryStats
          items={items}
        />

        {/*
        |--------------------------------------------------------------------------
        | Quick Actions
        |--------------------------------------------------------------------------
        */}

        {/* <SmartActions /> */}

        {/*
        |--------------------------------------------------------------------------
        | Filters
        |--------------------------------------------------------------------------
        */}

        <LibraryFilters
          filter={filter}
          collection={collection}
          onFilterChange={setFilter}
          onCollectionChange={
            setCollection
          }
        />

        {/*
        |--------------------------------------------------------------------------
        | Knowledge
        |--------------------------------------------------------------------------
        */}

        <RecentItems
          items={filteredItems}
          onFavorite={
            toggleFavorite
          }
        />

      </div>
    </div>
  );
}

export default Library;