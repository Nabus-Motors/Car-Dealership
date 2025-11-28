import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Dialog, DialogContent, DialogTitle } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { X, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carTitle?: string;
}

export function ContactFormDialog({ open, onOpenChange, carTitle }: ContactFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: carTitle ? `I'm interested in the ${carTitle}` : '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
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
        message: formData.message,
        car_title: carTitle || 'General Inquiry',
        to_email: 'kelvindespartan@gmail.com',
        reply_to: formData.email,
      };

      // Initialize EmailJS if not already done
      emailjs.init(publicKey);

      const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      if (result.status === 200) {
        toast.success('Message sent successfully! We\'ll be in touch soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: carTitle ? `I'm interested in the ${carTitle}` : '',
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#001F3F] to-[#002855] text-white px-6 py-8 flex-shrink-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <DialogTitle className="text-2xl font-bold">Get in Touch</DialogTitle>
              <p className="text-gray-300 text-sm mt-1">We'd love to hear from you</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
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
                className="border-0 bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#FFD700] focus:bg-white"
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
                className="border-0 bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#FFD700] focus:bg-white"
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
                className="border-0 bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#FFD700] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your interest..."
                rows={4}
                className="w-full px-4 py-3 border-0 bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#FFD700] focus:bg-white resize-none"
              />
            </div>
          </div>

          {/* Button Area - Always visible */}
          <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-300 text-gray-900 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#FFD700] hover:bg-[#FFC700] text-[#001F3F] font-semibold flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
