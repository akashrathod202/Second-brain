import {
    FiExternalLink,
    FiMoreVertical,
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
  
  export default function LinkCard({
    link,
    onFavorite,
    onRead,
    onDelete,
  }: Props) {
    return (
      <div
        className="
          group rounded-2xl border border-slate-200
          bg-white p-5
          transition duration-200
          hover:-translate-y-1
          hover:border-slate-300
          hover:shadow-lg hover:shadow-slate-200/50
        "
      >
  
        {/* Top */}
        <div className="flex items-start justify-between">
  
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
            <img
              src={link.favicon}
              alt=""
              className="h-6 w-6 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
  
          <div className="flex items-center gap-1">
  
            <button
              onClick={() => onFavorite(link.id)}
              className={`rounded-lg p-2 transition ${
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
              className="
                rounded-lg p-2 text-slate-400
                hover:bg-slate-100
              "
            >
              <FiMoreVertical size={17} />
            </button>
  
          </div>
        </div>
  
        {/* Content */}
        <div className="mt-5">
  
          <h3 className="line-clamp-1 font-semibold text-slate-900">
            {link.title}
          </h3>
  
          <p className="mt-1 text-xs font-medium text-slate-400">
            {link.domain}
          </p>
  
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
            {link.description}
          </p>
  
        </div>
  
        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
  
          {link.tags.map((tag) => (
            <span
              key={tag}
              className="
                rounded-md bg-slate-100
                px-2 py-1 text-[11px]
                font-medium text-slate-500
              "
            >
              #{tag}
            </span>
          ))}
  
        </div>
  
        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
  
          <div className="flex items-center gap-2 text-xs text-slate-400">
  
            {link.read ? (
              <>
                <FiCheck size={14} />
                Read
              </>
            ) : (
              <>
                <FiClock size={14} />
                Unread
              </>
            )}
  
          </div>
  
          <div className="flex items-center gap-1">
  
            <button
              onClick={() => onRead(link.id)}
              className="
                rounded-lg px-2.5 py-1.5
                text-xs font-medium
                text-slate-500
                hover:bg-slate-100
              "
            >
              {link.read ? "Mark unread" : "Mark read"}
            </button>
  
            <button
              onClick={() => window.open(link.url, "_blank")}
              className="
                rounded-lg bg-slate-900
                p-2 text-white
                transition hover:bg-slate-700
              "
            >
              <FiExternalLink size={15} />
            </button>
  
          </div>
  
        </div>
  
      </div>
    );
  }