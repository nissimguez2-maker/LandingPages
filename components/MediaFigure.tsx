import type { MediaAsset } from "@/lib/types";

/**
 * One place that decides image strategy. Renders a real image when `src` is set,
 * otherwise a branded placeholder so layout improves immediately (real art later).
 * Uses plain <img> for now, `next/image` is deferred until real raster exists.
 */
export default function MediaFigure({
  asset,
  className = "",
  aspect = "video",
}: {
  asset?: MediaAsset;
  className?: string;
  aspect?: "video" | "square" | "hero";
}) {
  const ratio = aspect === "square" ? "aspect-square" : aspect === "hero" ? "aspect-[4/3]" : "aspect-video";

  if (asset?.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset.src}
        alt={asset.alt}
        width={1100}
        height={825}
        loading={aspect === "hero" ? "eager" : "lazy"}
        fetchPriority={aspect === "hero" ? "high" : undefined}
        decoding="async"
        className={`${ratio} w-full rounded-2xl object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={asset?.alt || "Illustration"}
      className={`${ratio} relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 ${className}`}
    >
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <svg className="h-full w-full" viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">
          <circle cx="160" cy="30" r="50" fill="white" />
          <circle cx="30" cy="130" r="40" fill="white" />
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <svg className="h-12 w-12 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10" r="1.5" />
          <path d="M21 16l-5-5-4 4-2-2-7 7" />
        </svg>
      </div>
    </div>
  );
}
