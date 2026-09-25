import VideoCard from "./VideoCard";

export type VideoItem = {
  id: string;
  title: string;
  url: string;
  category: string;
  added: string;
};

type VideoGridProps = {
  videos: VideoItem[];
};

const VideoGrid = ({ videos }: VideoGridProps) => {
  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Your Library
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            All Videos
          </h2>
        </div>

        <button className="text-sm text-zinc-500 transition hover:text-white">
          Sort: Recent ▾
        </button>
      </div>

      {/* Videos */}
      {videos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 p-16 text-center">
          <p className="font-medium text-white">
            No videos found
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Add a YouTube video or video resource to your SecondBrain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              title={video.title}
              category={video.category}
              duration="--"
              progress={0}
              status="not-started"
              url={video.url}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoGrid;