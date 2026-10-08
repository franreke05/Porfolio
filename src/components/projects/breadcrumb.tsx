import Link from "next/link";

type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Migas de pan">
      <ol className="label-mono flex flex-wrap items-center gap-x-2 text-muted">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-x-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex min-h-11 items-center underline-offset-4 hover:text-foreground hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="inline-flex min-h-11 items-center text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
