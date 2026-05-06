import { Cherry } from "lucide-react";
import { Link } from "react-router";

export function OpenerPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-start justify-center px-6 md:px-12 lg:px-24">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/opener-background.mp4" type="video/mp4" />
        {/* Fallback Image */}
        <div className="absolute inset-0 bg-black" />
      </video>

      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content - Above video */}
      <div className="relative z-10">
        {/* Logo */}
        <div className="mb-12 md:mb-16">
          <h2
            className="text-2xl tracking-[0.3em] uppercase flex items-center gap-1"
            style={{ color: "#2A6087" }}
          >
            CHE
            <Cherry className="w-6 h-6" style={{ color: "#2A6087" }} />Y
          </h2>
        </div>

        {/* Dictionary Entry */}
        <div className="max-w-2xl">
          {/* Word */}
          <h1
            className="mb-6 italic text-[20px]"
            style={{
              color: "#2A6087",
              fontFamily: "Helvetica Neue, sans-serif",
            }}
          >
            to cherry-pick
          </h1>

          {/* Definition */}
          <div
            className="text-lg md:text-xl leading-relaxed"
            style={{ color: "#2A6087" }}
          >
            <span>verb</span> <span>[ I or T ]</span>
            <p
              className="mt-4 text-[18px]"
              style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
              to pick only the best people or things from a group, so that only
              people or things that are less good remain.
            </p>
          </div>
        </div>
      </div>

      {/* Arrow Link - Bottom Right */}
      <Link
        to="/welcome"
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 lg:bottom-16 lg:right-16 group z-10"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          className="transition-all duration-300"
        >
          <polyline
            points="10,10 25,20 10,30"
            className="fill-none stroke-[#2A6087] group-hover:stroke-white group-active:stroke-[#6F6F6F] stroke-[3] transition-colors duration-300"
            strokeLinejoin="miter"
          />
        </svg>
      </Link>
    </div>
  );
}
