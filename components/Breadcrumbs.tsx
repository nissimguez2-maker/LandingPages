import Link from "next/link";

/** Visible breadcrumb trail. Pair with buildBreadcrumbsJsonLd for the structured
 *  data. The last item (no href) is the current page. */
export default function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden="true" className="text-slate-300">
              /
            </span>
          )}
          {it.href ? (
            <Link href={it.href} className="hover:text-brand-700">
              {it.name}
            </Link>
          ) : (
            <span className="font-medium text-brand-800" aria-current="page">
              {it.name}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
