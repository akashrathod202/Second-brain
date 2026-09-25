const filters = [
    "All",
    "Favorites",
    "Development",
    "Learning",
    "Ideas",
  ];
  
  const NotesToolbar = () => {
    return (
      <div className="mb-6">
  
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-600">
              Your Knowledge
            </p>
  
            <h2 className="mt-1 text-xl font-semibold">
              All Notes
            </h2>
          </div>
  
          <button className="w-fit rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400 transition hover:text-white">
            Sort: Recently Updated ▾
          </button>
  
        </div>
  
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
  
          {filters.map((filter, index) => (
            <button
              key={filter}
              className={`
                whitespace-nowrap
                rounded-lg
                border
                px-3
                py-1.5
                text-xs
                transition
                ${
                  index === 0
                    ? "border-amber-400/30 bg-amber-400 text-black"
                    : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-white"
                }
              `}
            >
              {filter}
            </button>
          ))}
  
        </div>
  
      </div>
    );
  };
  
  export default NotesToolbar;