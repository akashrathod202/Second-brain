const NotesHeader = () => {
    return (
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
  
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Notes
          </h1>
  
          <p className="mt-1 text-sm text-zinc-500">
            Capture ideas, knowledge and things worth remembering
          </p>
        </div>
  
        <div className="flex items-center gap-3">
  
          <div className="hidden items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 md:flex">
            <span className="text-zinc-500">
              ⌕
            </span>
  
            <input
              type="text"
              placeholder="Search notes..."
              className="
                w-48
                bg-transparent
                text-sm
                text-white
                outline-none
                placeholder:text-zinc-600
              "
            />
          </div>
  
          <button
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
            + New Note
          </button>
  
        </div>
  
      </div>
    );
  };
  
  export default NotesHeader;