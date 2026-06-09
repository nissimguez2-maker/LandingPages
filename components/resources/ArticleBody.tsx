import type { ReactNode } from "react";
import Link from "next/link";
import type { ArticleBlock } from "@/lib/types";

// Inline markdown links: [anchor](/internal-path). Only same-origin paths
// starting with "/" are turned into <Link>s; everything else stays plain text.
const LINK_RE = /\[([^\]]+)\]\((\/[^)\s]+)\)/g;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    nodes.push(
      <Link
        key={`l${key++}`}
        href={m[2]}
        className="font-medium text-accent-700 underline underline-offset-2 hover:text-accent-800"
      >
        {m[1]}
      </Link>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Renders typed article blocks. No @tailwindcss/typography dependency, so every
 *  element carries explicit spacing classes. */
export default function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} className="mt-10 mb-3 text-2xl font-bold tracking-tight text-brand-900 font-display">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-8 mb-2 text-xl font-semibold text-brand-900 font-display">
                {b.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="mt-4 text-base leading-relaxed text-slate-700">
                {renderInline(b.text)}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="mt-4 space-y-2 pl-1">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3 text-base leading-relaxed text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-500" aria-hidden="true" />
                    <span>{renderInline(it)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol
                key={i}
                className="mt-4 list-decimal space-y-2 pl-5 text-base leading-relaxed text-slate-700 marker:font-semibold marker:text-accent-700"
              >
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ol>
            );
          case "callout":
            return (
              <aside key={i} className="my-8 rounded-2xl border border-accent-200 bg-accent-50 p-5 shadow-card">
                {b.title ? <p className="text-sm font-semibold text-accent-800">{b.title}</p> : null}
                <p className={`${b.title ? "mt-1 " : ""}text-sm leading-relaxed text-brand-800`}>{renderInline(b.text)}</p>
              </aside>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
