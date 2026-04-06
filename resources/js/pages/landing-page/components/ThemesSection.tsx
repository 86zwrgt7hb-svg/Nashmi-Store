import React from 'react';
import { Monitor, Tablet, Smartphone, Palette, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { getStoreThemes } from '@/data/storeThemes';

interface ThemesSectionProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    title?: string;
    subtitle?: string;
    selected_themes?: string[];
    cta_title?: string;
    cta_description?: string;
    primary_button_text?: string;
    secondary_button_text?: string;
    [key: string]: any;
  };
}

export default function ThemesSection({ settings, sectionData, brandColor = '#6366f1' }: ThemesSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { ref, isVisible } = useScrollAnimation();
  const selectedThemes = sectionData.selected_themes || ['gadgets', 'fashion', 'bakery'];
  const allThemes = getStoreThemes();
  const displayThemes = allThemes.filter(theme => selectedThemes.includes(theme.id));

  const tx = {
    badge: isRTL ? 'تصاميم جميلة' : 'Beautiful Themes',
    title: isRTL ? 'اختر تصميم متجرك المثالي' : (sectionData.title || 'Choose Your Perfect Store Theme'),
    subtitle: isRTL ? 'اختر من مجموعتنا من التصاميم الاحترافية، كل واحد مصمم لفئة أعمال محددة لتحقيق أقصى نجاح.' : (sectionData.subtitle || 'Select from our collection of professionally designed themes, each crafted for specific business categories to maximize your success.'),
    responsive: isRTL ? 'متجاوب' : 'Responsive',
    ctaTitle: isRTL ? 'جاهز لإطلاق إمبراطورية متجرك؟' : (sectionData.cta_title || 'Ready to Launch Your Store Empire?'),
    ctaDesc: isRTL ? 'اختر تصميمك المفضل وابدأ ببناء متجرك الأول في دقائق. غيّر التصميم في أي وقت مع نمو عملك.' : (sectionData.cta_description || 'Pick your favorite theme and start building your first store in minutes. Switch themes anytime as your business grows and evolves.'),
    startBtn: isRTL ? 'ابدأ البناء الآن' : (sectionData.primary_button_text || 'Start Building Now'),
    exploreBtn: isRTL ? 'استكشف جميع التصاميم' : (sectionData.secondary_button_text || 'Explore All Themes'),
  };

  return (
    <section id="themes" className="relative py-20 sm:py-28 overflow-hidden" ref={ref} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-gray-200/60 bg-white/60 backdrop-blur-sm text-gray-600">
            <Palette className="w-4 h-4" style={{ color: brandColor }} />
            {tx.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">{tx.title}</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{tx.subtitle}</p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {displayThemes.map((theme, index) => (
            <div key={theme.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-2" style={{ transitionDelay: `${index * 100}ms` }}>
              <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img loading="lazy" src={theme.thumbnail} alt={`${theme.name} theme`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f8fafc"/><text x="50%" y="50%" font-family="system-ui" font-size="16" fill="#94a3b8" text-anchor="middle" dy=".3em">${theme.name}</text></svg>`)}`; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{theme.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{theme.description}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Monitor className="w-4 h-4" /><Tablet className="w-3.5 h-3.5" /><Smartphone className="w-3 h-3" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{tx.responsive}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 -mr-32 -mt-32" style={{ background: `radial-gradient(circle, ${brandColor}, transparent)` }}></div>
            <div className="relative text-center max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{tx.ctaTitle}</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">{tx.ctaDesc}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/register" className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5" style={{ background: `linear-gradient(135deg, ${brandColor}, var(--secondary-color, #8b5cf6))`, boxShadow: `0 8px 30px -8px ${brandColor}50` }}>
                  {tx.startBtn}
                  <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                </a>
                <a href="#features" className="inline-flex items-center justify-center px-8 py-3.5 border-2 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-50" style={{ borderColor: `${brandColor}30`, color: brandColor }}>
                  {tx.exploreBtn}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
