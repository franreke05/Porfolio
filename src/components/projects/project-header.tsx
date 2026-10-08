import {
  productStages,
  projectCategories,
  type PortfolioProject,
  type ProductStage,
} from "@/lib/portfolio";
import { Breadcrumb } from "./breadcrumb";
import { shell } from "./shared";

export const categoryOf = (project: PortfolioProject) =>
  projectCategories.find((category) => category.id === project.category);

/** "01 — Trabajo para clientes" */
export function CategoryLabel({
  project,
  className = "",
}: {
  project: PortfolioProject;
  className?: string;
}) {
  const category = categoryOf(project);
  if (!category) return null;
  return (
    <p className={`label-mono ${className}`}>
      {category.ordinal} — {category.label}
    </p>
  );
}

/** Breadcrumb strip. The ModeSwitch above it already clears the fixed site header. */
export function ProjectCrumbs({ project }: { project: PortfolioProject }) {
  return (
    <div className={`${shell} pb-2 pt-4`}>
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Proyectos", href: "/proyectos" },
          { label: project.name },
        ]}
      />
    </div>
  );
}

/** Four-step product ladder with the current stage marked. */
export function StageLadder({
  stage,
  compact = false,
}: {
  stage?: ProductStage;
  compact?: boolean;
}) {
  const currentIndex = productStages.findIndex((item) => item.id === stage);

  return (
    <ol className="grid grid-cols-4" aria-label="Etapa del producto">
      {productStages.map((item, index) => {
        const current = index === currentIndex;
        const past = index < currentIndex;
        return (
          <li
            key={item.id}
            aria-current={current ? "step" : undefined}
            className={`border-t-2 pr-2 ${compact ? "pt-2" : "pt-3"} ${
              current || past ? "border-foreground" : "border-dashed border-[color:var(--border-hover)]"
            }`}
          >
            <span className={`label-mono block ${current || past ? "text-foreground" : "text-muted"}`}>
              <span aria-hidden="true" className="block opacity-60">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={`block ${current ? "font-bold" : ""}`}>{item.label}</span>
            </span>
            {current ? (
              <span
                className={`label-mono mt-2 inline-block bg-foreground px-1.5 py-0.5 text-background ${
                  compact ? "text-[0.625rem]" : ""
                }`}
              >
                Etapa actual
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
