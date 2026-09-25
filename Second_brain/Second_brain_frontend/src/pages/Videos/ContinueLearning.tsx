
import type { VideoItem } from "./VideoGrid";

interface ContinueLearningProps {
  video: VideoItem | null;
}

const ContinueLearning = ({ video }: ContinueLearningProps) => {
  if (!video) {
    return (
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <div className="p-5">
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-wider text-amber-400">
              Continue Learning
            </p>

            <h2 className="mt-1 text-lg font-semibold">
              Pick up where you left off
            </h2>
          </div>

          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950 px-6 py-12 text-center">
            <div className="text-3xl text-zinc-700">▶</div>

            <p className="mt-3 text-sm text-zinc-500">
              No videos available yet.
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Add a video to start learning.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const openVideo = () => {
    if (!video.url) return;

    window.open(video.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-amber-400">
              Continue Learning
            </p>

            <h2 className="mt-1 text-lg font-semibold">
              Pick up where you left off
            </h2>
          </div>

          <span className="text-xs text-zinc-500">
            Recently Added
          </span>
        </div>

        <div
          onClick={openVideo}
          className="group grid cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 md:grid-cols-[260px_1fr]"
        >
          {/* Thumbnail */}
          <div className="relative aspect-video bg-zinc-800 md:aspect-auto">
            <div className="flex h-full items-center justify-center text-4xl text-zinc-600 transition group-hover:text-amber-400">
              ▶
            </div>

            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs">
              Video
            </span>
          </div>

          {/* Information */}
          <div className="flex flex-col justify-center p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-amber-400">
              {video.category}
            </p>

            <h3 className="mt-1 text-lg font-semibold">
              {video.title}
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Continue watching this video from your SecondBrain library.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
                {video.category}
              </span>

              <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
                Saved
              </span>
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openVideo();
              }}
              className="mt-5 w-fit rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              ▶ Open Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueLearning;

