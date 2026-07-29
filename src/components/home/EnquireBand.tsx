import { Link } from 'react-router-dom';

export default function EnquireBand() {
  return (
    <section className="chamfer-tl w-full bg-ink">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div className="max-w-2xl">
            <h2 className="font-display display-lead uppercase text-white">
              Enquire to Buy
            </h2>
            <p className="mt-5 text-[15px] leading-[1.75] text-onDark">
              Not sure which vehicle fits your life? Tell us how you drive and we will put
              the right two or three in front of you — no pressure, no padding.
            </p>
          </div>

          <Link to="/contact" className="btn-accent shrink-0 self-start lg:self-end">
            Enquire
          </Link>
        </div>
      </div>
    </section>
  );
}
