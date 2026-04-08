import React from 'react';
import { QrCode, Smartphone, Share2, BarChart3, Globe, Shield, Star, Zap, Users, Lock, Wifi, Heart, Store, CreditCard, Package, Truck, Infinity, Crown, Clock, Server } from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '@/utils/image-helper';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesSectionProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    title?: string;
    description?: string;
    image?: string;
    background_color?: string;
    columns?: number;
    features_list?: Feature[];
  };
}

const iconMap: Record<string, React.ComponentType<any>> = {
  'qr-code': QrCode, 'smartphone': Smartphone, 'share': Share2, 'chart': BarChart3,
  'globe': Globe, 'shield': Shield, 'star': Star, 'zap': Zap, 'users': Users,
  'lock': Lock, 'wifi': Wifi, 'heart': Heart, 'store': Store, 'credit-card': CreditCard,
  'package': Package, 'truck': Truck, 'infinity': Infinity, 'crown': Crown, 'clock': Clock, 'server': Server,
};

const defaultFeaturesEN: Feature[] = [
  { title: 'Pay Once, Own Forever', description: 'No monthly fees, no yearly renewals. One payment of 499 JOD and your store is yours for life.', icon: 'crown' },
  { title: 'Free Lifetime Hosting', description: 'Your store is hosted on our premium servers forever. No hosting bills, no server management headaches.', icon: 'server' },
  { title: 'Unlimited Everything', description: 'Unlimited products, customers, orders, and storage. No caps, no restrictions, no hidden limits.', icon: 'infinity' },
  { title: '7+ Professional Themes', description: 'Choose from beautifully designed themes for different business categories. Switch anytime without losing data.', icon: 'star' },
  { title: '30+ Payment Gateways', description: 'Accept payments globally with Stripe, PayPal, Razorpay, and 30+ other payment methods.', icon: 'credit-card' },
  { title: 'Advanced Analytics', description: 'Track sales, customers, inventory, and performance with detailed reports and real-time insights.', icon: 'chart' },
  { title: 'Multi-Store from One Account', description: 'Manage multiple stores from a single dashboard. Each store gets its own lifetime license.', icon: 'store' },
  { title: 'Mobile Optimized', description: 'All stores are fully responsive and optimized for mobile devices and tablets.', icon: 'smartphone' },
  { title: 'Lifetime Support & Updates', description: 'Get continuous software updates and dedicated technical support for as long as you own your store.', icon: 'heart' },
];

const defaultFeaturesAR: Feature[] = [
  { title: 'ادفع مرة واحدة، امتلك للأبد', description: 'بدون رسوم شهرية أو تجديد سنوي. دفعة واحدة بقيمة 499 دينار ومتجرك ملكك مدى الحياة.', icon: 'crown' },
  { title: 'استضافة مجانية مدى الحياة', description: 'متجرك مستضاف على سيرفراتنا المتميزة للأبد. بدون فواتير استضافة أو إدارة سيرفرات.', icon: 'server' },
  { title: 'كل شيء غير محدود', description: 'منتجات غير محدودة، عملاء، طلبات، ومساحة تخزين. بدون قيود أو حدود مخفية.', icon: 'infinity' },
  { title: '+7 تصاميم احترافية', description: 'اختر من تصاميم مميزة لفئات أعمال مختلفة. غيّر التصميم بأي وقت بدون فقدان بياناتك.', icon: 'star' },
  { title: '+30 بوابة دفع', description: 'اقبل المدفوعات عالمياً عبر Stripe وPayPal وRazorpay و+30 طريقة دفع أخرى.', icon: 'credit-card' },
  { title: 'تحليلات متقدمة', description: 'تتبع المبيعات والعملاء والمخزون والأداء مع تقارير مفصلة ورؤى فورية.', icon: 'chart' },
  { title: 'متاجر متعددة من حساب واحد', description: 'أدر عدة متاجر من لوحة تحكم واحدة. كل متجر يحصل على رخصة مدى الحياة خاصة به.', icon: 'store' },
  { title: 'متوافق مع الموبايل', description: 'جميع المتاجر متجاوبة بالكامل ومحسّنة للهواتف والأجهزة اللوحية.', icon: 'smartphone' },
  { title: 'دعم وتحديثات مدى الحياة', description: 'احصل على تحديثات برمجية مستمرة ودعم فني مخصص طالما تملك متجرك.', icon: 'heart' },
];

const gradientColors = [
  ['#f59e0b', '#fbbf24'], ['#6366f1', '#818cf8'], ['#8b5cf6', '#a78bfa'],
  ['#ec4899', '#f472b6'], ['#14b8a6', '#2dd4bf'], ['#3b82f6', '#60a5fa'],
  ['#ef4444', '#f87171'], ['#10b981', '#34d399'], ['#6366f1', '#a78bfa'],
];

export default function FeaturesSection({ settings, sectionData, brandColor = '#6366f1' }: FeaturesSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { ref, isVisible } = useScrollAnimation();

  const features = isRTL ? defaultFeaturesAR : defaultFeaturesEN;

  const title = isRTL ? 'كل ما تحتاجه بدفعة واحدة' : 'Everything You Need, One Payment';
  const description = isRTL ? 'منصة متكاملة بميزات غير محدودة. ادفع 499 دينار مرة واحدة واحصل على كل هذا مدى الحياة.' : 'A complete platform with unlimited features. Pay 499 JOD once and get all of this for life.';
  const badge = isRTL ? 'ميزات غير محدودة' : 'Unlimited Features';

  return (
    <section id="features" className="relative py-20 sm:py-28 overflow-hidden" ref={ref} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-gray-200/60 bg-white/60 backdrop-blur-sm text-gray-600">
            <Infinity className="w-4 h-4" style={{ color: brandColor }} />
            {badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Star;
            const [gradFrom, gradTo] = gradientColors[index % gradientColors.length];
            const isHighlight = index < 3; // First 3 features are the key selling points
            return (
              <div key={index} className={`group relative bg-white rounded-2xl p-6 border transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 ${isHighlight ? 'border-transparent ring-1 ring-gray-100 shadow-sm' : 'border-gray-100 hover:border-transparent'}`}>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" style={{ background: `linear-gradient(135deg, ${gradFrom}20, ${gradTo}20)` }}></div>
                {isHighlight && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm" style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}>
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${gradFrom}15, ${gradTo}15)` }}>
                  <IconComponent className="w-6 h-6" style={{ color: gradFrom }} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
