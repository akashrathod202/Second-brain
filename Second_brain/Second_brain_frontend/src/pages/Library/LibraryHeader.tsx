import { FiSearch, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


type Props = {
  search: string;
  onSearchChange: (value: string) => void;
};

function LibraryHeader  ({
  search,
  onSearchChange,
}: Props)  {

  const navigate=useNavigate()
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Library
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Your personal knowledge workspace.
        </p>
      </div>

      <div className="flex items-center gap-3">

        {/* Search */}
        <div
          className="
            flex items-center gap-2
            rounded-xl
            border border-zinc-800
            bg-zinc-900
            px-3 py-2.5
            focus-within:border-zinc-700
          "
        >
          <FiSearch
            size={17}
            className="text-zinc-500"
          />

          <input
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="Search library..."
            className="
              w-44
              bg-transparent
              text-sm text-white
              outline-none
              placeholder:text-zinc-600
              md:w-56
            "
          />
        </div>

        {/* Add */}
        <button
        onClick={
           ()=>{
            navigate( "/create")
           }
        }
          type="button"
          className="
            flex items-center gap-2
            rounded-xl
            bg-amber-400
            px-4 py-2.5
            text-sm font-medium
            text-black
            transition
            hover:bg-amber-300
            active:scale-95
          "
        >
          <FiPlus size={17} />
          Add New
        </button>

      </div>
    </div>
  );
};

export default LibraryHeader;