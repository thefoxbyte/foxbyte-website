import type { ReactElement } from "react";

export function Arrow() {
  return (
    <svg className="arr" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check({ color = "#ee6c4d" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke={color} strokeOpacity=".35" />
      <path d="M6 10.2l2.6 2.6L14 7.4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export type FeatureIcon = "db" | "branch" | "shield" | "pulse" | "rewind" | "box" | "pipe" | "import";

const shapes: Record<FeatureIcon, ReactElement> = {
  db: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.8" />
      <path d="M5 5.5v13c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-13" />
      <path data-accent="" d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" />
    </>
  ),
  branch: (
    <>
      <circle cx="6" cy="5" r="2.2" />
      <circle cx="6" cy="19" r="2.2" />
      <circle data-accent="" cx="18" cy="8" r="2.2" />
      <path d="M6 7.2v9.6" />
      <path data-accent="" d="M18 10.2c0 4-6 3.5-11 7" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5.5c0 4.6-3 8-7 9.5-4-1.5-7-4.9-7-9.5V6z" />
      <path data-accent="" d="M8.8 12.2l2.2 2.2 4.4-4.6" />
    </>
  ),
  pulse: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path data-accent="" d="M6 12h3l2-4 3 8 2-4h2" />
    </>
  ),
  rewind: (
    <>
      <path d="M4 12a8 8 0 1 0 2.4-5.7" />
      <path d="M4 4v4h4" />
      <path data-accent="" d="M12 8v4l3 2" />
    </>
  ),
  box: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path data-accent="" d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </>
  ),
  pipe: (
    <>
      <rect x="3" y="4" width="6" height="5" rx="1.5" />
      <rect data-accent="" x="15" y="15" width="6" height="5" rx="1.5" />
      <path d="M9 6.5h3a2 2 0 0 1 2 2v7a2 2 0 0 0 2 2" />
    </>
  ),
  import: (
    <>
      <path data-accent="" d="M12 3v10M8 9l4 4 4-4" />
      <path d="M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3" />
    </>
  ),
};

export function Icon({ name, className }: { name: FeatureIcon; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="48%" height="48%" fill="none" aria-hidden="true">
      {shapes[name]}
    </svg>
  );
}
