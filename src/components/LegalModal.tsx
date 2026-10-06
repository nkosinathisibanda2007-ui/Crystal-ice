import React, { useEffect } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Cookie, Info } from 'lucide-react';
import { WebsiteSettings } from '../types/index.ts';

export type LegalTab = 'privacy' | 'terms';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: LegalTab;
  settings: WebsiteSettings;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'privacy',
  settings
}) => {
  const [activeTab, setActiveTab] = React.useState<LegalTab>(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const companyName = settings.company_name || 'Crystal Ice Zimbabwe';

  return (
    <div
      id="legal-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div
        id="legal-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-100 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="bg-[#0B2545] px-6 py-5 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-lg font-bold font-['Outfit']">
                Legal & Privacy Information
              </h3>
              <p className="text-[11px] text-slate-300">
                {companyName} • Harare, Zimbabwe
              </p>
            </div>
          </div>

          <button
            id="close-legal-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Close legal modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            id="legal-tab-privacy-btn"
            onClick={() => setActiveTab('privacy')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'border-[#0265B5] text-[#0265B5] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy Notice</span>
          </button>

          <button
            id="legal-tab-terms-btn"
            onClick={() => setActiveTab('terms')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'border-[#0265B5] text-[#0265B5] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms & Conditions</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-600 leading-relaxed">
          {activeTab === 'privacy' && (
            <div className="space-y-5">
              <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100/80 text-[#0B2545] flex items-start gap-3">
                <Info className="w-4 h-4 text-[#0265B5] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Plain-English Summary:</strong> We respect your privacy. This website does not require an account, does not use advertising trackers, and connects directly to WhatsApp for ordering and customer service.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0B2545] font-['Outfit'] mb-1.5">
                  1. No Customer Accounts or User Profiles
                </h4>
                <p>
                  This website does not offer or require visitor login, registration, or password-protected customer profiles. You can browse our product specifications, plant capabilities, and pricing estimates freely without creating an account.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0B2545] font-['Outfit'] mb-1.5">
                  2. Direct WhatsApp Communication & Inquiries
                </h4>
                <p>
                  When you initiate an ice order, request a blast freezing quote, or send a general inquiry, the website formats your message and redirects you to WhatsApp to converse directly with our Harare sales and dispatch desk. We do not permanently store customer inquiry records in an online tracking database.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0B2545] font-['Outfit'] mb-1.5">
                  3. Use of Voluntarily Provided Information
                </h4>
                <p>
                  Any information you choose to share (such as your contact name, business name, phone number, delivery address, or ice volume requirements) is used strictly to communicate with you, process your order, coordinate delivery logistics, and provide customer support. We never sell, lease, or rent customer contact details to third parties or marketing brokers.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0B2545] font-['Outfit'] mb-1.5 flex items-center gap-1.5">
                  <Cookie className="w-3.5 h-3.5 text-slate-500" />
                  <span>4. Cookies & Browser Storage</span>
                </h4>
                <p>
                  This website does not use third-party advertising cookies, cross-site trackers, or third-party analytics services. We only use essential browser storage (<code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">localStorage</code>) to cache catalog information and facility pictures on your device so pages load instantaneously when you return.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0B2545] font-['Outfit'] mb-1.5">
                  5. Contact Us Regarding Privacy
                </h4>
                <p>
                  If you have questions regarding our privacy practices or wish to update any details provided to our dispatch desk, please reach out to us directly at{' '}
                  <a href={`tel:${settings.phone_primary}`} className="text-[#0265B5] font-semibold hover:underline">
                    {settings.phone_primary}
                  </a>{' '}
                  or via email at{' '}
                  <a href={`mailto:${settings.email}`} className="text-[#0265B5] font-semibold hover:underline">
                    {settings.email}
                  </a>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-5">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-slate-700 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  These terms govern your use of the {companyName} website. By accessing the site, you agree to these standard conditions.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0B2545] font-['Outfit'] mb-1.5">
                  1. Acceptable Use
                </h4>
                <p>
                  This website is provided for informational browsing and facilitating genuine commercial inquiries and ice orders with {companyName}. You agree to use the site lawfully and refrain from transmitting disruptive code or attempting unauthorized access to site infrastructure.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0B2545] font-['Outfit'] mb-1.5">
                  2. Accuracy of Website Information & Pricing
                </h4>
                <p>
                  We strive to ensure all information regarding ice cube packaging, solid block dimensions, blast freezing rates, and delivery zones is accurate and up to date. However, product availability, wholesale volume discounts, delivery windows, and operational specifications are subject to confirmation at the time of order based on factory capacity.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0B2545] font-['Outfit'] mb-1.5">
                  3. Order Confirmation & Delivery Terms
                </h4>
                <p>
                  Submitting an order or commercial quote request via the website or WhatsApp initiates a request for service. A binding contract is established only once our dispatch team confirms stock availability, delivery time slot, and accepted payment terms (cash on delivery, Ecocash, or bank transfer).
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0B2545] font-['Outfit'] mb-1.5">
                  4. Intellectual Property & Copyright Notice
                </h4>
                <p>
                  All content, graphics, photographs of the Waterfalls facility, product images, brand marks, and text displayed on this website are the intellectual property of {companyName} (Pvt) Ltd or used with proper authorization. All rights reserved © {currentYear}. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0B2545] font-['Outfit'] mb-1.5">
                  5. External Links
                </h4>
                <p>
                  This website may contain links to external third-party services (such as WhatsApp, Google Maps, or official social media channels). {companyName} is not responsible for the content, security, or terms of third-party platforms.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0B2545] font-['Outfit'] mb-1.5">
                  6. Limitation of Liability & Updates
                </h4>
                <p>
                  To the extent permitted by law, {companyName} is not liable for temporary website downtime or technical delays. We reserve the right to revise website content, service descriptions, and these terms at any time.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info & close */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>
            © {currentYear} {companyName}. All rights reserved.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
