const DEFAULT_ITEMS = [
  "Reviewed on revenue & bank activity",
  "Real funding specialists",
  "Secure, encrypted submission",
];

/** Thin reassurance strip — keeps trust signals above the fold (Cialdini). */
export default function TrustBar({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  return (
    <div className="border-y border-brand-100 bg-brand-50/60">
      <div className="container-content flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-3 text-sm text-brand-800">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center gap-2">
            <CheckIcon />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 flex-none text-accent-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
