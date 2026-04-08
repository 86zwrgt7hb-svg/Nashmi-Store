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
  { id: 1, question: 'What does "Lifetime Store" mean exactly?', answer: 'It means you pay 499 JOD once and own your online store forever. This includes free hosting on our servers, continuous software updates, and dedicated technical support for the lifetime of your store. No monthly or yearly fees ever.' },
  { id: 2, question: 'Is there a free trial before I pay?', answer: 'Yes! You get a full 7-day free trial with all features unlocked. No credit card required. You can add products, customize your theme, and test everything. After 7 days, your store goes offline until you activate it with the lifetime payment.' },
  { id: 3, question: 'What happens to my store after the trial ends?', answer: 'If you don\'t activate the lifetime plan within 7 days, your store goes offline (not visible to customers), but all your data, products, and settings are safely preserved. You can activate it anytime by paying the 499 JOD lifetime fee.' },
  { id: 4, question: 'Can I have multiple stores on one account?', answer: 'Yes! You can manage multiple stores from a single account. Each store requires its own lifetime license (499 JOD per store). All stores are managed from one centralized dashboard.' },
  { id: 5, question: 'What payment methods do you accept?', answer: 'We support 30+ payment gateways including Stripe, PayPal, Razorpay, and many local payment methods. Your customers can pay using credit cards, bank transfers, and more.' },
  { id: 6, question: 'Is there a limit on products or storage?', answer: 'No! Everything is unlimited — products, orders, customers, and storage. The only limit is a 5MB maximum per image file to ensure optimal performance. You can upload as many images as you need.' },
  { id: 7, question: 'How does this compare to Shopify or other platforms?', answer: 'Shopify charges $29-$299/month, which adds up to $348-$3,588/year. With Nashmi Store, you pay 499 JOD once (approximately $700) and never pay again. Over 5 years, you save $1,040 to $17,240 compared to Shopify.' },
  { id: 8, question: 'What if I need help setting up my store?', answer: 'Our dedicated support team is available to help you every step of the way. From choosing a theme to configuring payment gateways, we\'re here for you — for life. You also get access to detailed documentation and video tutorials.' },
];

const defaultFaqsAR: Faq[] = [
  { id: 1, question: 'ماذا يعني "متجر مدى الحياة" بالضبط؟', answer: 'يعني أنك تدفع 499 دينار مرة واحدة وتمتلك متجرك الإلكتروني للأبد. هذا يشمل استضافة مجانية على سيرفراتنا، تحديثات برمجية مستمرة، ودعم فني مخصص مدى حياة متجرك. بدون أي رسوم شهرية أو سنوية.' },
  { id: 2, question: 'هل هناك تجربة مجانية قبل الدفع؟', answer: 'نعم! تحصل على تجربة مجانية كاملة لمدة 7 أيام مع جميع الميزات مفتوحة. بدون بطاقة ائتمان. يمكنك إضافة منتجات وتخصيص التصميم واختبار كل شيء. بعد 7 أيام، يصبح متجرك غير متاح حتى تفعّله بدفعة مدى الحياة.' },
  { id: 3, question: 'ماذا يحدث لمتجري بعد انتهاء التجربة؟', answer: 'إذا لم تفعّل خطة مدى الحياة خلال 7 أيام، يصبح متجرك غير متاح للعملاء (offline)، لكن جميع بياناتك ومنتجاتك وإعداداتك محفوظة بأمان. يمكنك تفعيله في أي وقت بدفع 499 دينار.' },
  { id: 4, question: 'هل يمكنني إنشاء عدة متاجر من حساب واحد؟', answer: 'نعم! يمكنك إدارة عدة متاجر من حساب واحد. كل متجر يحتاج رخصة مدى الحياة خاصة به (499 دينار لكل متجر). جميع المتاجر تُدار من لوحة تحكم مركزية واحدة.' },
  { id: 5, question: 'ما هي طرق الدفع المتاحة؟', answer: 'ندعم أكثر من 30 بوابة دفع بما في ذلك Stripe وPayPal وRazorpay والعديد من طرق الدفع المحلية. عملاؤك يمكنهم الدفع بالبطاقات الائتمانية والتحويلات البنكية وغيرها.' },
  { id: 6, question: 'هل هناك حد للمنتجات أو المساحة التخزينية؟', answer: 'لا! كل شيء غير محدود — المنتجات والطلبات والعملاء والمساحة التخزينية. الحد الوحيد هو 5 ميجابايت كحد أقصى لكل صورة لضمان الأداء الأمثل. يمكنك رفع عدد غير محدود من الصور.' },
  { id: 7, question: 'كيف يقارن هذا مع Shopify أو المنصات الأخرى؟', answer: 'Shopify يكلفك 29-299$ شهرياً، أي 348-3,588$ سنوياً. مع نشمي ستور، تدفع 499 دينار مرة واحدة (حوالي 700$) ولا تدفع مرة أخرى أبداً. خلال 5 سنوات، توفر من 1,040$ إلى 17,240$ مقارنة بـ Shopify.' },
  { id: 8, question: 'ماذا لو احتجت مساعدة في إعداد متجري؟', answer: 'فريق الدعم المخصص لدينا متاح لمساعدتك في كل خطوة. من اختيار التصميم إلى إعداد بوابات الدفع، نحن هنا من أجلك — مدى الحياة. كما تحصل على وثائق تفصيلية ودروس فيديو.' },
];

export default function FaqSection({ faqs, settings, sectionData, brandColor = '#6366f1' }: FaqSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const displayFaqs = faqs?.length ? faqs : (isRTL ? defaultFaqsAR : defaultFaqsEN);

  const tx = {
    badge: isRTL ? 'الأسئلة الشائعة' : 'FAQ',
    title: isRTL ? 'كل ما تحتاج معرفته' : 'Everything You Need to Know',
    subtitle: isRTL ? 'أجوبة على أهم الأسئلة حول عرض "متجر مدى الحياة"' : 'Answers to the most important questions about our "Lifetime Store" offer',
    contactSupport: isRTL ? 'تواصل مع الدعم' : 'Contact Support',
    stillQuestions: isRTL ? 'لا زال عندك أسئلة؟' : 'Still have questions?',
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

        {/* Always show contact CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            {tx.stillQuestions}{' '}
            <a href="#contact" className="font-semibold hover:underline" style={{ color: brandColor }}>{tx.contactSupport}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
