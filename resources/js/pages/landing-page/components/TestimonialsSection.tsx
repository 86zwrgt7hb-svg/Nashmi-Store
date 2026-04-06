import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '@/utils/image-helper';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar?: string;
  rating: number;
}

interface TestimonialsSectionProps {
  brandColor?: string;
  testimonials: Testimonial[];
  settings: any;
  sectionData: {
    title?: string;
    subtitle?: string;
    [key: string]: any;
  };
}

const defaultTestimonialsEN: Testimonial[] = [
  { id: 1, name: 'Ahmed Al-Rashid', role: 'Store Owner', content: 'This platform transformed my business. I went from one store to five in just three months. The multi-store management is incredibly intuitive.', rating: 5 },
  { id: 2, name: 'Sarah Mitchell', role: 'E-commerce Manager', content: 'The themes are beautiful and the customization options are endless. My customers love the shopping experience on our stores.', rating: 5 },
  { id: 3, name: 'David Chen', role: 'Entrepreneur', content: 'Best investment I have made for my business. The analytics and reporting features help me make data-driven decisions every day.', rating: 5 },
];

const defaultTestimonialsAR: Testimonial[] = [
  { id: 1, name: 'أحمد الراشد', role: 'صاحب متجر', content: 'هذه المنصة غيّرت عملي بالكامل. انتقلت من متجر واحد إلى خمسة متاجر في ثلاثة أشهر فقط. إدارة المتاجر المتعددة سهلة جداً.', rating: 5 },
  { id: 2, name: 'سارة أحمد', role: 'مديرة تجارة إلكترونية', content: 'التصاميم جميلة وخيارات التخصيص لا نهاية لها. عملائي يحبون تجربة التسوق في متاجرنا.', rating: 5 },
  { id: 3, name: 'خالد محمد', role: 'رائد أعمال', content: 'أفضل استثمار قمت به لعملي. ميزات التحليلات والتقارير تساعدني في اتخاذ قرارات مبنية على البيانات كل يوم.', rating: 5 },
];

export default function TestimonialsSection({ testimonials, settings, sectionData, brandColor = '#6366f1' }: TestimonialsSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { ref, isVisible } = useScrollAnimation();
  const displayTestimonials = testimonials?.length ? testimonials : (isRTL ? defaultTestimonialsAR : defaultTestimonialsEN);

  const tx = {
    badge: isRTL ? 'آراء العملاء' : 'Testimonials',
    title: isRTL ? 'ماذا يقول أصحاب المتاجر' : (sectionData.title || 'What Our Store Owners Say'),
    subtitle: isRTL ? 'قصص نجاح حقيقية من تجار نشمي ستور حول العالم.' : (sectionData.subtitle || 'Real success stories from Nashmi Store merchants worldwide.'),
  };

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" ref={ref} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${brandColor}05, transparent 40%, var(--secondary-color, #8b5cf6)05)` }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-gray-200/60 bg-white/60 backdrop-blur-sm text-gray-600">
            <Star className="w-4 h-4" style={{ color: brandColor }} />
            {tx.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">{tx.title}</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{tx.subtitle}</p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {displayTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1">
              <Quote className="w-8 h-8 mb-4 opacity-20" style={{ color: brandColor }} />
              <p className="text-gray-600 leading-relaxed mb-6 text-[15px]">"{testimonial.content}"</p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {testimonial.avatar ? (
                  <img loading="lazy" src={getImageUrl(testimonial.avatar)} alt={testimonial.name} className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: `linear-gradient(135deg, ${brandColor}, var(--secondary-color, #8b5cf6))` }}>
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500">{testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
