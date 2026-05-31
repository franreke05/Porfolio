"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/lib/site-data";

type ProjectVisualProps = {
  project: Project;
};

const visualTone: Record<Project["image"], string> = {
  mobile:       "from-[#C39356]/22 via-[#121820] to-[#080B0F]",
  dashboard:    "from-[#65D6DA]/18 via-[#121820] to-[#080B0F]",
  browser:      "from-[#F3E8D7]/14 via-[#121820] to-[#080B0F]",
  subscription: "from-[#8F6A3D]/24 via-[#121820] to-[#080B0F]",
};

export function ProjectVisual({ project }: ProjectVisualProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`relative h-80 overflow-hidden rounded-md border border-[color:var(--outline)] bg-gradient-to-br ${visualTone[project.image]}`}
      aria-label={`Vista visual del caso ${project.title}`}
    >
      {/* Radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(195,147,86,0.2),transparent_30%),radial-gradient(circle_at_18%_82%,rgba(101,214,218,0.15),transparent_32%)]" />

      {/* Shimmer sweep */}
      <motion.div
        className="pointer-events-none absolute -left-24 top-10 h-36 w-[170%] rotate-[-11deg] bg-[linear-gradient(90deg,transparent,rgba(243,232,215,0.2),rgba(195,147,86,0.07),transparent)]"
        animate={reduceMotion ? undefined : { x: ["-22%", "22%", "-22%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* Scan line */}
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 z-10 h-px bg-[linear-gradient(90deg,transparent_8%,rgba(82,208,220,0.65)_50%,transparent_92%)]"
          animate={{ top: ["-1px", "calc(100% + 1px)"] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.8, ease: "linear" }}
          aria-hidden="true"
        />
      )}

      {/* Viewfinder corner brackets */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <span className="absolute left-3 top-3 block h-5 w-5 border-l-[2px] border-t-[2px] border-[color:var(--primary)] opacity-55 transition-all duration-500 group-hover/project:h-6 group-hover/project:w-6 group-hover/project:opacity-100" />
        <span className="absolute right-3 top-3 block h-5 w-5 border-r-[2px] border-t-[2px] border-[color:var(--primary)] opacity-55 transition-all duration-500 group-hover/project:h-6 group-hover/project:w-6 group-hover/project:opacity-100" />
        <span className="absolute bottom-3 left-3 block h-5 w-5 border-b-[2px] border-l-[2px] border-[color:var(--accent-cyan)] opacity-40 transition-all duration-500 group-hover/project:h-6 group-hover/project:w-6 group-hover/project:opacity-85" />
        <span className="absolute bottom-3 right-3 block h-5 w-5 border-b-[2px] border-r-[2px] border-[color:var(--accent-cyan)] opacity-40 transition-all duration-500 group-hover/project:h-6 group-hover/project:w-6 group-hover/project:opacity-85" />
      </div>

      {/* Status tags */}
      <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
        <span className="rounded-md border border-[color:var(--primary)]/35 bg-[color:var(--background)]/80 px-2.5 py-1 text-xs font-semibold text-[color:var(--primary)] backdrop-blur">
          {project.status === "real-lab" && "Laboratorio real"}
          {project.status === "own-system" && "Sistema propio"}
          {project.status === "documented-case" && "Caso documentado"}
          {project.status === "anonymous-project" && "Anonimizado"}
          {project.status === "technical-demo" && "Demo técnica"}
        </span>
        <span className="rounded-md border border-[color:var(--outline)] bg-[color:var(--background)]/72 px-2.5 py-1 text-xs text-[color:var(--surface-foreground)] backdrop-blur">
          {project.metrics[0]}
        </span>
      </div>

      {/* Mockup — floats gently */}
      <motion.div
        className="absolute inset-x-4 bottom-4 top-14"
        animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {project.image === "mobile"       && <MobileMockup project={project} />}
        {project.image === "dashboard"    && <DashboardMockup />}
        {project.image === "browser"      && <BrowserMockup />}
        {project.image === "subscription" && <SubscriptionMockup />}
      </motion.div>
    </div>
  );
}

/* ── Mockups ──────────────────────────────── */

function MobileMockup({ project }: { project: Project }) {
  const isOposi = project.id.includes("oposicontrol");

  return (
    <div className="mx-auto flex h-full max-w-[15rem] items-end justify-center">
      <div className="relative h-full w-[12.5rem] overflow-hidden rounded-[1.55rem] border border-[color:var(--foreground)]/18 bg-[#05070A] p-2 shadow-2xl shadow-black/40 transition duration-500 group-hover/project:-translate-y-2">
        <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-[color:var(--foreground)]/18" />
        <div className="h-full overflow-hidden rounded-[1.2rem] border border-[color:var(--outline)] bg-[linear-gradient(180deg,rgba(18,24,32,0.98),rgba(8,11,15,0.98))] p-3">
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="h-2 w-14 rounded-sm bg-[color:var(--primary)]" />
              <div className="mt-2 h-2 w-20 rounded-sm bg-[color:var(--foreground)]/65" />
            </div>
            <div className="grid h-8 w-8 place-items-center rounded-lg border border-[color:var(--outline)] bg-[rgba(195,147,86,0.12)] text-xs font-bold text-[color:var(--primary)]">
              {isOposi ? "OC" : "ED"}
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-[color:var(--primary)]/30 bg-[rgba(195,147,86,0.1)] p-3">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <div className="h-2 w-16 rounded-sm bg-[color:var(--foreground)]/70" />
                <div className="mt-2 h-2 w-12 rounded-sm bg-[color:var(--muted)]/45" />
              </div>
              <div className="text-right font-mono text-xl font-semibold text-[color:var(--primary)]">
                {isOposi ? "74%" : "8.6"}
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[color:var(--background)]">
              <div className="h-full w-[72%] rounded-full bg-[color:var(--primary)] transition-all duration-500 group-hover/project:w-[86%]" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {["Plan", "Stats", isOposi ? "Test" : "Notas", "Avisos"].map((item) => (
              <div key={item} className="rounded-md border border-[color:var(--outline)] bg-[color:var(--surface)]/72 p-2">
                <div className="mb-2 h-5 w-5 rounded-md bg-[rgba(101,214,218,0.12)]" />
                <div className="h-2 w-10 rounded-sm bg-[color:var(--surface-foreground)]/60" />
                <div className="mt-2 h-1.5 w-8 rounded-sm bg-[color:var(--muted)]/35" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="h-full overflow-hidden rounded-lg border border-[color:var(--outline)] bg-[color:var(--background)] p-3 shadow-xl shadow-black/30 transition duration-500 group-hover/project:-translate-y-2">
      <div className="grid h-full grid-cols-[3rem_1fr] gap-3">
        <aside className="rounded-md border border-[color:var(--outline)] bg-[color:var(--surface)]/72 p-2">
          <div className="mb-4 h-7 w-7 rounded-md bg-[color:var(--primary)]/85" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-6 rounded-md bg-[color:var(--background)]" />
            ))}
          </div>
        </aside>
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="h-2 w-24 rounded-sm bg-[color:var(--primary)]" />
              <div className="mt-2 h-2 w-36 rounded-sm bg-[color:var(--foreground)]/60" />
            </div>
            <div className="h-8 w-20 rounded-md border border-[color:var(--primary)]/35 bg-[rgba(195,147,86,0.09)]" />
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {[68, 42, 91].map((width, index) => (
              <div key={width} className="rounded-md border border-[color:var(--outline)] bg-[color:var(--surface)]/70 p-2">
                <div className="mb-3 h-2 w-12 rounded-sm bg-[color:var(--muted)]/40" />
                <div className="h-8 rounded-sm bg-[linear-gradient(180deg,rgba(101,214,218,0.34),rgba(101,214,218,0.04))]">
                  <div className="h-full rounded-sm bg-[color:var(--accent-cyan)]/25" style={{ width: `${width}%` }} />
                </div>
                <div className="mt-2 font-mono text-xs text-[color:var(--surface-foreground)]">0{index + 1}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 overflow-hidden rounded-md border border-[color:var(--outline)] bg-[color:var(--surface)]/62">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="grid grid-cols-[1fr_0.7fr_3rem] gap-2 border-b border-[color:var(--outline)] px-3 py-2 last:border-b-0">
                <div className="h-2 rounded-sm bg-[color:var(--foreground)]/55" />
                <div className="h-2 rounded-sm bg-[color:var(--muted)]/38" />
                <div className="h-2 rounded-sm bg-[color:var(--primary)]/70" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowserMockup() {
  return (
    <div className="h-full overflow-hidden rounded-lg border border-[color:var(--outline)] bg-[color:var(--background)] shadow-xl shadow-black/30 transition duration-500 group-hover/project:-translate-y-2">
      <div className="flex h-9 items-center gap-2 border-b border-[color:var(--outline)] px-3">
        <span className="h-2.5 w-2.5 rounded-sm bg-[color:var(--primary)]" />
        <span className="h-2.5 w-2.5 rounded-sm bg-[color:var(--accent-cyan)]" />
        <span className="h-2.5 w-2.5 rounded-sm bg-[color:var(--muted)]/45" />
        <div className="ml-2 h-5 flex-1 rounded-md border border-[color:var(--outline)] bg-[color:var(--surface)]/72" />
      </div>
      <div className="grid h-[calc(100%-2.25rem)] grid-rows-[1fr_auto] p-4">
        <div className="rounded-md border border-[color:var(--outline)] bg-[linear-gradient(145deg,rgba(195,147,86,0.12),rgba(18,24,32,0.72))] p-4">
          <div className="h-2 w-20 rounded-sm bg-[color:var(--primary)]" />
          <div className="mt-4 h-5 w-3/4 rounded-sm bg-[color:var(--foreground)]/70" />
          <div className="mt-3 h-2.5 w-full rounded-sm bg-[color:var(--muted)]/45" />
          <div className="mt-2 h-2.5 w-2/3 rounded-sm bg-[color:var(--muted)]/32" />
          <div className="mt-5 flex gap-2">
            <div className="h-8 w-24 rounded-md bg-[color:var(--primary)] transition duration-500 group-hover/project:w-28" />
            <div className="h-8 w-16 rounded-md border border-[color:var(--outline)] bg-[color:var(--background)]/70" />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-md border border-[color:var(--outline)] bg-[color:var(--surface)]/70 p-2">
              <div className="mb-2 h-6 rounded-sm bg-[rgba(101,214,218,0.1)]" />
              <div className="h-2 rounded-sm bg-[color:var(--surface-foreground)]/55" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubscriptionMockup() {
  return (
    <div className="h-full overflow-hidden rounded-lg border border-[color:var(--outline)] bg-[color:var(--background)] p-3 shadow-xl shadow-black/30 transition duration-500 group-hover/project:-translate-y-2">
      <div className="mb-3 flex items-center justify-between rounded-md border border-[color:var(--outline)] bg-[color:var(--surface)] px-3 py-2">
        <div>
          <div className="h-2 w-20 rounded-sm bg-[color:var(--primary)]" />
          <div className="mt-2 h-2 w-28 rounded-sm bg-[color:var(--foreground)]/58" />
        </div>
        <div className="h-8 w-8 rounded-md border border-[color:var(--primary)]/35 bg-[rgba(195,147,86,0.12)]" />
      </div>
      <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-md border border-[color:var(--primary)]/35 bg-[rgba(195,147,86,0.1)] p-3">
          <div className="mb-3 h-2 w-16 rounded-sm bg-[color:var(--primary)]" />
          <div className="font-mono text-2xl font-semibold text-[color:var(--foreground)]">Club</div>
          <div className="mt-3 space-y-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-[color:var(--primary)]/75" />
                <div className="h-2 flex-1 rounded-sm bg-[color:var(--surface-foreground)]/48" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {["Socio activo", "Preferencias", "Beneficios", "Renovación"].map((item, index) => (
            <div key={item} className="grid grid-cols-[1fr_3rem] gap-2 rounded-md border border-[color:var(--outline)] bg-[color:var(--surface)]/70 p-2">
              <div>
                <div className="h-2 w-24 max-w-full rounded-sm bg-[color:var(--foreground)]/58" />
                <div className="mt-2 h-1.5 w-14 rounded-sm bg-[color:var(--muted)]/36" />
              </div>
              <div className={index === 0 ? "h-7 rounded-md bg-[color:var(--primary)]" : "h-7 rounded-md bg-[color:var(--background)]"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
