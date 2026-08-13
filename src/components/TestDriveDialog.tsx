import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Dialog, DialogContent, DialogTitle } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { X, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTodayDateString, getHoursForDate, isTimeWithinHours, isClosedOn, formatHoursLabel, DEFAULT_HOURS } from '@/utils/businessHours';

interface TestDriveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carTitle?: string;
}

const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  phone: '',
  preferredDate: '',
  preferredTime: '',
  additionalInfo: '',
};

export function TestDriveDialog({ open, onOpenChange, carTitle }: TestDriveDialogProps) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  const todayStr = getTodayDateString();
  const hoursForDate = getHoursForDate(formData.preferredDate) ?? DEFAULT_HOURS;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const preferredDate = e.target.value;

    if (isClosedOn(preferredDate)) {
      setDateError("We're closed on Sundays. Please choose another date.");
      return;
    }

    setDateError(null);
    setFormData((prev) => ({
      ...prev,
      preferredDate,
      preferredTime: isTimeWithinHours(preferredDate, prev.preferredTime) ? prev.preferredTime : '',
    }));
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setFormData(INITIAL_FORM_DATA);
      setDateError(null);
    }
    onOpenChange(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.preferredDate || !formData.preferredTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.preferredDate < todayStr) {
      toast.error('Please choose a date that is today or later');
      return;
    }

    if (!isTimeWithinHours(formData.preferredDate, formData.preferredTime)) {
      toast.error(`Please choose a time within our working hours (${formatHoursLabel(formData.preferredDate)})`);
      return;
    }

    setLoading(true);
    try {
      // EmailJS configuration
      const serviceId = 'service_e17xo1o';
      const templateId = 'template_g9aoik7';
      const publicKey = 'a4rvke1LTexlS43s3';

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        message: `Test Drive Request\n\nPreferred Date: ${formData.preferredDate}\nPreferred Time: ${formData.preferredTime}\n\nAdditional Info:\n${formData.additionalInfo}`,
        car_title: carTitle ? `Test Drive: ${carTitle}` : 'Test Drive Request',
        to_email: 'kelvindespartan@gmail.com',
        reply_to: formData.email,
      };

      // Initialize EmailJS if not already done
      emailjs.init(publicKey);

      const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      if (result.status === 200) {
        toast.success('Test drive request sent! We\'ll confirm your appointment soon.');
        handleOpenChange(false);
      }
    } catch (error) {
      console.error('Error sending test drive request:', error);
      toast.error('Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 rounded-none bg-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-ink text-white px-6 py-8 flex-shrink-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <DialogTitle className="text-2xl font-bold">Schedule Test Drive</DialogTitle>
              <p className="text-onDark text-sm mt-1">Book your appointment now</p>
            </div>
            <button
              onClick={() => handleOpenChange(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="border-0 bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#C9A84C] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="border-0 bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#C9A84C] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone Number *
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="border-0 bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#C9A84C] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Preferred Date *
                </label>
                <Input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleDateChange}
                  min={todayStr}
                  className="border-0 bg-gray-100 text-gray-900 focus:ring-2 focus:ring-[#C9A84C] focus:bg-white"
                />
                {dateError && (
                  <p className="mt-1 text-sm text-red-500">{dateError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Preferred Time *
                </label>
                <Input
                  type="time"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  min={hoursForDate.open}
                  max={hoursForDate.close}
                  className="border-0 bg-gray-100 text-gray-900 focus:ring-2 focus:ring-[#C9A84C] focus:bg-white"
                />
              </div>
            </div>
            {formData.preferredDate && (
              <p className="-mt-2 text-xs text-gray-500">
                Working hours for this date: {formatHoursLabel(formData.preferredDate)}
              </p>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Any questions or special requests..."
                rows={3}
                className="w-full px-4 py-3 border-0 bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#C9A84C] focus:bg-white resize-none"
              />
            </div>
          </div>

          {/* Button Area - Always visible */}
          <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="flex-1 border-ink text-ink hover:bg-ink hover:text-white font-bold uppercase tracking-[0.14em] text-[13px]"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#C9A84C] hover:bg-[#E5C263] text-ink font-bold uppercase tracking-[0.14em] text-[13px] flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Booking...' : 'Book Now'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
