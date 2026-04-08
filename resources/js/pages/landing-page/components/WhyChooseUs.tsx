import React from 'react';
import { Shield, Zap, HeartHandshake, TrendingUp, Clock, Award, Infinity, DollarSign, Rocket } from 'lucide-react';
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
  shield: Shield, zap: Zap, heart: HeartHandshake, trending: TrendingUp, clock: Clock, award: Award, infinity: Infinity, dollar: DollarSign, rocket: Rocket,
};

const defaultReasonsEN = [
  { title: 'Save Thousands Over Time', description: 'Other platforms charge $29-$299/month. With Nashmi, you pay 499 JOD once and save thousands over the years. No recurring bills ever.', icon: 'dollar' },
  { title: 'No Limits, No Surprises', description: 'Unlimited products, orders, customers, and storage. Other platforms charge more as you grow. We don\'t.', icon: 'infinity' },
  { title: 'Launch in Minutes', description: 'Your store is ready in minutes with professional themes, payment gateways, and everything pre-configured. Just add your products and start selling.', icon: 'rocket' },
  { title: 'Free Hosting Forever', description: 'We handle all the server infrastructure, security, and maintenance. You focus on growing your business.', icon: 'shield' },
  { title: 'Lifetime Updates & Support', description: 'Get every new feature, security patch, and improvement automatically. Plus dedicated support whenever you need it.', icon: 'heart' },
  { title: '7 Days Free Trial', description: 'Try everything for free for 7 days. No credit card required. Fall in love with your store, then make it permanent.', icon: 'clock' },
];

const defaultReasonsAR = [
  { title: 'وفّر آلاف الدنانير', description: 'المنصات الأخرى تكلفك 29-299$ شهرياً. مع نشمي، ادفع 499 دينار مرة واحدة ووفّر آلاف على مر السنين. بدون فواتير متكررة.', icon: 'dollar' },
  { title: 'بدون حدود، بدون مفاجآت', description: 'منتجات غير محدودة، طلبات، عملاء، ومساحة تخزين. المنصات الأخرى تزيد الأسعار كلما نمى عملك. نحن لا نفعل ذلك.', icon: 'infinity' },
  { title: 'أطلق متجرك بدقائق', description: 'متجرك جاهز بدقائق مع تصاميم احترافية وبوابات دفع وكل شيء مُعد مسبقاً. فقط أضف منتجاتك وابدأ البيع.', icon: 'rocket' },
  { title: 'استضافة مجانية للأبد', description: 'نحن نتولى كل البنية التحتية والأمان والصيانة. أنت ركّز على تنمية عملك.', icon: 'shield' },
  { title: 'تحديثات ودعم مدى الحياة', description: 'احصل على كل ميزة جديدة وتحديث أمني وتحسين تلقائياً. بالإضافة لدعم فني مخصص متى احتجته.', icon: 'heart' },
  { title: '7 أيام تجربة مجانية', description: 'جرّب كل شيء مجاناً لمدة 7 أيام. بدون بطاقة ائتمان. أحب متجرك، ثم اجعله دائماً.', icon: 'clock' },
];

export default function WhyChooseUs({ settings, sectionData, brandColor = '#6366f1' }: WhyChooseUsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { ref, isVisible } = useScrollAnimation();
  const reasons = isRTL ? defaultReasonsAR : defaultReasonsEN;

  const tx = {
    badge: isRTL ? 'لماذا نشمي ستور؟' : 'Why Nashmi Store?',
    title: isRTL ? 'لماذا يختار التجار نشمي ستور؟' : 'Why Merchants Choose Nashmi Store?',
    subtitle: isRTL ? 'الحل الوحيد للتجارة الإلكترونية الذي تدفع له مرة واحدة وتمتلكه مدى الحياة.' : 'The only e-commerce solution you pay for once and own forever.',
  };

  const gradientPairs = [
    ['#f59e0b', '#fbbf24'], ['#8b5cf6', '#a78bfa'], ['#3b82f6', '#60a5fa'],
    ['#10b981', '#34d399'], ['#ec4899', '#f472b6'], ['#6366f1', '#818cf8'],
  ];

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
            const [gradFrom, gradTo] = gradientPairs[index % gradientPairs.length];
            return (
              <div key={index} className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-100/80 hover:border-transparent transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ background: `linear-gradient(135deg, ${gradFrom}15, ${gradTo}15)` }}>
                  <IconComponent className="w-7 h-7" style={{ color: gradFrom }} />
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
