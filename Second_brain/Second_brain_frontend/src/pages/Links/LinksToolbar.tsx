import {
    FiGrid,
    FiList,
    FiFilter,
    FiClock,
  } from "react-icons/fi";
  
  type ViewMode = "grid" | "list";
  
  type FilterType =
    | "all"
    | "favorites"
    | "unread"
    | "read";
  
  type Props = {
    viewMode: ViewMode;
    filter: FilterType;
    onViewChange: (view: ViewMode) => void;
    onFilterChange: (filter: FilterType) => void;
  };
  
  const LinksToolbar = ({
    viewMode,
    filter,
    onViewChange,
    onFilterChange,
  }: Props) => {
    return (
      <div
        className="
          flex flex-col gap-4
          border-b border-zinc-800
          pb-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            className={`
              rounded-lg px-3 py-2
              text-sm transition-colors
              ${
                filter === "all"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              }
            `}
          >
            All Links
          </button>
  
          <button
            type="button"
            onClick={() => onFilterChange("favorites")}
            className={`
              rounded-lg px-3 py-2
              text-sm transition-colors
              ${
                filter === "favorites"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              }
            `}
          >
            Favorites
          </button>
  
          <button
            type="button"
            onClick={() => onFilterChange("unread")}
            className={`
              rounded-lg px-3 py-2
              text-sm transition-colors
              ${
                filter === "unread"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              }
            `}
          >
            Unread
          </button>
  
          <button
            type="button"
            onClick={() => onFilterChange("read")}
            className={`
              rounded-lg px-3 py-2
              text-sm transition-colors
              ${
                filter === "read"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              }
            `}
          >
            Read
          </button>
        </div>
  
        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Sort */}
          <button
            type="button"
            className="
              flex items-center gap-2
              rounded-lg
              border border-zinc-800
              bg-zinc-900
              px-3 py-2
              text-sm text-zinc-400
              transition-colors
              hover:border-zinc-700
              hover:text-zinc-300
            "
          >
            <FiClock size={15} />
            Recently Added
          </button>
  
          {/* Filter */}
          <button
            type="button"
            className="
              rounded-lg
              border border-zinc-800
              bg-zinc-900
              p-2
              text-zinc-500
              transition-colors
              hover:border-zinc-700
              hover:text-zinc-300
            "
            aria-label="Filter links"
          >
            <FiFilter size={16} />
          </button>
  
          {/* Grid */}
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            className={`
              rounded-lg p-2
              transition-colors
              ${
                viewMode === "grid"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:bg-zinc-900"
              }
            `}
            aria-label="Grid view"
          >
            <FiGrid size={17} />
          </button>
  
          {/* List */}
          <button
            type="button"
            onClick={() => onViewChange("list")}
            className={`
              rounded-lg p-2
              transition-colors
              ${
                viewMode === "list"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:bg-zinc-900"
              }
            `}
            aria-label="List view"
          >
            <FiList size={17} />
          </button>
        </div>
      </div>
    );
  };
  
  export default LinksToolbar;