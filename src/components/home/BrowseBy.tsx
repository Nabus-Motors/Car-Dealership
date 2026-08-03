import { Link } from 'react-router-dom';
import type { InventoryFacets } from '@utils/inventory';

interface BrowseByProps {
  facets: InventoryFacets;
  loading?: boolean;
}

export default function BrowseBy({ facets, loading = false }: BrowseByProps) {
  return (
    <section className="w-full bg-white pb-16 pt-16 md:pb-24 md:pt-24">
      <div className="shell">
        <div className="border-t border-[var(--hairline)] pt-12">
          <h2 className="font-display display-lead uppercase text-ink">Order by Body Style</h2>

          <div className="mt-8 grid grid-cols-2 border-l border-t border-[var(--hairline)] sm:grid-cols-4 lg:grid-cols-7">
            {loading && !facets.bodyStyles.length
              ? Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[92px] animate-pulse border-b border-r border-[var(--hairline)] bg-[#F4F5F6]"
                  />
                ))
              : facets.bodyStyles.map((style) => (
                  <Link
                    key={style}
                    to={`/explore?body_style=${encodeURIComponent(style)}`}
                    className="group flex h-[92px] items-center justify-center border-b border-r border-[var(--hairline)] px-3 text-center transition-colors duration-300 hover:bg-[#FAFAFA]"
                  >
                    <span className="font-display text-sm uppercase tracking-[0.08em] text-ink/80 transition-colors group-hover:text-ink">
                      {style}
                    </span>
                  </Link>
                ))}
          </div>
        </div>

        <div className="mt-16 border-t border-[var(--hairline)] pt-12">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display display-lead uppercase text-ink">Browse by Brand</h2>
            <Link
              to="/explore"
              className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/70 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {loading && !facets.brands.length
              ? Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="h-11 w-28 animate-pulse bg-[#F4F5F6]" />
                ))
              : facets.brands.map((brand) => (
                  <Link
                    key={brand}
                    to={`/explore?brand=${encodeURIComponent(brand)}`}
                    className="border border-[var(--hairline)] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink/75 transition-colors duration-300 hover:border-[var(--accent-solid)] hover:text-ink"
                  >
                    {brand}
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
