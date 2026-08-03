import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SubscribeBand() {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    toast.success('You are on the list. We will be in touch.');
    setEmail('');
  };

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="shell">
        <div className="border-t border-[var(--hairline)] pt-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <p className="eyebrow text-[var(--accent-deep)]">Subscribe</p>
              <h2 className="mt-4 font-display display-lead uppercase text-ink">
                Join the Nabus List
              </h2>
            </div>

            <div>
              <p className="text-[15px] leading-[1.75] text-ink/60">
                New arrivals, price drops and private viewings — sent before they reach the
                showroom floor.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 flex flex-wrap gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="your@email.com"
                  aria-label="Email address"
                  className="h-[46px] min-w-[240px] flex-1 border border-[var(--hairline)] bg-white px-4 text-sm text-ink outline-none transition-colors focus:border-[var(--accent-solid)]"
                />
                <button type="submit" className="btn-accent h-[46px] !py-0">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
