import { useState } from 'react';
import { MessageCircle, CalendarCheck } from 'lucide-react';
import { ContactFormDialog } from '@/components/ContactFormDialog';
import { TestDriveDialog } from '@/components/TestDriveDialog';

export default function QuickActions() {
  const [contactOpen, setContactOpen] = useState(false);
  const [testDriveOpen, setTestDriveOpen] = useState(false);

  return (
    <section className="w-full bg-white pb-16 pt-10 md:pb-20 md:pt-12">
      <div className="shell flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button type="button" onClick={() => setContactOpen(true)} className="btn-accent gap-2">
          <MessageCircle className="h-4 w-4" />
          Get in Touch
        </button>
        <button
          type="button"
          onClick={() => setTestDriveOpen(true)}
          className="inline-flex items-center justify-center gap-2 border border-ink px-7 py-[0.9rem] text-[13px] font-bold uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-ink hover:text-white"
        >
          <CalendarCheck className="h-4 w-4" />
          Book Test Drive
        </button>
      </div>

      <ContactFormDialog open={contactOpen} onOpenChange={setContactOpen} />
      <TestDriveDialog open={testDriveOpen} onOpenChange={setTestDriveOpen} />
    </section>
  );
}
