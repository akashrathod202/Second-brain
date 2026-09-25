import {
    FaArrowRight,
    FaLink,
    FaNoteSticky,
    FaVideo,
  } from "react-icons/fa6";
  
  type RecentItem = {
    id: number;
    title: string;
    type: "Note" | "Link" | "Video";
    updated: string;
  };
  
  const recentItems: RecentItem[] = [
    {
      id: 1,
      title: "React Authentication with Google OAuth",
      type: "Note",
      updated: "Today",
    },
    {
      id: 2,
      title: "System Design Fundamentals",
      type: "Video",
      updated: "Yesterday",
    },
    {
      id: 3,
      title: "React Documentation",
      type: "Link",
      updated: "2 days ago",
    },
    {
      id: 4,
      title: "Node.js Backend Architecture",
      type: "Note",
      updated: "4 days ago",
    },
  ];
  
  const typeIcon = {
    Note: <FaNoteSticky />,
    Link: <FaLink />,
    Video: <FaVideo />,
  };
  
  const RecentItems = () => {
    return (
      <section className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/40
        p-5
      ">
  
        {/* Header */}
        <div className="flex items-center justify-between">
  
          <div>
            <h2 className="text-sm font-semibold text-white">
              Recent
            </h2>
  
            <p className="mt-1 text-xs text-zinc-600">
              Your latest knowledge
            </p>
          </div>
  
          <button
            type="button"
            className="
              flex
              items-center
              gap-2
              text-xs
              text-zinc-500
              transition-colors
              hover:text-white
            "
          >
            View all
  
            <FaArrowRight size={10} />
          </button>
  
        </div>
  
        {/* Items */}
        <div className="mt-5 divide-y divide-zinc-800/70">
  
          {recentItems.map((item) => (
            <div
              key={item.id}
              className="
                group
                flex
                items-center
                gap-4
                py-4
              "
            >
  
              {/* Type icon */}
              <div className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-zinc-800
                text-zinc-400
                transition-colors
                group-hover:text-amber-400
              ">
                {typeIcon[item.type]}
              </div>
  
              {/* Content */}
              <div className="min-w-0 flex-1">
  
                <h3 className="
                  truncate
                  text-sm
                  font-medium
                  text-zinc-300
                  transition-colors
                  group-hover:text-white
                ">
                  {item.title}
                </h3>
  
                <p className="mt-1 text-xs text-zinc-600">
                  {item.type}
                </p>
  
              </div>
  
              {/* Time */}
              <span className="
                hidden
                shrink-0
                text-xs
                text-zinc-600
                sm:block
              ">
                {item.updated}
              </span>
  
            </div>
          ))}
  
        </div>
      </section>
    );
  };
  
  export default RecentItems;