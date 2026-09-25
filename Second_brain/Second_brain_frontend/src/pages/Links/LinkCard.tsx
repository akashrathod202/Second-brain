import {
    FiExternalLink,
    FiStar,
    FiCheck,
    FiClock,
    FiTrash2,
  } from "react-icons/fi";
  
  import type { LinkItem } from "./Links";
  
  type Props = {
    link: LinkItem;
    onFavorite: (id: string) => void;
    onRead: (id: string) => void;
    onDelete: (id: string) => void;
  };
  
  const LinkCard = ({
    link,
    onFavorite,
    onRead,
    onDelete,
  }: Props) => {
    return (
      <div
        className="
          group rounded-2xl
          border border-zinc-800
          bg-zinc-900
          p-5
          transition-all duration-200
          hover:-translate-y-0.5
          hover:border-zinc-700
          hover:shadow-lg hover:shadow-black/20
        "
      >
        {/* Top Section */}
        <div className="flex items-start justify-between gap-4">
          {/* Favicon + Domain */}
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-xl
                bg-zinc-800
              "
            >
              <img
                src={link.favicon}
                alt=""
                className="h-6 w-6 object-contain"
              />
            </div>
  
            <div className="min-w-0">
              <p className="truncate text-xs text-zinc-500">
                {link.domain}
              </p>
  
              <p className="mt-0.5 text-xs text-zinc-600">
                {link.read ? "Read" : "Unread"}
              </p>
            </div>
          </div>
  
          {/* Favorite */}
          <button
            type="button"
            onClick={() => onFavorite(link.id)}
            aria-label={
              link.favorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
            className={`
              rounded-lg p-2 transition-colors
              ${
                link.favorite
                  ? "text-amber-400 hover:bg-amber-400/10"
                  : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              }
            `}
          >
            <FiStar
              size={17}
              fill={link.favorite ? "currentColor" : "none"}
            />
          </button>
        </div>
  
        {/* Content */}
        <div className="mt-5">
          <h3
            className="
              line-clamp-2
              text-base font-semibold
              leading-6 text-white
            "
          >
            {link.title}
          </h3>
  
          <p
            className="
              mt-2
              line-clamp-2
              text-sm leading-5
              text-zinc-500
            "
          >
            {link.description}
          </p>
        </div>
  
        {/* Tags */}
        {link.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {link.tags.slice(0, 3).map((tag) => (
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
        )}
  
        {/* Divider */}
        <div className="my-4 border-t border-zinc-800" />
  
        {/* Bottom Actions */}
        <div className="flex items-center justify-between">
          {/* Read Status */}
          <button
            type="button"
            onClick={() => onRead(link.id)}
            className="
              flex items-center gap-2
              rounded-lg px-2 py-1.5
              text-xs text-zinc-500
              transition-colors
              hover:bg-zinc-800
              hover:text-zinc-300
            "
          >
            {link.read ? (
              <>
                <FiCheck size={15} />
                Read
              </>
            ) : (
              <>
                <FiClock size={15} />
                Unread
              </>
            )}
          </button>
  
          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Delete */}
            <button
              type="button"
              onClick={() => onDelete(link.id)}
              aria-label="Delete link"
              className="
                rounded-lg p-2
                text-zinc-500
                transition-colors
                hover:bg-red-500/10
                hover:text-red-400
              "
            >
              <FiTrash2 size={15} />
            </button>
  
            {/* Open */}
            <button
              type="button"
              onClick={() => window.open(link.url, "_blank")}
              aria-label="Open link"
              className="
                flex items-center gap-2
                rounded-lg
                bg-amber-400
                px-3 py-2
                text-xs font-medium
                text-black
                transition-colors
                hover:bg-amber-300
              "
            >
              Open
              <FiExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default LinkCard;