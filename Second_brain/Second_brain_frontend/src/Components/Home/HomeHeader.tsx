import { useEffect, useRef, useState } from "react";
import {
  FaUser,
  FaXmark,
  FaGear,
  FaArrowRight,
  FaRightFromBracket,
  FaCircle,
} from "react-icons/fa6";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

const HomeHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  const getInitial = () => {
    if (!user?.name) return "U";

    return user.name.charAt(0).toUpperCase();
  };

  return (
    <header className="w-full border-b border-white/10 pb-8">
      <div className="flex items-start justify-between gap-6">

        {/* ================= LEFT SIDE ================= */}

        <div>
          <p className="mb-2 text-sm font-medium text-amber-400">
            Your workspace
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
  Good morning, {user?.name?.split(" ")[0] || "there"} 👋
</h1>

          <p className="mt-2 text-sm text-gray-400">
            Capture, organize and retrieve your knowledge.
          </p>
        </div>


        {/* ================= RIGHT SIDE ================= */}

        <div
          ref={profileRef}
          className="relative flex items-center gap-3"
        >

          {/* ================= PROFILE BUTTON ================= */}

          {user && (
            <button
              type="button"
              aria-label="Open profile"
              aria-expanded={isProfileOpen}
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className={`
                group relative flex h-12 w-12 items-center justify-center
                rounded-full
                border
                transition-all duration-300
                focus:outline-none
                focus:ring-2
                focus:ring-amber-400/40
                ${
                  isProfileOpen
                    ? "border-amber-400/60 bg-amber-400/10 scale-105"
                    : "border-white/10 bg-white/[0.06] hover:border-amber-400/40 hover:bg-white/10 hover:scale-105"
                }
              `}
            >

              {/* Animated Glow */}

              <span
                className={`
                  absolute inset-0 rounded-full
                  bg-amber-400/20
                  blur-md
                  transition-opacity duration-300
                  ${
                    isProfileOpen
                      ? "opacity-100 animate-pulse"
                      : "opacity-0 group-hover:opacity-100"
                  }
                `}
              />

              {/* Avatar */}

              <span
                className="
                  relative z-10
                  flex h-10 w-10
                  items-center justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-amber-300
                  via-amber-400
                  to-orange-500
                  text-sm
                  font-bold
                  text-black
                  shadow-lg
                  shadow-amber-500/20
                  transition-transform
                  duration-300
                  group-hover:rotate-3
                  group-hover:scale-110
                "
              >
                {getInitial()}
              </span>

              {/* Online indicator */}

              <span
                className="
                  absolute
                  bottom-0
                  right-0
                  z-20
                  flex
                  h-3.5
                  w-3.5
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-[#18181B]
                  bg-emerald-400
                "
              />
            </button>
          )}


          {/* ================= PROFILE DROPDOWN ================= */}

          {isProfileOpen && user && (
            <div
              className="
                absolute
                right-0
                top-16
                z-50
                w-80
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#18181B]/95
                shadow-2xl
                shadow-black/50
                backdrop-blur-xl

                animate-[profileDropdown_0.2s_ease-out]
              "
            >

              {/* ================= PROFILE TOP ================= */}

              <div
                className="
                  relative
                  overflow-hidden
                  px-5
                  pb-5
                  pt-6
                "
              >

                {/* Background glow */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-32
                    w-32
                    rounded-full
                    bg-amber-400/10
                    blur-3xl
                  "
                />

                <div className="relative flex items-center gap-4">

                  {/* Large Avatar */}

                  <div className="relative">

                    <div
                      className="
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-full
                        bg-gradient-to-br
                        from-amber-300
                        via-amber-400
                        to-orange-500
                        text-xl
                        font-bold
                        text-black
                        shadow-xl
                        shadow-amber-500/20
                        ring-4
                        ring-amber-400/10
                        animate-[avatarFloat_3s_ease-in-out_infinite]
                      "
                    >
                      {getInitial()}
                    </div>

                    {/* Online */}

                    <span
                      className="
                        absolute
                        bottom-0
                        right-0
                        h-4
                        w-4
                        rounded-full
                        border-[3px]
                        border-[#18181B]
                        bg-emerald-400
                      "
                    />
                  </div>


                  {/* User information */}

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-base font-semibold text-white">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-400">
                      {user.email}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5">

                      <FaCircle
                        size={6}
                        className="text-emerald-400"
                      />

                      <span className="text-xs text-emerald-400">
                        Online
                      </span>

                    </div>

                  </div>


                  {/* Close */}

                  <button
                    type="button"
                    aria-label="Close profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      text-gray-500
                      transition-all
                      duration-200
                      hover:bg-white/10
                      hover:text-white
                      hover:rotate-90
                    "
                  >
                    <FaXmark size={14} />
                  </button>

                </div>

              </div>


              {/* Divider */}

              <div className="h-px bg-white/10" />


              {/* ================= MENU ================= */}

              <div className="p-2">

                {/* Profile */}

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/profile");
                  }}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-left
                    transition-all
                    duration-200
                    hover:bg-white/[0.06]
                  "
                >

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-white/[0.06]
                      text-gray-400
                      transition-all
                      group-hover:bg-amber-400/10
                      group-hover:text-amber-400
                    "
                  >
                    <FaUser size={14} />
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-medium text-gray-200">
                      Profile
                    </p>

                    <p className="text-xs text-gray-500">
                      View your profile
                    </p>

                  </div>

                  <FaArrowRight
                    size={12}
                    className="
                      text-gray-600
                      transition-transform
                      group-hover:translate-x-1
                      group-hover:text-gray-300
                    "
                  />

                </button>


                {/* Settings */}

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/settings");
                  }}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-left
                    transition-all
                    duration-200
                    hover:bg-white/[0.06]
                  "
                >

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-white/[0.06]
                      text-gray-400
                      transition-all
                      group-hover:bg-amber-400/10
                      group-hover:text-amber-400
                    "
                  >
                    <FaGear
                      size={14}
                      className="
                        transition-transform
                        duration-500
                        group-hover:rotate-90
                      "
                    />
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-medium text-gray-200">
                      Settings
                    </p>

                    <p className="text-xs text-gray-500">
                      Manage your preferences
                    </p>

                  </div>

                  <FaArrowRight
                    size={12}
                    className="
                      text-gray-600
                      transition-transform
                      group-hover:translate-x-1
                      group-hover:text-gray-300
                    "
                  />

                </button>

              </div>


              {/* Divider */}

              <div className="mx-3 h-px bg-white/10" />


              {/* ================= LOGOUT ================= */}

              <div className="p-2">

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-left
                    transition-all
                    duration-200
                    hover:bg-red-500/10
                  "
                >

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-red-500/10
                      text-red-400
                      transition-all
                      group-hover:bg-red-500/20
                    "
                  >
                    <FaRightFromBracket size={14} />
                  </div>

                  <div>

                    <p className="text-sm font-medium text-red-400">
                      Logout
                    </p>

                    <p className="text-xs text-gray-600">
                      Sign out of your account
                    </p>

                  </div>

                </button>

              </div>

            </div>
          )}

        </div>

      </div>
    </header>
  );
};

export default HomeHeader;