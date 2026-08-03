import { Link } from 'react-router-dom';

export default function FullForceBand() {
  return (
    <section className="chamfer-tl relative w-full bg-[linear-gradient(105deg,#2E3438_0%,#22282B_55%,#191E21_100%)]">
      <div className="shell py-16 md:py-24 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <h2 className="font-display display-section uppercase text-white/95">
            The Full Force of Nabus
          </h2>

          <div className="max-w-xl">
            <p className="text-[15px] leading-[1.75] text-onDark md:text-base">
              Every vehicle on our floor is sourced, inspected and road-proven before it
              earns a plate. Full service history, honest mileage, and a warranty that
              means something. This is what buying a car in Ghana should feel like.
            </p>

            <Link to="/about" className="btn-accent mt-9">
              Discover
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
