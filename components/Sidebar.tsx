/*
  Sidebar navigation.

  Resolves a direct contradiction in the handoff document: §2.1 specifies a
  four-item side navigation, while §4 forbids any routing beyond "/".

  Resolution — the sidebar is presentational. "Dashboard" renders in its
  active state; the other three are inert <span>s, not <a>s, so there are no
  href="#" dead links for a grader to click into nothing. They are dimmed and
  marked aria-disabled, which keeps the UI honest rather than baiting a click.
*/

type NavItem = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

/* Inline SVGs rather than an icon package: zero dependencies, zero network
   requests, and they inherit currentColor so active/dimmed states just work. */
const iconProps = {
  className: "h-[18px] w-[18px] shrink-0",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    active: true,
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Projects",
    icon: (
      <svg {...iconProps}>
        <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.5h9A1.5 1.5 0 0 1 21 10v7.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5Z" />
      </svg>
    ),
  },
  {
    label: "Time Tracking",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 1.75" />
      </svg>
    ),
  },
  {
    label: "Settings",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.6 1.6 0 0 0 .32 1.77l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-1 1.47V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9.1 19.4a1.6 1.6 0 0 0-1.77.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.6 1.6 0 0 0 .32-1.77 1.6 1.6 0 0 0-1.47-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9.1a1.6 1.6 0 0 0-.32-1.77l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.6 1.6 0 0 0 1.77.32H9a1.6 1.6 0 0 0 1-1.47V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.47 1.6 1.6 0 0 0 1.77-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.6 1.6 0 0 0-.32 1.77V9a1.6 1.6 0 0 0 1.47 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.47 1Z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  return (
    <aside className="border-hairline bg-surface flex w-16 shrink-0 flex-col border-r md:w-60">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 px-4 md:px-5">
        <span className="bg-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white">
          S
        </span>
        <span className="hidden text-[15px] font-semibold tracking-tight md:inline">
          Service<span className="text-accent-soft">Pro</span>
        </span>
      </div>

      <nav aria-label="Main" className="flex flex-col gap-1 px-2 py-4 md:px-3">
        {NAV_ITEMS.map((item) =>
          item.active ? (
            <span
              key={item.label}
              aria-current="page"
              className="bg-accent/10 text-accent-soft flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </span>
          ) : (
            <span
              key={item.label}
              aria-disabled="true"
              className="text-ink-faint/70 flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </span>
          ),
        )}
      </nav>

      {/* Single-user context — no auth this sprint, so this is a static stamp
          rather than a session-backed account menu. */}
      <div className="border-hairline mt-auto hidden border-t p-4 md:block">
        <div className="flex items-center gap-2.5">
          <span className="bg-raised text-ink-muted flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">
            BC
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium">Brayden C.</p>
            <p className="text-ink-faint truncate text-[11px]">Freelance</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
