import {
    FiBookOpen,
    FiLink,
    FiVideo,
    FiStar,
    FiArrowUpRight,
  } from "react-icons/fi";
  
  import type { LibraryItem } from "./Library";
  
  type Props = {
    item: LibraryItem;
    onFavorite: (id: string) => void;
  };
  
function LibraryItemCard ({
    item,
    onFavorite,
  }: Props)  {
    const getIcon = () => {
      if (item.type === "note") {
        return FiBookOpen;
      }
  
      if (item.type === "link") {
        return FiLink;
      }
  
      return FiVideo;
    };
  
    const Icon = getIcon();
  
    return (
      <div
        className="
          group
          rounded-2xl
          border border-zinc-800
          bg-zinc-900
          p-5
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:border-zinc-700
          hover:shadow-xl
          hover:shadow-black/20
        "
      >
  
        {/* Top */}
        <div className="flex items-start justify-between">
  
          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-zinc-800
              text-amber-400
            "
          >
            <Icon size={18} />
          </div>
  
          <button
            type="button"
            onClick={() =>
              onFavorite(item.id)
            }
            className={`
              rounded-lg p-2
              transition
              ${
                item.favorite
                  ? "text-amber-400 hover:bg-amber-400/10"
                  : "text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300"
              }
            `}
          >
            <FiStar
              size={17}
              fill={
                item.favorite
                  ? "currentColor"
                  : "none"
              }
            />
          </button>
  
        </div>
  
        {/* Content */}
        <div className="mt-5">
  
          <div className="mb-2 flex items-center gap-2">
  
            <span className="text-xs capitalize text-zinc-500">
              {item.type}
            </span>
  
            <span className="text-zinc-700">
              •
            </span>
  
            <span className="text-xs text-zinc-600">
              {item.collection}
            </span>
  
          </div>
  
          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-white">
            {item.title}
          </h3>
  
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-zinc-500">
            {item.description}
          </p>
  
        </div>
  
        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
  
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="
                rounded-md
                bg-zinc-800
                px-2 py-1
                text-xs text-zinc-400
              "
            >
              #{tag}
            </span>
          ))}
  
        </div>
  
        {/* Footer */}
        <div
          className="
            mt-5
            flex items-center justify-between
            border-t border-zinc-800
            pt-4
          "
        >
  
          <span className="text-xs text-zinc-600">
            {item.createdAt}
          </span>
  
          <button
            type="button"
            className="
              flex items-center gap-1
              text-xs
              text-zinc-500
              transition
              hover:text-amber-400
            "
          >
            Open
            <FiArrowUpRight size={14} />
          </button>
  
        </div>
  
      </div>
    );
  };
  
  export default LibraryItemCard;