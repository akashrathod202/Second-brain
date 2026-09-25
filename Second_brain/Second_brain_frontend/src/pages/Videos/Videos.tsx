
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import VideoHeader from "./VideoHeader";
import ContinueLearning from "./ContinueLearning";
import QuickActions from "./QuickActions";
import VideoCategories from "./VideoCategories";
import VideoGrid, { type VideoItem } from "./VideoGrid";

interface BackendContent {
  _id: string;
  title: string;
  link: string;
  type: string;
  tags?: string[];
  createdAt: string;
}

const Videos = () => {
  const navigate = useNavigate();

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError("");

      const token=localStorage.getItem("token")

      if(!token){
        setError("your sesssion has expired.please laogin again")
         return
      }

      const response = await fetch(
        "http://localhost:8000/api/v1/content/getcontent",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 404) {
        setVideos([]);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();

      const videoItems: VideoItem[] = (data.content || [])
        .filter(
          (item: BackendContent) =>
            item.type === "youtube" || item.type === "videos"
        )
        .map((item: BackendContent) => ({
          id: item._id,
          title: item.title,
          url: item.link,
          category: item.tags?.[0] || "General",
          added: item.createdAt,
        }));

      setVideos(videoItems);
    } catch (error) {
      console.error("Video fetch error:", error);
      setError("Unable to load your videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();

    videos.forEach((video) => {
      if (video.category) {
        uniqueCategories.add(video.category);
      }
    });

    return ["All", ...Array.from(uniqueCategories)];
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch = video.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        video.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [videos, search, selectedCategory]);

  const continueVideo = useMemo(() => {
    if (videos.length === 0) return null;

    return [...videos].sort(
      (a, b) =>
        new Date(b.added).getTime() -
        new Date(a.added).getTime()
    )[0];
  }, [videos]);

  const handleRecentlyAdded = () => {
    setSelectedCategory("All");

    setVideos((currentVideos) =>
      [...currentVideos].sort(
        (a, b) =>
          new Date(b.added).getTime() -
          new Date(a.added).getTime()
      )
    );
  };

  const handleCompleted = () => {
    alert("Video completion tracking will be added next.");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="mx-auto max-w-7xl px-6 py-8">
        <VideoHeader />

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <ContinueLearning video={continueVideo} />

          <QuickActions
            onAddVideo={() => navigate("/create")}
            onRecentlyAdded={handleRecentlyAdded}
            onCompleted={handleCompleted}
          />
        </section>

        <section className="mt-10">
          <VideoCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </section>

        <section className="mt-10">
          {loading ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6 py-16 text-center">
              <p className="text-sm text-zinc-500">
                Loading your videos...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-900/40 bg-red-950/20 px-6 py-16 text-center">
              <p className="text-sm text-red-400">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchVideos}
                className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Try Again
              </button>
            </div>
          ) : (
            <VideoGrid videos={filteredVideos} />
          )}
        </section>
      </main>
    </div>
  );
};

export default Videos;
 
