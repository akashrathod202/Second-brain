import { FiChevronDown } from "react-icons/fi";

type Filter =
  | "all"
  | "notes"
  | "links"
  | "videos"
  | "favorites"
  | "recent";

type Props = {
  filter: Filter;
  collection: string;
  onFilterChange: (filter: Filter) => void;
  onCollectionChange: (collection: string) => void;
};

const LibraryFilters = ({
  filter,
  collection,
  onFilterChange,
  onCollectionChange,
}: Props) => {
  const filters: {
    value: Filter;
    label: string;
  }[] = [
    { value: "all", label: "All" },
    { value: "notes", label: "Notes" },
    { value: "links", label: "Links" },
    { value: "videos", label: "Videos" },
    { value: "favorites", label: "Favorites" },
    { value: "recent", label: "Recently Added" },
  ];

  return (
    <div className="mt-10">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Type filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">

          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                onFilterChange(item.value)
              }
              className={`
                whitespace-nowrap
                rounded-lg
                px-4 py-2
                text-sm
                font-medium
                transition
                ${
                  filter === item.value
                    ? "bg-amber-400 text-black"
                    : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                }
              `}
            >
              {item.label}
            </button>
          ))}

        </div>

        {/* Collection */}
        <div className="relative">

          <select
            value={collection}
            onChange={(e) =>
              onCollectionChange(e.target.value)
            }
            className="
              appearance-none
              rounded-xl
              border border-zinc-800
              bg-zinc-900
              px-4 py-2.5
              pr-10
              text-sm
              text-zinc-300
              outline-none
              focus:border-zinc-700
            "
          >
            <option>All Collections</option>
            <option>Development</option>
            <option>DSA</option>
            <option>AI</option>
            <option>Learning</option>
          </select>

          <FiChevronDown
            size={15}
            className="
              pointer-events-none
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-zinc-500
            "
          />

        </div>

      </div>
    </div>
  );
};

export default LibraryFilters;