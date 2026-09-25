interface VideoCardProps {
  title: string;
  category: string;
  duration: string;
  progress: number;
  status: "not-started" | "in-progress" | "completed";
  url: string;
}

const VideoCard = ({
  title,
  category,
  duration,
  progress,
  status,
  url,
}: VideoCardProps) => {
  const statusText = {
    "not-started": "Not Started",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  const openVideo = () => {
    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      onClick={openVideo}
      className="
        group
        cursor-pointer
        overflow-hidden
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/60
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-zinc-700
        hover:bg-zinc-900
      "
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-zinc-800">
        <div className="flex h-full items-center justify-center text-3xl text-zinc-600 transition group-hover:text-amber-400">
          ▶
        </div>

        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-[11px]">
          {duration}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-amber-400">
              {category}
            </p>

            <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5">
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 text-zinc-600 transition hover:text-white"
          >
            ⋮
          </button>
        </div>

        {/* Status */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <span
            className={
              status === "completed"
                ? "text-green-400"
                : status === "in-progress"
                  ? "text-amber-400"
                  : "text-zinc-500"
            }
          >
            {status === "completed" && "✓ "}
            {status === "in-progress" && "◐ "}
            {status === "not-started" && "○ "}
            {statusText[status]}
          </span>

          <span className="text-zinc-600">
            {progress}%
          </span>
        </div>

        {/* Progress */}
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-amber-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </article>
  );
};

export default VideoCard;