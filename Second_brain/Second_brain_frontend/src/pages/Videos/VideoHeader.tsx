
interface VideoHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddVideo: () => void;
}

const VideoHeader = ({
  search,
  onSearchChange,
  onAddVideo,
}: VideoHeaderProps) => {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Videos
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Your personal video learning space
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2">
          <span className="text-zinc-500">⌕</span>

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search videos..."
            className="w-40 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600 md:w-48"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="text-xs text-zinc-600 transition hover:text-white"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Add Video */}
        <button
          type="button"
          onClick={onAddVideo}
          className="
            rounded-xl
            bg-amber-400
            px-4
            py-2
            text-sm
            font-medium
            text-black
            transition
            hover:bg-amber-300
            active:scale-95
          "
        >
          + Add Video
        </button>
      </div>
    </div>
  );
};

export default VideoHeader;
 
