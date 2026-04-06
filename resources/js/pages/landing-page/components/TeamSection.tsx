import React from 'react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { UserPlus, Palette, Package, Rocket, ArrowRight, CheckCircle } from 'lucide-react';

interface TeamSectionProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    title?: string;
    subtitle?: string;
    members?: any[];
    [key: string]: any;
  };
}

const steps = [
  {
    icon: UserPlus,
    number: '01',
    titleKey: 'Create Your Account',
    titleAr: 'أنشئ حسابك',
    descKey: 'Sign up in seconds with your email. No credit card required to get started.',
    descAr: 'سجل بثوانٍ بإيميلك. لا حاجة لبطاقة ائتمان للبدء.',
    color: '#6366f1',
  },
  {
    icon: Palette,
    number: '02',
    titleKey: 'Choose Your Theme',
    titleAr: 'اختر تصميمك',
    descKey: 'Pick from 7+ professionally designed themes that match your business style and brand.',
    descAr: 'اختر من أكثر من 7 تصاميم احترافية تناسب نشاطك التجاري وعلامتك.',
    color: '#8b5cf6',
  },
  {
    icon: Package,
    number: '03',
    titleKey: 'Add Your Products',
    titleAr: 'أضف منتجاتك',
    descKey: 'Upload products, set prices, manage inventory — all from one powerful dashboard.',
    descAr: 'ارفع منتجاتك، حدد الأسعار، وأدر المخزون — كل شيء من لوحة تحكم واحدة.',
    color: '#ec4899',
  },
  {
    icon: Rocket,
    number: '04',
    titleKey: 'Launch & Grow',
    titleAr: 'أطلق وانمُ',
    descKey: 'Go live with your store and start selling. Use analytics to grow your business.',
    descAr: 'أطلق متجرك وابدأ البيع. استخدم التحليلات لتنمية أعمالك.',
    color: '#14b8a6',
  },
];

export default function TeamSection({ settings, sectionData, brandColor = '#6366f1' }: TeamSectionProps) {
  const { t, i18n } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();
  const isRTL = i18n.language === 'ar' || document.documentElement.dir === 'rtl';

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/30 to-white"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-5 blur-[80px]" style={{ background: brandColor }}></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full opacity-5 blur-[80px]" style={{ background: 'var(--secondary-color, #8b5cf6)' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-gray-200/60 bg-white/60 backdrop-blur-sm text-gray-600">
            <Rocket className="w-4 h-4" style={{ color: brandColor }} />
            {t('How It Works')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">
            {isRTL ? 'ابدأ متجرك في 4 خطوات' : (sectionData.title || 'Launch Your Store in 4 Steps')}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {isRTL ? 'من التسجيل إلى أول عملية بيع — بسيط وسريع' : (sectionData.subtitle || 'From sign-up to your first sale — simple and fast')}
          </p>
        </div>

        {/* Steps Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {steps.map((step, index) => {
            const IconComp = step.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-7 border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 text-center"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white shadow-md" style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)` }}>
                    {step.number}
                  </span>
                </div>

                {/* Connector line (hidden on mobile, shown on lg) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 w-8 z-10">
                    <ArrowRight className="w-5 h-5 text-gray-300" style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                  </div>
                )}

                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 mt-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ background: `${step.color}12` }}>
                  <IconComp className="w-7 h-7" style={{ color: step.color }} />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {isRTL ? step.titleAr : t(step.titleKey)}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {isRTL ? step.descAr : t(step.descKey)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-14 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <a
            href="/register"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-base transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            style={{
              background: `linear-gradient(135deg, ${brandColor}, var(--secondary-color, #8b5cf6))`,
              boxShadow: `0 10px 40px -10px ${brandColor}60`
            }}
          >
            {isRTL ? 'ابدأ الآن مجاناً' : t('Start Free Now')}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
          </a>
          <div className="flex items-center justify-center gap-6 mt-5 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" />{isRTL ? 'بدون بطاقة ائتمان' : t('No credit card')}</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" />{isRTL ? 'إعداد بدقائق' : t('Setup in minutes')}</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" />{isRTL ? 'إلغاء بأي وقت' : t('Cancel anytime')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
