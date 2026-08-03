import { Link } from 'react-router-dom';

const CATEGORIES = [
  { title: 'Inventory', to: '/explore', copy: 'Browse every vehicle on the floor' },
  { title: 'Finance', to: '/contact', copy: 'Terms shaped around your budget' },
  { title: 'Trade-In', to: '/contact', copy: 'Turn your current car into equity' },
  { title: 'Servicing', to: '/contact', copy: 'Factory-grade care, local rates' },
  { title: 'Warranty', to: '/about', copy: 'Cover that travels with the car' },
  { title: 'About Us', to: '/about', copy: 'The people behind the plates' },
];

export default function CategoryGrid() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="shell">
        <div className="grid grid-cols-1 border-l border-t border-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.title}
              to={category.to}
              className="group flex flex-col justify-between border-b border-r border-[var(--hairline)] p-8 transition-colors duration-300 hover:bg-[#FAFAFA] lg:p-10"
            >
              <div>
                <h3 className="font-display text-2xl uppercase tracking-[0.04em] text-ink lg:text-[28px]">
                  {category.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/55">{category.copy}</p>
              </div>

              <span className="arrow-link mt-10 !text-ink">
                Discover
                <span className="arrow-rule" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
