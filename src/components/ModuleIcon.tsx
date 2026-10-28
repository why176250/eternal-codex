export function ModuleIcon({ id, className = "" }: { id: string; className?: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (id) {
    case "start":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="m15 9-2.2 5.8L7 17l2.2-5.8L15 9Z" />
        </svg>
      );
    case "talents":
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="2.2" />
          <circle cx="6" cy="18" r="2.2" />
          <circle cx="18" cy="18" r="2.2" />
          <path d="M12 7.2v4.3M10.2 12.4 7.4 16M13.8 12.4l2.8 3.6M12 11.5v0" />
        </svg>
      );
    case "gear":
      return (
        <svg {...common}>
          <path d="M12 3 20 6v6c0 4.4-3.4 7.6-8 9-4.6-1.4-8-4.6-8-9V6l8-3Z" />
          <path d="m9 11 2 2 4-4" />
        </svg>
      );
    case "classes":
      return (
        <svg {...common}>
          <circle cx="8.5" cy="8" r="2.2" />
          <circle cx="15.5" cy="8" r="2.2" />
          <path d="M4.5 19c0-3 1.8-5 4-5s4 2 4 5M11.5 19c0-3 1.8-5 4-5s4 2 4 5" />
        </svg>
      );
    case "dungeons":
      return (
        <svg {...common}>
          <path d="M4 20V9.5C4 6.5 7.6 4 12 4s8 2.5 8 5.5V20" />
          <path d="M9 20v-5a3 3 0 0 1 6 0v5" />
          <path d="M4 20h16" />
        </svg>
      );
    case "professions":
      return (
        <svg {...common}>
          <path d="m14 6 4 4-7.5 7.5-4-4L14 6Z" />
          <path d="m4 20 3.5-3.5M15 3l2 2M18 6l2 2" />
        </svg>
      );
    case "xp":
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h16" />
          <path d="m7 15 4-4 3 3 5-6" />
          <path d="M19 8h-4M19 8v4" />
        </svg>
      );
    case "addons":
      return (
        <svg {...common}>
          <path d="M9 3v4M15 3v4M7 7h10v5a5 5 0 0 1-10 0V7Z" />
          <path d="M12 17v4" />
        </svg>
      );
    default:
      return null;
  }
}
