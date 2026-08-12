const STATS = [
  { value: '500+', label: 'Vehicles' },
  { value: '20+', label: 'Years Experience' },
  { value: '2,000+', label: 'Happy Customers' },
  { value: '5★', label: 'Rated' },
];

export default function StatsBand() {
  return (
    <section className="w-full bg-ink py-16 md:py-20">
      <div className="shell">
        <h2 className="font-display display-lead text-center uppercase text-white">Why Choose Us</h2>

        <div className="mt-10 flex flex-col items-center justify-center gap-8 border-y border-white/10 py-10 sm:flex-row sm:gap-0 md:mt-12 md:py-14">
          {STATS.map((stat, index) => (
            <div key={stat.label} className="flex items-center">
              {index > 0 && <div className="hidden h-10 w-px bg-white/10 sm:mx-10 sm:block lg:mx-14" />}
              <div className="text-center">
                <div className="font-display text-3xl font-black text-[var(--accent-solid)] sm:text-4xl">
                  {stat.value}
                </div>
                <div className="eyebrow mt-2 text-onDark">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
