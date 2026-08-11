import { useState } from 'react';
import { ContactFormDialog } from '@/components/ContactFormDialog';

const SERVICES = [
  { title: 'Inventory', desc: 'Browse our extensive collection', topic: 'vehicle inventory' },
  { title: 'VIP Appointment', desc: 'Schedule a personal viewing', topic: 'VIP Appointment service' },
  { title: 'Auto Finance', desc: 'Flexible financing options', topic: 'Auto Finance options' },
  { title: 'Auto Services', desc: 'Complete maintenance & support', topic: 'Auto Services' },
];

export default function OurServices() {
  const [enquiryTopic, setEnquiryTopic] = useState<string | null>(null);

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="shell">
        <div className="border-t border-[var(--hairline)] pt-12">
          <h2 className="font-display display-lead uppercase text-ink">Our Services</h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/55">
            How can we help to make your dream come true
          </p>

          <div className="mt-10 grid grid-cols-1 border-l border-t border-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="group flex flex-col justify-between border-b border-r border-[var(--hairline)] p-8 transition-colors duration-300 hover:bg-[#FAFAFA] lg:p-10"
              >
                <div>
                  <h3 className="font-display text-xl uppercase tracking-[0.04em] text-ink lg:text-2xl">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/55">{service.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setEnquiryTopic(service.topic)}
                  className="arrow-link mt-10 !text-ink"
                >
                  Learn More
                  <span className="arrow-rule" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ContactFormDialog
        key={enquiryTopic ?? 'closed'}
        open={enquiryTopic !== null}
        onOpenChange={(open) => {
          if (!open) setEnquiryTopic(null);
        }}
        carTitle={enquiryTopic ?? undefined}
      />
    </section>
  );
}
