import Link from "next/link";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteHeader } from "@/components/site-header";

export default function ServiciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-shell min-h-screen overflow-hidden">
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[color:var(--border)] px-5 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Francisco Requena Sánchez</p>
          <Link
            href="/"
            className="hover:text-[color:var(--foreground)] transition"
          >
            ← Volver al portfolio
          </Link>
        </div>
      </footer>
    </div>
  );
}
