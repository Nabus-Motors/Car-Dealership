import { useNavigate } from 'react-router-dom';

export default function ExploreBand() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-ink">
      <div className="shell border-y border-white/10 py-16 text-center md:py-20">
        <h2 className="font-display display-section uppercase text-white">
          Ready to Find Your Next Vehicle?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.75] text-onDark">
          Explore our complete inventory and discover the perfect car for your lifestyle.
        </p>
        <button onClick={() => navigate('/explore')} className="btn-light mt-10">
          Explore All Cars
        </button>
      </div>
    </section>
  );
}
