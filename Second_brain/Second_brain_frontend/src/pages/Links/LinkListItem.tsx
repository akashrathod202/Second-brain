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
  
 function LinkListItem ({
    link,
    onFavorite,
    onRead,
    onDelete,
  }: Props) {
    return (
      <div
        className="
          flex flex-col gap-4
          rounded-2xl border border-slate-200
          bg-white p-4
          transition hover:border-slate-300
          md:flex-row md:items-center
        "
      >
  
        {/* Favicon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <img
            src={link.favicon}
            alt=""
            className="h-6 w-6 object-contain"
          />
        </div>
  
        {/* Main */}
        <div className="min-w-0 flex-1">
  
          <h3 className="truncate font-semibold text-slate-900">
            {link.title}
          </h3>
  
          <p className="mt-1 text-xs text-slate-400">
            {link.domain}
          </p>
  
          <p className="mt-2 line-clamp-1 text-sm text-slate-500">
            {link.description}
          </p>
  
        </div>
  
        {/* Tags */}
        <div className="hidden gap-2 lg:flex">
          {link.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500"
            >
              #{tag}
            </span>
          ))}
        </div>
  
        {/* Status */}
        <div className="flex items-center gap-2">
  
          <button
            onClick={() => onFavorite(link.id)}
            className={`rounded-lg p-2 ${
              link.favorite
                ? "text-yellow-500"
                : "text-slate-400 hover:bg-slate-100"
            }`}
          >
            <FiStar
              size={17}
              fill={link.favorite ? "currentColor" : "none"}
            />
          </button>
  
          <button
            onClick={() => onRead(link.id)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            {link.read ? (
              <FiCheck size={17} />
            ) : (
              <FiClock size={17} />
            )}
          </button>
  
          <button
            onClick={() => window.open(link.url, "_blank")}
            className="
              rounded-lg bg-slate-900
              p-2 text-white
              hover:bg-slate-700
            "
          >
            <FiExternalLink size={16} />
          </button>
  
        </div>
  
      </div>
    );
  }

 export default LinkListItem