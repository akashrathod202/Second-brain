interface NoteCardProps {
    title: string;
    preview: string;
    category: string;
    tags: string[];
    updated: string;
    favorite?: boolean;
  }
  
  const NoteCard = ({
    title,
    preview,
    category,
    tags,
    updated,
    favorite = false,
  }: NoteCardProps) => {
    return (
      <article
        className="
          group
          cursor-pointer
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900/60
          p-5
          transition-all
          duration-200
          hover:-translate-y-1
          hover:border-zinc-700
          hover:bg-zinc-900
        "
      >
  
        <div className="flex items-start justify-between gap-3">
  
          <span className="rounded-md bg-amber-400/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-amber-400">
            {category}
          </span>
  
          <button
            onClick={(e) => e.stopPropagation()}
            className={`
              text-sm
              transition
              ${
                favorite
                  ? "text-amber-400"
                  : "text-zinc-700 hover:text-zinc-300"
              }
            `}
          >
            ★
          </button>
  
        </div>
  
        <h3 className="mt-4 line-clamp-2 text-base font-semibold leading-6">
          {title}
        </h3>
  
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">
          {preview}
        </p>
  
        <div className="mt-5 flex flex-wrap gap-1.5">
  
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-800 px-2 py-1 text-[10px] text-zinc-500"
            >
              #{tag}
            </span>
          ))}
  
        </div>
  
        <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4">
  
          <span className="text-[10px] text-zinc-600">
            {updated}
          </span>
  
          <span className="text-zinc-700 transition group-hover:text-zinc-400">
            →
          </span>
  
        </div>
  
      </article>
    );
  };
  
  export default NoteCard;