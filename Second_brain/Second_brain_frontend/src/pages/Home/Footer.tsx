
import { Link } from "react-router-dom";
import {
  FaBrain,
  FaArrowUp,
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const productLinks = [
  { label: "Home", to: "/home" },
  { label: "Create", to: "/create" },
  { label: "Library", to: "/library" },
  { label: "Notes", to: "/notes" },
  { label: "Links", to: "/links" },
  { label: "Videos", to: "/videos" },
  { label: "Ask SecondBrain", to: "/ask" },
];

const resourceLinks = [
  { label: "Help & Support", to: "/support" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-20 border-t border-zinc-200/80 bg-zinc-50 text-zinc-900 dark:border-white/[0.08] dark:bg-[#0B0B0D] dark:text-zinc-100">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              to="/home"
              className="group inline-flex items-center gap-3"
              aria-label="SecondBrain home"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/[0.08] text-amber-500 transition group-hover:bg-amber-400/[0.14]">
                <FaBrain size={22} />
              </span>

              <span className="text-2xl font-bold tracking-tight">
                Second<span className="text-amber-500">Brain</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Capture, organize and retrieve your knowledge.
              Turn what you learn into something you can use.
            </p>

            {/* Social links — add your real profile URLs */}
            <div className="mt-6 flex items-center gap-3">
              {[
                {
                  label: "GitHub",
                  href: "https://github.com/",
                  icon: FaGithub,
                },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/",
                  icon: FaLinkedinIn,
                },
                {
                  label: "X",
                  href: "https://x.com/",
                  icon: FaXTwitter,
                },
                {
                  label: "YouTube",
                  href: "https://www.youtube.com/",
                  icon: FaYoutube,
                },
              ].map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
              Product
            </h3>

            <ul className="mt-5 space-y-3">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-zinc-600 transition hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
              Resources
            </h3>

            <ul className="mt-5 space-y-3">
              {resourceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-zinc-600 transition hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand message */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/[0.09] dark:bg-white/[0.025]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-500">
                <FaBrain size={19} />
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                Make knowledge useful.
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Save the ideas that matter. Find them when you need them.
              </p>

              <Link
                to="/create"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 transition hover:gap-3 dark:text-amber-400"
              >
                Capture an idea
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-zinc-200 pt-6 dark:border-white/[0.08] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            © {currentYear} SecondBrain. All rights reserved.
          </p>

          <button
            type="button"
            onClick={backToTop}
            className="group inline-flex w-fit items-center gap-2 text-sm text-zinc-600 transition hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400"
          >
            Back to top
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 transition group-hover:border-amber-400/50 group-hover:bg-amber-400/10 dark:border-white/10">
              <FaArrowUp size={12} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
