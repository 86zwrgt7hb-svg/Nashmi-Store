import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  brandColor?: string;
  faqs: Faq[];
  settings: any;
  sectionData: {
    title?: string;
    subtitle?: string;
    contact_text?: string;
    [key: string]: any;
  };
}

const defaultFaqsEN: Faq[] = [
  { id: 1, question: 'How does multi-store management work?', answer: 'Our platform allows you to create and manage multiple online stores from a single dashboard. Each store can have its own theme, products, and settings while sharing a unified management interface.' },
  { id: 2, question: 'Can I use different themes for each store?', answer: 'Yes! Each store can have its own unique theme. We offer 7+ professionally designed themes that you can switch between at any time without losing your data.' },
  { id: 3, question: 'What payment gateways are supported?', answer: 'We support 30+ payment gateways including Stripe, PayPal, Razorpay, and many more. You can configure different payment methods for each store.' },
  { id: 4, question: 'How does inventory management work?', answer: 'Our inventory management system lets you track stock levels, set alerts, and manage products across all your stores from one centralized dashboard.' },
];

const defaultFaqsAR: Faq[] = [
  { id: 1, question: 'كيف تعمل إدارة المتاجر المتعددة؟', answer: 'تتيح لك منصتنا إنشاء وإدارة متاجر إلكترونية متعددة من لوحة تحكم واحدة. كل متجر يمكن أن يكون له تصميمه الخاص ومنتجاته وإعداداته مع مشاركة واجهة إدارة موحدة.' },
  { id: 2, question: 'هل يمكنني استخدام تصاميم مختلفة لكل متجر؟', answer: 'نعم! كل متجر يمكن أن يكون له تصميم فريد. نقدم أكثر من 7 تصاميم احترافية يمكنك التبديل بينها في أي وقت دون فقدان بياناتك.' },
  { id: 3, question: 'ما هي بوابات الدفع المدعومة؟', answer: 'ندعم أكثر من 30 بوابة دفع بما في ذلك Stripe وPayPal وRazorpay وغيرها الكثير. يمكنك تكوين طرق دفع مختلفة لكل متجر.' },
  { id: 4, question: 'كيف تعمل إدارة المخزون؟', answer: 'نظام إدارة المخزون لدينا يتيح لك تتبع مستويات المخزون وتعيين التنبيهات وإدارة المنتجات عبر جميع متاجرك من لوحة تحكم مركزية واحدة.' },
];

export default function FaqSection({ faqs, settings, sectionData, brandColor = '#6366f1' }: FaqSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const displayFaqs = faqs?.length ? faqs : (isRTL ? defaultFaqsAR : defaultFaqsEN);

  const tx = {
    badge: isRTL ? 'الأسئلة الشائعة' : 'FAQ',
    title: isRTL ? 'الأسئلة الشائعة' : (sectionData.title || 'Frequently Asked Questions'),
    subtitle: isRTL ? 'لديك أسئلة؟ لدينا الإجابات.' : (sectionData.subtitle || "Got questions? We've got answers."),
    contactSupport: isRTL ? 'تواصل مع الدعم' : 'Contact Support',
  };

  return (
    <section id="faq" className="relative py-20 sm:py-28 overflow-hidden" ref={ref} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50/30"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-gray-200/60 bg-white/60 backdrop-blur-sm text-gray-600">
            <HelpCircle className="w-4 h-4" style={{ color: brandColor }} />
            {tx.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">{tx.title}</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{tx.subtitle}</p>
        </div>

        <div className={`space-y-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {displayFaqs.map((faq, index) => (
            <div key={faq.id} className={`bg-white rounded-2xl border transition-all duration-300 ${openIndex === index ? 'border-transparent shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]' : 'border-gray-100 hover:border-gray-200'}`}>
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className={`w-full flex items-center justify-between p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                <span className={`text-base font-semibold text-gray-900 ${isRTL ? 'pl-4' : 'pr-4'}`}>{faq.question}</span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'rotate-180' : ''}`} style={{ backgroundColor: openIndex === index ? `${brandColor}12` : '#f3f4f6' }}>
                  <ChevronDown className="w-4 h-4" style={{ color: openIndex === index ? brandColor : '#9ca3af' }} />
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent mb-4"></div>
                  <p className="text-gray-500 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sectionData.contact_text && (
          <div className="text-center mt-12">
            <p className="text-gray-500">
              {sectionData.contact_text}{' '}
              <a href="#contact" className="font-semibold hover:underline" style={{ color: brandColor }}>{tx.contactSupport}</a>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
