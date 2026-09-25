import { Hbutton } from "./Hbutton";
import { FaShareNodes, FaPlus } from "react-icons/fa6";

function Mainnav() {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      
      <div>
        <h1 className="text-2xl font-bold">
          All Notes
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Hbutton
          name="Share Brain"
          icon={FaShareNodes}
        />

        <Hbutton
          name="Add Content"
          icon={FaPlus}
        />
      </div>

    </div>
  );
}

export default Mainnav;