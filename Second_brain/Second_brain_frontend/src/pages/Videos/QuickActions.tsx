
interface QuickActionsProps {
  onAddVideo: () => void;
  onRecentlyAdded: () => void;
  onCompleted: () => void;
}

const QuickActions = ({
  onAddVideo,
  onRecentlyAdded,
  onCompleted,
}: QuickActionsProps) => {
  const actions = [
    {
      icon: "+",
      title: "Add Video",
      description: "Save a new video",
      onClick: onAddVideo,
    },
    {
      icon: "★",
      title: "Favorites",
      description: "Coming soon",
      onClick: () => {},
    },
    {
      icon: "◷",
      title: "Recently Added",
      description: "Latest videos",
      onClick: onRecentlyAdded,
    },
    {
      icon: "✓",
      title: "Completed",
      description: "Coming soon",
      onClick: onCompleted,
    },
  ];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        Quick Actions
      </p>

      <div className="mt-4 space-y-2">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            onClick={action.onClick}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              p-3
              text-left
              transition
              hover:bg-zinc-800
            "
          >
            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-zinc-800
                text-sm
                text-amber-400
              "
            >
              {action.icon}
            </span>

            <div>
              <p className="text-sm font-medium">
                {action.title}
              </p>

              <p className="text-xs text-zinc-600">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
 
