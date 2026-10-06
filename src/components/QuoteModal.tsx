import React, { useState } from 'react';
import {
  X,
  FileText,
  CheckCircle,
  MessageCircle,
  Building,
  Calendar,
  MapPin,
  Sparkles,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { WebsiteSettings, Service } from '../types/index.ts';
import { api } from '../services/api.ts';
import { BUSINESS_WHATSAPP_NUMBER } from '../config/whatsapp.ts';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WebsiteSettings;
  services: Service[];
  preselectedService?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  settings,
  services,
  preselectedService
}) => {
  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [serviceType, setServiceType] = useState(preselectedService || (services[0]?.title || 'Daily Commercial Supply'));
  const [estimatedVolume, setEstimatedVolume] = useState('500 - 1,500 lbs weekly');
  const [deliveryFrequency, setDeliveryFrequency] = useState<'one_time' | 'daily' | 'weekly' | 'bi_weekly' | 'custom'>('weekly');
  const [eventDate, setEventDate] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedQuote, setConfirmedQuote] = useState<any>(null);

  if (!isOpen) return null;

  // Format delivery frequency for clear message display
  const formatFrequency = (freq: string) => {
    switch (freq) {
      case 'weekly': return 'Weekly Automated Drop-off';
      case 'daily': return 'Daily Morning Restock';
      case 'bi_weekly': return 'Bi-Weekly Scheduled Route';
      case 'one_time': return 'One-Time Event Staging';
      case 'custom': return 'Custom Commercial Route';
      default: return freq;
    }
  };

  // Helper to compile all user-entered quote details into a clean, readable WhatsApp message
  const generateWhatsAppMessage = (refNumber?: string) => {
    const lines = [
      `*COMMERCIAL ICE & BLAST FREEZING QUOTE REQUEST* 🧊`,
      refNumber ? `*Reference:* #${refNumber}` : null,
      ``,
      `*Customer Details:*`,
      `• *Name:* ${customerName.trim()}`,
      businessName.trim() ? `• *Business / Organization:* ${businessName.trim()}` : null,
      `• *Phone:* ${customerPhone.trim()}`,
      `• *Email:* ${customerEmail.trim()}`,
      ``,
      `*Quote Requirements:*`,
      `• *Supply Program:* ${serviceType}`,
      `• *Delivery Frequency:* ${formatFrequency(deliveryFrequency)}`,
      estimatedVolume.trim() ? `• *Estimated Volume:* ${estimatedVolume.trim()}` : null,
      eventDate ? `• *Target Date:* ${eventDate}` : null,
      deliveryLocation.trim() ? `• *Venue / Location:* ${deliveryLocation.trim()}` : null,
      notes.trim() ? `• *Logistics & Instructions:* ${notes.trim()}` : null,
      ``,
      `_Sent via Crystal Ice Zimbabwe Website Quote Form_`
    ];

    return lines.filter((line) => line !== null).join('\n');
  };

  const targetWhatsAppNumber = BUSINESS_WHATSAPP_NUMBER || (settings.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : '263774213817');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName || !customerPhone || !customerEmail) {
      setErrorMessage('Please fill in your name, phone number, and email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitQuote({
        customer_name: customerName,
        business_name: businessName || undefined,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        service_type: serviceType,
        estimated_volume: estimatedVolume,
        delivery_frequency: deliveryFrequency,
        event_date: eventDate || undefined,
        delivery_location: deliveryLocation || 'Metro District',
        notes
      });
      setConfirmedQuote(res.quote);

      // Build formatted WhatsApp message with all entered form data
      const waText = generateWhatsAppMessage(res.quote?.reference_number);
      const waUrl = `https://wa.me/${targetWhatsAppNumber}?text=${encodeURIComponent(waText)}`;

      // Open WhatsApp/WhatsApp Web using a click-to-chat link
      const link = document.createElement('a');
      link.href = waUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit commercial quote request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quoteWhatsappUrl = confirmedQuote
    ? `https://wa.me/${targetWhatsAppNumber}?text=${encodeURIComponent(
        generateWhatsAppMessage(confirmedQuote.reference_number)
      )}`
    : `https://wa.me/${targetWhatsAppNumber}?text=${encodeURIComponent(generateWhatsAppMessage())}`;

  return (
    <div
      id="quote-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div
        id="quote-modal-container"
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg sm:text-xl font-bold font-['Outfit']">
                {confirmedQuote ? 'Quote Proposal Requested' : 'Commercial Ice Quote'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Bulk pallet rates, recurring hospitality supply & event refrigeration
            </p>
          </div>
          <button
            id="close-quote-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div
              id="quote-error-banner"
              className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!confirmedQuote ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    id="quote-contact-name"
                    type="text"
                    required
                    placeholder="e.g. Jessica Lin"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business / Organization Name
                  </label>
                  <input
                    id="quote-business-name"
                    type="text"
                    placeholder="e.g. Apex Music Amphitheater"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Direct Phone *
                  </label>
                  <input
                    id="quote-phone"
                    type="tel"
                    required
                    placeholder="e.g. (555) 987-6543"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="quote-email"
                    type="email"
                    required
                    placeholder="e.g. jessica@apexevents.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supply Program Type
                  </label>
                  <select
                    id="quote-service-type"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    <option value="Custom Bulk Event Pallets">Custom Bulk Event Pallets</option>
                    <option value="Merchandiser Freezer Placement">Freezer Placement Program</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Delivery Frequency
                  </label>
                  <select
                    id="quote-frequency"
                    value={deliveryFrequency}
                    onChange={(e) => setDeliveryFrequency(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="weekly">Weekly Automated Drop-off</option>
                    <option value="daily">Daily Morning Restock</option>
                    <option value="bi_weekly">Bi-Weekly Scheduled Route</option>
                    <option value="one_time">One-Time Event Staging</option>
                    <option value="custom">Custom Commercial Route</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Volume / Ice Type
                  </label>
                  <input
                    id="quote-volume"
                    type="text"
                    placeholder="e.g. 2 pallets tube ice + 20 boxes cocktail cubes"
                    value={estimatedVolume}
                    onChange={(e) => setEstimatedVolume(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Event / Start Date
                  </label>
                  <input
                    id="quote-event-date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Venue / Delivery Staging Location
                </label>
                <input
                  id="quote-location"
                  type="text"
                  placeholder="e.g. Pier 17 Pavilion, Dock Door 4 or Downtown Hospitality Grid"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Logistics & Delivery Instructions
                </label>
                <textarea
                  id="quote-notes"
                  rows={2}
                  placeholder="e.g. Please arrange morning delivery to our cold room bay or event staging area in Harare."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-100/70 hover:bg-slate-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0265B5] transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  id="submit-quote-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting to Sales Desk...</span>
                  ) : (
                    <>
                      <span>Submit Commercial Quote Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Quote Proposal Generated
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2 font-['Outfit']">
                  Reference: {confirmedQuote.reference_number}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Thank you, <span className="font-semibold text-slate-800">{confirmedQuote.customer_name}</span>. Our commercial account manager is calculating pallet pricing and schedule logistics.
                </p>
              </div>

              <div className="pt-3 space-y-2 max-w-md mx-auto">
                <a
                  id="quote-success-whatsapp-btn"
                  href={quoteWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss Reference #{confirmedQuote.reference_number} on WhatsApp</span>
                </a>

                <button
                  id="close-quote-success-btn"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
