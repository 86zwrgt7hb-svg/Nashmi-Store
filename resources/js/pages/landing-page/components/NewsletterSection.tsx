import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Mail, CheckCircle, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NewsletterSectionProps {
  brandColor?: string;
  flash?: {
    success?: string;
    error?: string;
  };
  settings?: any;
  sectionData?: {
    title?: string;
    subtitle?: string;
    privacy_text?: string;
    benefits?: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
}

export default function NewsletterSection({ flash, settings, sectionData, brandColor = '#6366f1' }: NewsletterSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({ email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('landing-page.subscribe'), {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitted(true);
        reset();
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    });
  };

  const tx = {
    title: isRTL ? 'ابقَ على اطلاع' : (sectionData?.title || 'Stay Updated'),
    subtitle: isRTL ? 'اشترك في نشرتنا البريدية لتحصل على آخر التحديثات والنصائح والعروض الحصرية.' : (sectionData?.subtitle || 'Subscribe to our newsletter for the latest updates, tips, and exclusive offers.'),
    placeholder: isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email address',
    subscribe: isRTL ? 'اشترك' : 'Subscribe',
    thanks: isRTL ? 'شكراً لاشتراكك!' : 'Thank you for subscribing!',
  };

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${brandColor}08, transparent 50%, var(--secondary-color, #8b5cf6)08)` }}></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${brandColor}15, var(--secondary-color, #8b5cf6)15)` }}>
            <Mail className="w-8 h-8" style={{ color: brandColor }} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">{tx.title}</h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed">{tx.subtitle}</p>

          {isSubmitted || flash?.success ? (
            <div className="flex items-center justify-center gap-3 py-4 px-6 bg-green-50 rounded-xl text-green-700 font-medium">
              <CheckCircle className="w-5 h-5" />
              {flash?.success || tx.thanks}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder={tx.placeholder} className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': `${brandColor}40` } as any} required dir="ltr" />
                {errors.email && <p className={`text-red-500 text-xs mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.email}</p>}
              </div>
              <button type="submit" disabled={processing} className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50" style={{ background: `linear-gradient(135deg, ${brandColor}, var(--secondary-color, #8b5cf6))`, boxShadow: `0 6px 20px -5px ${brandColor}40` }}>
                <Send className="w-4 h-4" />
                {tx.subscribe}
              </button>
            </form>
          )}

          {sectionData?.privacy_text && (
            <p className="text-xs text-gray-400 mt-4">{sectionData.privacy_text}</p>
          )}
        </div>
      </div>
    </section>
  );
}
