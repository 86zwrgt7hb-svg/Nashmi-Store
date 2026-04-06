import React from 'react';
import { Shield, Zap, HeartHandshake, TrendingUp, Clock, Award } from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';

interface WhyChooseUsProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    title?: string;
    subtitle?: string;
    reasons?: Array<{ title: string; description: string; icon: string }>;
    [key: string]: any;
  };
}

const iconMap: Record<string, React.ComponentType<any>> = {
  shield: Shield, zap: Zap, heart: HeartHandshake, trending: TrendingUp, clock: Clock, award: Award,
};

const defaultReasonsEN = [
  { title: 'Multi-Store Architecture', description: 'Manage unlimited stores from one account with centralized dashboard, inventory, and customer management.', icon: 'shield' },
  { title: 'Professional Themes', description: 'Choose from 7+ industry-specific themes designed to maximize conversions and user experience.', icon: 'zap' },
  { title: 'Advanced Analytics', description: 'Get detailed insights into sales, customers, and performance across all your stores in real-time.', icon: 'trending' },
];

const defaultReasonsAR = [
  { title: 'بنية متاجر متعددة', description: 'أدر متاجر غير محدودة من حساب واحد مع لوحة تحكم مركزية وإدارة مخزون وعملاء.', icon: 'shield' },
  { title: 'تصاميم احترافية', description: 'اختر من +7 تصاميم مخصصة لقطاعات مختلفة مصممة لزيادة التحويلات وتجربة المستخدم.', icon: 'zap' },
  { title: 'تحليلات متقدمة', description: 'احصل على رؤى تفصيلية حول المبيعات والعملاء والأداء عبر جميع متاجرك بشكل فوري.', icon: 'trending' },
];

export default function WhyChooseUs({ settings, sectionData, brandColor = '#6366f1' }: WhyChooseUsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { ref, isVisible } = useScrollAnimation();
  const reasons = isRTL ? defaultReasonsAR : (sectionData.reasons?.length ? sectionData.reasons : defaultReasonsEN);

  const tx = {
    badge: isRTL ? 'لماذا نحن' : 'Why Us',
    title: isRTL ? 'لماذا تختار نشمي ستور؟' : (sectionData.title || 'Why Choose Nashmi Store?'),
    subtitle: isRTL ? 'الحل الشامل للتجارة الإلكترونية متعددة المتاجر المصمم لرواد الأعمال الطموحين والأعمال النامية.' : (sectionData.subtitle || 'The complete multi-store e-commerce solution designed for ambitious entrepreneurs and growing businesses.'),
  };

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" ref={ref} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${brandColor}08, transparent 50%, var(--secondary-color, #8b5cf6)08)` }}></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-gray-200/60 bg-white/60 backdrop-blur-sm text-gray-600">
            <Award className="w-4 h-4" style={{ color: brandColor }} />
            {tx.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">{tx.title}</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{tx.subtitle}</p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {reasons.map((reason, index) => {
            const IconComponent = iconMap[reason.icon] || Award;
            return (
              <div key={index} className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-100/80 hover:border-transparent transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ background: `linear-gradient(135deg, ${brandColor}12, var(--secondary-color, #8b5cf6)12)` }}>
                  <IconComponent className="w-7 h-7" style={{ color: brandColor }} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{reason.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
