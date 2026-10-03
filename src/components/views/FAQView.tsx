import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Phone,
  MessageCircle,
  Sparkles,
  FileText
} from 'lucide-react';
import { FAQ, WebsiteSettings } from '../../types/index.ts';

interface FAQViewProps {
  faqs: FAQ[];
  settings: WebsiteSettings;
  onOpenQuoteModal: () => void;
  onOpenOrderModal: () => void;
}

export const FAQView: React.FC<FAQViewProps> = ({
  faqs,
  settings,
  onOpenQuoteModal,
  onOpenOrderModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const cats = ['All'];
    faqs.forEach((f) => {
      if (f.category && !cats.includes(f.category)) {
        cats.push(f.category);
      }
    });
    return cats;
  }, [faqs]);

  const filteredFAQs = useMemo(() => {
    return faqs.filter((f) => {
      const matchesCategory =
        selectedCategory === 'All' || f.category === selectedCategory;
      const matchesSearch =
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent('Hello Crystal Ice Zimbabwe, I have a question regarding commercial ice delivery or blast freezing.')}`;

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-700 bg-cyan-100/60 px-3 py-1 rounded-full border border-cyan-200">
            Answers & Operations
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-['Outfit'] mt-3">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Everything you need to know about our crystal ice specifications, refrigerated delivery schedule, commercial pricing, and emergency runs.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-8 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-3 mb-16">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
              <p className="text-xs text-slate-500">No questions match your search query.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-2 text-xs text-cyan-700 font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <details
                key={faq.id}
                id={`faq-item-${faq.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 [&_summary::-webkit-details-marker]:hidden open:ring-1 open:ring-cyan-500/30 open:shadow-md"
              >
                <summary className="flex cursor-pointer items-center justify-between text-left font-bold text-slate-900 text-sm sm:text-base">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                  <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-cyan-600">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed pl-5">
                  {faq.answer}
                </div>
              </details>
            ))
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-black font-['Outfit']">
              Have a Specific Commercial Question?
            </h3>
            <p className="text-xs text-slate-300">
              Our dispatch desk and accounts managers are available 24/7.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href={`tel:${settings.phone_primary}`}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Dispatch</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
