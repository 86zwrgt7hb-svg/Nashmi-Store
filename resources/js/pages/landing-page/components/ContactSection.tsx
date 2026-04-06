import React from 'react';
import { useForm } from '@inertiajs/react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ContactSectionProps {
  brandColor?: string;
  flash?: {
    success?: string;
    error?: string;
  };
  settings?: {
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
  };
  sectionData?: {
    title?: string;
    subtitle?: string;
    form_title?: string;
    info_title?: string;
    info_description?: string;
    faqs?: Array<{ question: string; answer: string }>;
  };
}

export default function ContactSection({ flash, settings, sectionData, brandColor = '#6366f1' }: ContactSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { data, setData, post, processing, errors, reset } = useForm({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('landing-page.contact'), {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitted(true);
        reset();
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    });
  };

  const tx = {
    badge: isRTL ? 'تواصل معنا' : 'Contact Us',
    title: isRTL ? 'تواصل معنا' : (sectionData?.title || 'Get in Touch'),
    subtitle: isRTL ? 'لديك أسئلة؟ نحن هنا لمساعدتك في النجاح.' : (sectionData?.subtitle || 'Have questions? We are here to help you succeed.'),
    infoTitle: isRTL ? 'معلومات التواصل' : (sectionData?.info_title || 'Contact Information'),
    infoDesc: isRTL ? 'تواصل معنا عبر أي من هذه القنوات.' : (sectionData?.info_description || 'Reach out to us through any of these channels.'),
    formTitle: isRTL ? 'أرسل لنا رسالة' : (sectionData?.form_title || 'Send us a Message'),
    email: isRTL ? 'البريد الإلكتروني' : 'Email',
    phone: isRTL ? 'الهاتف' : 'Phone',
    address: isRTL ? 'العنوان' : 'Address',
    fullName: isRTL ? 'الاسم الكامل' : 'Full Name',
    emailAddress: isRTL ? 'البريد الإلكتروني' : 'Email Address',
    subject: isRTL ? 'الموضوع' : 'Subject',
    message: isRTL ? 'الرسالة' : 'Message',
    namePlaceholder: isRTL ? 'اسمك الكامل' : 'Your full name',
    subjectPlaceholder: isRTL ? 'ما هو الموضوع؟' : "What's this about?",
    messagePlaceholder: isRTL ? 'أخبرنا المزيد عن استفسارك...' : 'Tell us more about your inquiry...',
    sendMessage: isRTL ? 'إرسال الرسالة' : 'Send Message',
    thanks: isRTL ? 'شكراً! سنتواصل معك قريباً.' : 'Thank you! We will get back to you soon.',
  };

  const contactInfo = [
    { icon: Mail, label: tx.email, value: settings?.contact_email || 'support@nashmistore.com' },
    { icon: Phone, label: tx.phone, value: settings?.contact_phone || '+962 7XX XXX XXX' },
    { icon: MapPin, label: tx.address, value: settings?.contact_address || 'Amman, Jordan' },
  ];

  return (
    <section id="contact" className="relative py-20 sm:py-28 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/30 to-white"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-gray-200/60 bg-white/60 backdrop-blur-sm text-gray-600">
            <MessageSquare className="w-4 h-4" style={{ color: brandColor }} />
            {tx.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">{tx.title}</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{tx.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tx.infoTitle}</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">{tx.infoDesc}</p>
              <div className="space-y-5">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${brandColor}12, var(--secondary-color, #8b5cf6)12)` }}>
                      <info.icon className="w-5 h-5" style={{ color: brandColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{info.label}</p>
                      <p className="text-sm text-gray-700 font-medium mt-0.5" dir="ltr">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{tx.formTitle}</h3>

              {isSubmitted || flash?.success ? (
                <div className="flex items-center gap-3 py-6 px-6 bg-green-50 rounded-xl text-green-700 font-medium">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  {flash?.success || tx.thanks}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{tx.fullName} *</label>
                      <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder={tx.namePlaceholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white focus:border-transparent transition-all text-sm" style={{ '--tw-ring-color': `${brandColor}30` } as any} required />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{tx.emailAddress} *</label>
                      <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white focus:border-transparent transition-all text-sm" style={{ '--tw-ring-color': `${brandColor}30` } as any} required dir="ltr" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{tx.subject} *</label>
                    <input type="text" value={data.subject} onChange={e => setData('subject', e.target.value)} placeholder={tx.subjectPlaceholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white focus:border-transparent transition-all text-sm" style={{ '--tw-ring-color': `${brandColor}30` } as any} required />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{tx.message} *</label>
                    <textarea value={data.message} onChange={e => setData('message', e.target.value)} placeholder={tx.messagePlaceholder} rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white focus:border-transparent transition-all text-sm resize-none" style={{ '--tw-ring-color': `${brandColor}30` } as any} required />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>
                  <button type="submit" disabled={processing} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50" style={{ background: `linear-gradient(135deg, ${brandColor}, var(--secondary-color, #8b5cf6))`, boxShadow: `0 6px 20px -5px ${brandColor}40` }}>
                    <Send className="w-4 h-4" />
                    {tx.sendMessage}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
