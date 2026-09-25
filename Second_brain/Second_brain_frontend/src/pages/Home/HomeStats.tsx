import {
    FaBookOpen,
    FaLink,
    FaNoteSticky,
    FaVideo,
  } from "react-icons/fa6";
  
  const stats = [
    {
      label: "Total Items",
      value: 24,
      icon: <FaBookOpen />,
      iconClass: "bg-amber-400/10 text-amber-400",
    },
    {
      label: "Notes",
      value: 8,
      icon: <FaNoteSticky />,
      iconClass: "bg-purple-400/10 text-purple-400",
    },
    {
      label: "Links",
      value: 7,
      icon: <FaLink />,
      iconClass: "bg-blue-400/10 text-blue-400",
    },
    {
      label: "Videos",
      value: 5,
      icon: <FaVideo />,
      iconClass: "bg-emerald-400/10 text-emerald-400",
    },
  ];
  
  const HomeStats = () => {
    return (
      <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
  
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="
              group
              rounded-xl
              border
              border-zinc-800
              bg-zinc-900/40
              p-4
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-zinc-700
              hover:bg-zinc-900
            "
          >
  
            <div className="flex items-center gap-3">
  
              <div
                className={`
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  ${stat.iconClass}
                  transition-transform
                  duration-200
                  group-hover:scale-105
                `}
              >
                {stat.icon}
              </div>
  
              <div>
                <p className="text-[11px] text-zinc-600">
                  {stat.label}
                </p>
  
                <p className="mt-0.5 text-xl font-semibold">
                  {stat.value}
                </p>
              </div>
  
            </div>
  
          </div>
        ))}
  
      </section>
    );
  };
  
  export default HomeStats;