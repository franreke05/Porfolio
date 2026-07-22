type TabletShellProps = {
  className?: string;
};

/** Landscape companion to PhoneShell for interactive product explainers. */
export function TabletShell({ className }: TabletShellProps) {
  return (
    <svg
      viewBox="0 0 960 650"
      className={className}
      role="presentation"
      focusable="false"
      aria-hidden="true"
    >
      <rect x="8" y="8" width="944" height="634" rx="44" fill="#17130f" />
      <rect x="8" y="8" width="944" height="634" rx="44" fill="none" stroke="var(--primary)" strokeWidth="2.5" />
      <rect x="20" y="20" width="920" height="610" rx="34" fill="none" stroke="var(--background)" strokeOpacity="0.08" />
      <rect x="54" y="60" width="852" height="512" rx="23" fill="var(--background)" />
      <circle cx="480" cy="34" r="5" fill="#090705" />
      <circle cx="480" cy="34" r="1.5" fill="var(--primary)" opacity="0.72" />
      <rect x="362" y="604" width="236" height="5" rx="2.5" fill="var(--background)" opacity="0.24" />
      <rect x="1" y="184" width="4" height="84" rx="2" style={{ fill: "var(--primary)", fillOpacity: 0.45 }} />
      <rect x="1" y="282" width="4" height="54" rx="2" style={{ fill: "var(--primary)", fillOpacity: 0.45 }} />
      <rect x="955" y="226" width="4" height="104" rx="2" style={{ fill: "var(--background)", fillOpacity: 0.28 }} />
    </svg>
  );
}
