import {
    FiBookOpen,
    FiLink,
    FiVideo,
    FiStar,
  } from "react-icons/fi";
  
  import type { LibraryItem } from "./Library";
  
  type Props = {
    items: LibraryItem[];
  };
  
  const LibraryStats = ({ items }: Props) => {
    const notes = items.filter(
      (item) => item.type === "note"
    ).length;
  
    const links = items.filter(
      (item) => item.type === "link"
    ).length;
  
    const videos = items.filter(
      (item) => item.type === "video"
    ).length;
  
    const favorites = items.filter(
      (item) => item.favorite
    ).length;
  
    const stats = [
      {
        label: "Total Items",
        value: items.length,
        icon: FiBookOpen,
      },
      {
        label: "Notes",
        value: notes,
        icon: FiBookOpen,
      },
      {
        label: "Links",
        value: links,
        icon: FiLink,
      },
      {
        label: "Videos",
        value: videos,
        icon: FiVideo,
      },
      {
        label: "Favorites",
        value: favorites,
        icon: FiStar,
      },
    ];
  
    return (
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
  
        {stats.map((stat) => {
          const Icon = stat.icon;
  
          return (
            <div
              key={stat.label}
              className="
                rounded-2xl
                border border-zinc-800
                bg-zinc-900
                p-4
              "
            >
              <div className="flex items-center justify-between">
  
                <div>
                  <p className="text-xs text-zinc-500">
                    {stat.label}
                  </p>
  
                  <p className="mt-1 text-2xl font-semibold">
                    {stat.value}
                  </p>
                </div>
  
                <div
                  className="
                    rounded-xl
                    bg-zinc-800
                    p-2.5
                    text-amber-400
                  "
                >
                  <Icon size={18} />
                </div>
  
              </div>
            </div>
          );
        })}
  
      </div>
    );
  };
  
  export default LibraryStats;