const NotesSidebar = () => {
    const mainItems = [
      {
        icon: "▦",
        label: "All Notes",
        count: 24,
      },
      {
        icon: "★",
        label: "Favorites",
        count: 5,
      },
      {
        icon: "◷",
        label: "Recent",
        count: 8,
      },
    ];
  
    const collections = [
      {
        icon: "💻",
        label: "Development",
      },
      {
        icon: "🧠",
        label: "DSA",
      },
      {
        icon: "🤖",
        label: "AI",
      },
      {
        icon: "💡",
        label: "Ideas",
      },
    ];
  
    return (
      <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
  
        <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
          Library
        </p>
  
        <div className="mt-3 space-y-1">
  
          {mainItems.map((item, index) => (
            <button
              key={item.label}
              className={`
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                px-3
                py-2.5
                text-sm
                transition
                ${
                  index === 0
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:bg-zinc-800/60 hover:text-white"
                }
              `}
            >
              <span className="flex items-center gap-3">
                <span>{item.icon}</span>
                {item.label}
              </span>
  
              <span className="text-xs text-zinc-600">
                {item.count}
              </span>
            </button>
          ))}
  
        </div>
  
        <div className="my-5 h-px bg-zinc-800" />
  
        <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
          Collections
        </p>
  
        <div className="mt-3 space-y-1">
  
          {collections.map((collection) => (
            <button
              key={collection.label}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-sm
                text-zinc-500
                transition
                hover:bg-zinc-800/60
                hover:text-white
              "
            >
              <span>
                {collection.icon}
              </span>
  
              {collection.label}
            </button>
          ))}
  
        </div>
  
      </aside>
    );
  };
  
  export default NotesSidebar;