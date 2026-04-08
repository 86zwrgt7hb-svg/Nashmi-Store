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
  { id: 1, name: 'Ahmed Al-Rashid', role: 'Fashion Store Owner', content: 'I was paying $79/month on another platform. Switching to Nashmi and paying once saved me thousands. My store runs perfectly and I never worry about monthly bills anymore.', rating: 5 },
  { id: 2, name: 'Sarah Mitchell', role: 'E-commerce Entrepreneur', content: 'The 7-day trial convinced me instantly. The themes are stunning, the dashboard is intuitive, and knowing I own my store forever gives me peace of mind. Best investment ever.', rating: 5 },
  { id: 3, name: 'David Chen', role: 'Multi-Store Owner', content: 'I now run 3 stores from one account. Each with its own lifetime license. The analytics are powerful and the support team is always there when I need them. Truly unlimited.', rating: 5 },
];

const defaultTestimonialsAR: Testimonial[] = [
  { id: 1, name: 'أحمد الراشد', role: 'صاحب متجر أزياء', content: 'كنت أدفع 79$ شهرياً على منصة أخرى. الانتقال لنشمي والدفع مرة واحدة وفّر لي آلاف الدنانير. متجري يعمل بشكل ممتاز ولم أعد أقلق من الفواتير الشهرية.', rating: 5 },
  { id: 2, name: 'سارة أحمد', role: 'رائدة أعمال إلكترونية', content: 'التجربة المجانية لـ 7 أيام أقنعتني فوراً. التصاميم مذهلة، لوحة التحكم سهلة، ومعرفة أنني أملك متجري للأبد تمنحني راحة بال. أفضل استثمار على الإطلاق.', rating: 5 },
  { id: 3, name: 'خالد محمد', role: 'صاحب متاجر متعددة', content: 'الآن أدير 3 متاجر من حساب واحد. كل متجر برخصة مدى الحياة خاصة به. التحليلات قوية وفريق الدعم دائماً موجود عندما أحتاجهم. غير محدود فعلاً.', rating: 5 },
];

export default function TestimonialsSection({ testimonials, settings, sectionData, brandColor = '#6366f1' }: TestimonialsSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { ref, isVisible } = useScrollAnimation();
  const displayTestimonials = testimonials?.length ? testimonials : (isRTL ? defaultTestimonialsAR : defaultTestimonialsEN);

  const tx = {
    badge: isRTL ? 'آراء العملاء' : 'Testimonials',
    title: isRTL ? 'تجار اختاروا نشمي ستور' : 'Merchants Who Chose Nashmi Store',
    subtitle: isRTL ? 'اكتشف لماذا يفضّل التجار الدفع مرة واحدة وامتلاك متاجرهم للأبد.' : 'Discover why merchants prefer to pay once and own their stores forever.',
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
