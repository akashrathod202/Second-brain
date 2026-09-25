import { useState } from "react";

import {
  FaHouse,
  FaBookOpen,
  FaNoteSticky,
  FaLink,
  FaYoutube,
  FaFilePdf,
  FaPlus,
  FaCode,
  FaStar,
  FaClock,
  FaGear,
  FaXmark,
} from "react-icons/fa6";

import { useNavigate } from "react-router-dom";

import SidebarItem from "./SidebarItem ";
import SidebarSection from "./SidebarSection";

function Sidebar() {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <aside
        className="
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[250px]
          flex-col
          border-r
          border-zinc-800/70
          bg-zinc-950
          px-3
          py-4
          text-white
        "
      >
        {/* ========================================= */}
        {/* BRAND */}
        {/* ========================================= */}

        <button
          type="button"
          onClick={() => navigate("/home")}
          className="
            group
            flex
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-left
            transition-all
            duration-200
            hover:bg-zinc-900
          "
        >
          <div
            className="
              relative
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-amber-400
              text-lg
              shadow-[0_0_20px_rgba(251,191,36,0.12)]
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:rotate-3
              group-hover:shadow-[0_0_25px_rgba(251,191,36,0.22)]
            "
          >
            🧠
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold tracking-tight">
              Second<span className="text-amber-400">Brain</span>
            </h1>

            <p className="truncate text-[11px] text-zinc-600 transition-colors group-hover:text-zinc-500">
              AI Knowledge Workspace
            </p>
          </div>

          <span
            className="
              ml-auto
              text-xs
              text-zinc-700
              transition-all
              duration-200
              group-hover:translate-x-0.5
              group-hover:text-zinc-400
            "
          >
            ˅
          </span>
        </button>

        <div className="my-3 h-px bg-zinc-800/70" />

        {/* ========================================= */}
        {/* ADD NEW */}
        {/* ========================================= */}

        <button
          type="button"
          onClick={() => navigate("/create")}
          className="
            group
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            border
            border-amber-400/20
            bg-amber-400/10
            px-3
            py-2.5
            text-left
            transition-all
            duration-200
            hover:border-amber-400/40
            hover:bg-amber-400/15
            active:scale-[0.98]
          "
        >
          <span
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              bg-amber-400
              text-black
              shadow-sm
              transition-transform
              duration-200
              group-hover:scale-105
            "
          >
            <FaPlus size={11} />
          </span>

          <div className="flex-1">
            <p className="text-sm font-medium text-amber-100">
              Add New
            </p>

            <p className="text-[10px] text-amber-400/50">
              Save knowledge
            </p>
          </div>

          <span className="text-xs text-amber-400/50 transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </button>

        {/* ========================================= */}
        {/* SCROLLABLE CONTENT */}
        {/* ========================================= */}

        <div
          className="
            mt-4
            flex-1
            overflow-y-auto
            pr-1
            scrollbar-thin
            scrollbar-track-transparent
            scrollbar-thumb-zinc-800
            hover:scrollbar-thumb-zinc-700
          "
        >
          <SidebarSection title="Workspace">
            <SidebarItem
              to="/home"
              label="Home"
              icon={
                <span className="text-sky-400">
                  <FaHouse size={15} />
                </span>
              }
            />

            <SidebarItem
              to="/library"
              label="Library"
              icon={
                <span className="text-violet-400">
                  <FaBookOpen size={15} />
                </span>
              }
            />

            <SidebarItem
              to="/notes"
              label="Notes"
              icon={
                <span className="text-yellow-400">
                  <FaNoteSticky size={15} />
                </span>
              }
            />

            <SidebarItem
              to="/links"
              label="Links"
              icon={
                <span className="text-blue-400">
                  <FaLink size={15} />
                </span>
              }
            />

            <SidebarItem
              to="/videos"
              label="Videos"
              icon={
                <span className="text-red-400">
                  <FaYoutube size={15} />
                </span>
              }
            />

            <SidebarItem
              to="/Code"
              label="Code"
              icon={
                <span className="text-emerald-400">
                  <FaCode size={15} />
                </span>
              }
            />

            <SidebarItem
              to="/pdf"
              label="PDF"
              icon={
                <span className="text-orange-400">
                  <FaFilePdf size={15} />
                </span>
              }
            />
          </SidebarSection>

          <div className="mt-7 border-t border-zinc-800/70 pt-4">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-700">
              Quick Access
            </p>

            <SidebarItem
              to="/favorites"
              label="Favorites"
              icon={
                <span className="text-amber-400">
                  <FaStar size={15} />
                </span>
              }
            />

            <SidebarItem
              to="/recent"
              label="Recently Added"
              icon={
                <span className="text-cyan-400">
                  <FaClock size={15} />
                </span>
              }
            />
          </div>
        </div>

        {/* ========================================= */}
        {/* FOOTER */}
        {/* ========================================= */}

        <div className="border-t border-zinc-800/70 pt-3">

          {/* SETTINGS */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="
              group
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-3
              py-2
              text-left
              transition-all
              duration-200
              hover:bg-zinc-900
            "
          >
            <span
              className="
                text-zinc-400
                transition-all
                duration-300
                group-hover:rotate-45
                group-hover:text-amber-400
              "
            >
              <FaGear size={15} />
            </span>

            <span className="text-sm text-zinc-400 transition-colors group-hover:text-zinc-200">
              Settings
            </span>
          </button>

          {/* Small status */}
          <div className="mt-3 flex items-center gap-2 px-3 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[10px] text-zinc-600">
              SecondBrain is ready
            </span>
          </div>
        </div>
      </aside>

      {/* ========================================= */}
      {/* SETTINGS MODAL */}
      {/* ========================================= */}

      {isSettingsOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/60
            px-4
            backdrop-blur-sm
            animate-in
            fade-in
            duration-200
          "
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              relative
              w-full
              max-w-sm
              overflow-hidden
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-950
              p-7
              text-center
              shadow-2xl
              shadow-black/50
              animate-in
              zoom-in-95
              slide-in-from-bottom-2
              duration-300
            "
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="
                absolute
                right-4
                top-4
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-zinc-600
                transition-all
                hover:bg-zinc-900
                hover:text-zinc-300
              "
            >
              <FaXmark size={14} />
            </button>

            {/* Animated Icon */}
            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
              <div
                className="
                  absolute
                  inset-0
                  rounded-2xl
                  bg-amber-400/10
                  animate-pulse
                "
              />

              <div
                className="
                  relative
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-amber-400/20
                  bg-amber-400/10
                  text-amber-400
                  shadow-[0_0_30px_rgba(251,191,36,0.08)]
                  animate-[spin_6s_linear_infinite]
                "
              >
                <FaGear size={22} />
              </div>
            </div>

            {/* Animated text */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-zinc-100">
                Settings are{" "}
                <span className="text-amber-400">
                  in progress
                </span>
                <span className="inline-block animate-pulse">
                  ...
                </span>
              </h2>

              <p className="mx-auto max-w-xs text-sm leading-6 text-zinc-500">
                We're building a clean and powerful settings
                experience for your SecondBrain workspace.
              </p>
            </div>

            {/* Progress */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-[10px] text-zinc-600">
                <span>Coming soon</span>
                <span className="text-amber-400/70">
                  Building
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900">
                <div
                  className="
                    h-full
                    w-[45%]
                    rounded-full
                    bg-amber-400
                    shadow-[0_0_12px_rgba(251,191,36,0.35)]
                    animate-[pulse_2s_ease-in-out_infinite]
                  "
                />
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="
                mt-7
                w-full
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
                px-4
                py-2.5
                text-sm
                font-medium
                text-zinc-300
                transition-all
                duration-200
                hover:border-zinc-700
                hover:bg-zinc-800
                hover:text-white
                active:scale-[0.98]
              "
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;