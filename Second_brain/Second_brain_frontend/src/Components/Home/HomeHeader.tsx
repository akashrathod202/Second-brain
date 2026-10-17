 
import { useEffect, useRef, useState } from "react";
import {
  FaArrowRight,
  FaCircle,
  FaGear,
  FaRightFromBracket,
  FaUser,
  FaXmark,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import  ThemeToggle from "../Home/ThemeToggle";

const HomeHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsProfileOpen(false);
    navigate("/");
  };

  const getInitial = () => user?.name?.charAt(0).toUpperCase() || "U";

  const navigateTo = (path: string) => {
    setIsProfileOpen(false);
    navigate(path);
  };

  return (
    <header className="w-full border-b border-zinc-200 pb-6 dark:border-white/10 sm:pb-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-sm font-medium text-amber-500 dark:text-amber-400">
            Your workspace
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Good morning, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-gray-400">
            Capture, organize and retrieve your knowledge.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <ThemeToggle />

          <div ref={profileRef} className="relative">
            {user && (
              <button
                type="button"
                aria-label="Open profile"
                aria-expanded={isProfileOpen}
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className={`group relative flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40 ${
                  isProfileOpen
                    ? "scale-105 border-amber-400/60 bg-amber-400/10"
                    : "border-zinc-200 bg-zinc-100 hover:scale-105 hover:border-amber-400/40 dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/10"
                }`}
              >
                <span
                  className={`absolute inset-0 rounded-full bg-amber-400/20 blur-md transition-opacity duration-300 ${
                    isProfileOpen
                      ? "animate-pulse opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 text-sm font-bold text-black shadow-lg shadow-amber-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {getInitial()}
                </span>

                <span className="absolute bottom-0 right-0 z-20 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-emerald-400 dark:border-[#18181B]" />
              </button>
            )}

            {isProfileOpen && user && (
              <div className="absolute right-0 top-16 z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/10 backdrop-blur-xl animate-[profileDropdown_0.2s_ease-out] dark:border-white/10 dark:bg-[#18181B]/95 dark:shadow-black/50">
                <div className="relative overflow-hidden px-5 pb-5 pt-6">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />

                  <div className="relative flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 text-xl font-bold text-black shadow-xl shadow-amber-500/20 ring-4 ring-amber-400/10 animate-[avatarFloat_3s_ease-in-out_infinite]">
                        {getInitial()}
                      </div>

                      <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-400 dark:border-[#18181B]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-zinc-900 dark:text-white">
                        {user.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-zinc-500 dark:text-gray-400">
                        {user.email}
                      </p>

                      <div className="mt-2 flex items-center gap-1.5">
                        <FaCircle
                          size={6}
                          className="text-emerald-400"
                        />
                        <span className="text-xs text-emerald-500 dark:text-emerald-400">
                          Online
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Close profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-all duration-200 hover:rotate-90 hover:bg-zinc-100 hover:text-zinc-900 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                      <FaXmark size={14} />
                    </button>
                  </div>
                </div>

                <div className="h-px bg-zinc-200 dark:bg-white/10" />

                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => navigateTo("/profile")}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 transition-all group-hover:bg-amber-400/10 group-hover:text-amber-500 dark:bg-white/[0.06] dark:text-gray-400 dark:group-hover:text-amber-400">
                      <FaUser size={14} />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-800 dark:text-gray-200">
                        Profile
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-gray-500">
                        View your profile
                      </p>
                    </div>

                    <FaArrowRight
                      size={12}
                      className="text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-600 dark:text-gray-600 dark:group-hover:text-gray-300"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo("/settings")}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 transition-all group-hover:bg-amber-400/10 group-hover:text-amber-500 dark:bg-white/[0.06] dark:text-gray-400 dark:group-hover:text-amber-400">
                      <FaGear
                        size={14}
                        className="transition-transform duration-500 group-hover:rotate-90"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-800 dark:text-gray-200">
                        Settings
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-gray-500">
                        Manage your preferences
                      </p>
                    </div>

                    <FaArrowRight
                      size={12}
                      className="text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-zinc-600 dark:text-gray-600 dark:group-hover:text-gray-300"
                    />
                  </button>
                </div>

                <div className="mx-3 h-px bg-zinc-200 dark:bg-white/10" />

                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 hover:bg-red-500/10"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition-all group-hover:bg-red-500/20 dark:text-red-400">
                      <FaRightFromBracket size={14} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-red-500 dark:text-red-400">
                        Logout
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-gray-600">
                        Sign out of your account
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
