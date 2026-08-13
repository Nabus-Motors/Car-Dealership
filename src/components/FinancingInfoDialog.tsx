import { Dialog, DialogContent, DialogTitle } from '@components/ui/dialog';
import { X, Banknote, Handshake, Repeat, Building2 } from 'lucide-react';

interface FinancingInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactClick: () => void;
}

const FINANCING_OPTIONS = [
  {
    Icon: Handshake,
    title: 'Installment Plans',
    desc: 'Through our partnership with Autochek Ghana, spread the cost of your vehicle over convenient monthly installments.',
  },
  {
    Icon: Banknote,
    title: 'Bank & Fintech Loans',
    desc: 'We work alongside leading banks and fintech partners to help you secure competitive auto loan rates.',
  },
  {
    Icon: Repeat,
    title: 'Trade-In Credit',
    desc: 'Trade in your current vehicle and apply its value directly toward the financing of your next one.',
  },
  {
    Icon: Building2,
    title: 'Corporate & Fleet Financing',
    desc: 'Tailored financing packages for businesses looking to purchase or lease multiple vehicles.',
  },
];

export function FinancingInfoDialog({ open, onOpenChange, onContactClick }: FinancingInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 rounded-none bg-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-ink text-white px-6 py-8 flex-shrink-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <DialogTitle className="text-2xl font-bold">Auto Finance</DialogTitle>
              <p className="text-onDark text-sm mt-1">Flexible ways to fund your next vehicle</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options - Scrollable */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
          {FINANCING_OPTIONS.map(({ Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-6">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-[#C9A84C]/15">
                <Icon className="h-5 w-5 text-[#C9A84C]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="p-6 border-t border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={onContactClick}
            className="w-full bg-[#C9A84C] hover:bg-[#E5C263] text-ink font-bold uppercase tracking-[0.14em] text-[13px] py-3 transition-colors"
          >
            Talk to Our Finance Team
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
