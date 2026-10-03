import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Send,
  ExternalLink,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { WebsiteSettings } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import storefrontImg from '../../assets/images/crystal_ice_storefront.jpg';

interface ContactViewProps {
  settings: WebsiteSettings;
}

export const ContactView: React.FC<ContactViewProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [subject, setSubject] = useState('Commercial Ice Supply');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitContactForm({
        name,
        email,
        phone: phone || undefined,
        business_name: businessName || undefined,
        subject,
        message
      });
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setBusinessName('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    'Hello Crystal Ice Zimbabwe team, I would like to make an inquiry regarding your ice products or cold chain services.'
  )}`;

  const googleMapsUrl = settings.google_business_url || "https://www.google.com/search?kgmid=%2Fg%2F11q40rdy9f&hl=en-ZW&q=Crystal%20Ice%20Zimbabwe";

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] text-[#0265B5] block">
            Contact & Location
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B2545] font-['Outfit'] mt-2">
            Get in Touch With Us
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Reach our Waterfalls plant in Harare for packaged ice orders, wholesale distribution, or commercial meat blast freezing bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Coordinates, Social Media & Actual Physical Facility Photo */}
          <div className="lg:col-span-5 space-y-6">
            {/* Actual Physical Storefront Photo (No generic borders) */}
            <div className="rounded-3xl overflow-hidden shadow-xl bg-white">
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900">
                <img
                  src={storefrontImg}
                  alt="Crystal Ice Zimbabwe Physical Facility at FF11 Waterfalls Avenue, Harare"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B223D]/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-xs font-bold block">Crystal Ice Zimbabwe Facility</span>
                  <span className="text-[11px] text-cyan-300">FF11 Waterfalls Avenue, Harare</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 text-xs text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <Building2 className="w-4 h-4 text-[#0265B5]" />
                  <span>Physical plant & express pickup bay</span>
                </span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0265B5] hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Office Coordinates Card (No harsh borders) */}
            <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0B2545] font-['Outfit']">
                Office & Plant Coordinates
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0265B5] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="font-bold text-[#0B2545] block text-sm">Physical Office & Facility</span>
                    <span className="text-slate-600 mt-0.5 block">{settings.physical_address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0265B5] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#0B2545] block text-sm">Telephone Hotline</span>
                    <a
                      href={`tel:${settings.phone_primary}`}
                      className="text-[#0265B5] hover:underline font-semibold block mt-0.5"
                    >
                      {settings.phone_primary}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0265B5] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#0B2545] block text-sm">Email Address</span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-[#0265B5] hover:underline font-semibold block mt-0.5"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0265B5] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#0B2545] block text-sm">Business Operating Hours</span>
                    <span className="text-slate-600 block mt-0.5">{settings.business_hours}</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-950 block">WhatsApp Dispatch</span>
                    <span className="text-emerald-800">Quick orders & quotes</span>
                  </div>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-all shadow-xs"
                >
                  Chat Now
                </a>
              </div>
            </div>
          </div>

          {/* Right: Working Inquiry Form (Borderless Modern Card) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl">
              <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] font-['Outfit'] mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Complete the inquiry form below and our Harare team will respond promptly.
              </p>

              {submitSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                    Message Sent Successfully
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                    Thank you for reaching out to Crystal Ice Zimbabwe. Our team has received your message and will be in touch shortly.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-4 px-5 py-2.5 text-xs font-bold text-[#0265B5] bg-blue-50 hover:bg-blue-100 rounded-full"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tendai Moyo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 text-xs bg-slate-100/70 hover:bg-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0265B5] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Business / Venue Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Borrowdale Grill / Self"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full p-3 text-xs bg-slate-100/70 hover:bg-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0265B5] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. tendai@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 text-xs bg-slate-100/70 hover:bg-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0265B5] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +263 77 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 text-xs bg-slate-100/70 hover:bg-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0265B5] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 text-xs bg-slate-100/70 hover:bg-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0265B5] transition-colors"
                    >
                      <option value="Commercial Ice Supply">2.5kg Ice Cubes ($1.00 / bag | $0.75 for 100+ packs)</option>
                      <option value="10kg Solid Ice Blocks">10kg Solid Ice Blocks ($2.00 / block)</option>
                      <option value="Meat Blast Freezing">Meat Blast Freezing (Chickens $0.25/bird | Beef/Pork $0.20/kg)</option>
                      <option value="General Inquiry">General Inquiries & Hospitality Supply</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Message & Requirements *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please let us know your location in Harare, required quantities, or service requirements..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 text-xs bg-slate-100/70 hover:bg-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0265B5] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-[#0265B5] hover:bg-[#005599] text-white font-bold rounded-full text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    {isSubmitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
