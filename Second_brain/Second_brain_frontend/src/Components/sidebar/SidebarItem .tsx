import { NavLink } from "react-router-dom";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
};

const SidebarItem = ({
  icon,
  label,
  to,
}: SidebarItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        group
        relative
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        text-sm
        font-medium
        transition-all
        duration-200
        ${
          isActive
            ? "bg-amber-400/10 text-white"
            : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
        }
        `
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator */}
          {isActive && (
            <span className="absolute left-0 h-5 w-0.5 rounded-full bg-amber-400" />
          )}

          {/* Icon */}
          <span
            className={`
              flex
              w-5
              items-center
              justify-center
              transition-colors
              ${
                isActive
                  ? "text-amber-400"
                  : "text-zinc-500 group-hover:text-zinc-300"
              }
            `}
          >
            {icon}
          </span>

          {/* Label */}
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;