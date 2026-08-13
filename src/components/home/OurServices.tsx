import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContactFormDialog } from '@/components/ContactFormDialog';
import { AppointmentDialog } from '@/components/AppointmentDialog';
import { FinancingInfoDialog } from '@/components/FinancingInfoDialog';

const BOXES = [
  {
    title: 'Schedule Appointment',
    desc: 'Book a personal viewing or consultation',
    type: 'appointment' as const,
  },
  {
    title: 'Auto Finance',
    desc: 'Flexible financing options',
    type: 'finance' as const,
  },
  {
    title: 'Services',
    desc: 'Complete maintenance & support',
    type: 'link' as const,
    to: '/about#services',
  },
];

export default function OurServices() {
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [financingOpen, setFinancingOpen] = useState(false);
  const [enquiryTopic, setEnquiryTopic] = useState<string | null>(null);

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="shell">
        <div className="border-t border-[var(--hairline)] pt-12">
          <p className="eyebrow text-[var(--accent-deep)]">Get Started</p>
          <h2 className="mt-4 font-display display-lead uppercase text-ink">How We Can Help</h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/55">
            Three quick ways to move forward with Nabus Motors.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {BOXES.map((box) => (
              <div
                key={box.title}
                className="group flex flex-col justify-between border border-[var(--hairline)] p-8 transition-colors duration-300  lg:p-10"
              >
                <div>
                  <h3 className="font-display text-xl uppercase tracking-[0.04em] text-ink lg:text-2xl">
                    {box.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/55">{box.desc}</p>
                </div>

                {box.type === 'link' ? (
                  <Link to={box.to} className="arrow-link mt-10 !text-ink">
                    Learn More
                    <span className="arrow-rule" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      box.type === 'appointment' ? setAppointmentOpen(true) : setFinancingOpen(true)
                    }
                    className="arrow-link mt-10 !text-ink"
                  >
                    Learn More
                    <span className="arrow-rule" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AppointmentDialog
        open={appointmentOpen}
        onOpenChange={setAppointmentOpen}
      />

      <FinancingInfoDialog
        open={financingOpen}
        onOpenChange={setFinancingOpen}
        onContactClick={() => {
          setFinancingOpen(false);
          setEnquiryTopic('Auto Finance options');
        }}
      />

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
