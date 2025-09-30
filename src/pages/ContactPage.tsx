import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { MapPin, Phone, Mail } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // EmailJS configuration - Replace these with your actual EmailJS values
      // Get these from https://www.emailjs.com/ after setting up your account
      const serviceId = 'service_e17xo1o'; // Your EmailJS service ID
      const templateId = 'template_g9aoik7'; // Your EmailJS template ID  
      const publicKey = 'a4rvke1LTexlS43s3'; // Your EmailJS public key

      // Check if EmailJS is properly configured
      if (serviceId.includes('your_') || templateId.includes('your_') || publicKey.includes('your_')) {
        // Fallback to mailto if EmailJS is not configured
        console.log('EmailJS not configured, falling back to mailto');
        const subject = `New Contact Message from ${formData.name || 'Website Visitor'}`;
        const bodyLines = [
          'You have a new contact message from the website:',
          '',
          `Name: ${formData.name}`,
          `Email: ${formData.email}`,
          formData.phone ? `Phone: ${formData.phone}` : undefined,
          '',
          'Message:',
          formData.message,
        ].filter(Boolean);

        const mailtoUrl = `mailto:kelvindespartan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
        window.open(mailtoUrl, '_blank');
        
        alert('Your email client has been opened. Please send the pre-filled email to complete your message.');
        setFormData({ name: '', email: '', phone: '', message: '' });
        return;
      }

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        message: formData.message,
        to_email: 'kelvindespartan@gmail.com',
        reply_to: formData.email,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Fallback to mailto on any error
      const subject = `New Contact Message from ${formData.name || 'Website Visitor'}`;
      const bodyLines = [
        'You have a new contact message from the website:',
        '',
        `Name: ${formData.name}`,
        `Email: ${formData.email}`,
        formData.phone ? `Phone: ${formData.phone}` : undefined,
        '',
        'Message:',
        formData.message,
      ].filter(Boolean);

      const mailtoUrl = `mailto:kelvindespartan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
      window.open(mailtoUrl, '_blank');
      
      alert('There was an issue with direct sending. Your email client has been opened with a pre-filled message. Please send it to complete your contact request.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Showroom",
      details: ["123 Auto Street", "Car City, CC 12345"],
      action: "Get Directions"
    },
    {
      icon: Phone,
      title: "Call Us", 
      details: ["(555) 123-4567", "Mon-Fri: 9AM-8PM"],
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["kelvindespartan@gmail.com", "sales@nabusmotors.com"],
      action: "Send Email"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        backgroundImage="https://images.unsplash.com/photo-1705747401901-28363172fe7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzaG93cm9vbXxlbnwxfHx8fDE3NTg3MTYyMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        title="Contact Us"
        subtitle="We're here to help you find your perfect vehicle"
        height="h-[400px]"
      />

      {/* Contact Form and Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Contact Form and Map */}
            <div className="space-y-8">
              {/* Contact Form */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="How can we help you?"
                        rows={5}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Map Location */}
              <Card className="overflow-hidden mt-6">
                <CardHeader className="pb-0">
                  <CardTitle className="text-2xl font-bold text-slate-900">Location</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80 relative">
                    <iframe
                      src="https://www.google.com/maps?q=NABUS%20MOTORS&z=16&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Nabus Motors Location"
                      className="w-full h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Get in Touch
              </h2>
              <p className="text-gray-600">
                Have a question about a specific vehicle? Looking to schedule a test drive? 
                Our team is here to help you with anything you need.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <info.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {info.title}
                          </h3>
                          <div className="space-y-1 mt-2 text-sm text-gray-600">
                            {info.details.map((detail, i) => (
                              <p key={i}>{detail}</p>
                            ))}
                          </div>
                          <Button
                            variant="link"
                            className="mt-2 h-auto p-0 text-blue-600"
                          >
                            {info.action} →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Business Hours */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Business Hours
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>11:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}