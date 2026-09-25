import {
    FaArrowRight,
    FaLink,
    FaNoteSticky,
    FaVideo,
  } from "react-icons/fa6";
  
  type Action = {
    label: string;
    icon: React.ReactNode;
  };
  
  const actions: Action[] = [
    {
      label: "New Note",
      icon: <FaNoteSticky />,
    },
    {
      label: "Save Link",
      icon: <FaLink />,
    },
    {
      label: "Add Video",
      icon: <FaVideo />,
    },
  ];
  
  const QuickActions = () => {
    return (
      <section className="
        h-fit
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/40
        p-5
      ">
  
        <div>
          <h2 className="text-sm font-semibold text-white">
            Quick Actions
          </h2>
  
          <p className="mt-1 text-xs text-zinc-600">
            Add something to your brain
          </p>
        </div>
  
        <div className="mt-5 space-y-2">
  
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className="
                group
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                border
                border-zinc-800
                bg-zinc-950/50
                px-4
                py-3
                text-left
                transition-all
                hover:border-zinc-700
                hover:bg-zinc-900
              "
            >
              <span className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-zinc-800
                text-zinc-400
                transition-colors
                group-hover:bg-amber-400/10
                group-hover:text-amber-400
              ">
                {action.icon}
              </span>
  
              <span className="
                flex-1
                text-sm
                font-medium
                text-zinc-400
                group-hover:text-white
              ">
                {action.label}
              </span>
  
              <FaArrowRight
                size={11}
                className="
                  text-zinc-700
                  transition-all
                  group-hover:translate-x-0.5
                  group-hover:text-zinc-400
                "
              />
            </button>
          ))}
  
        </div>
      </section>
    );
  };
  
  export default QuickActions;