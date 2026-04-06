import React from 'react';
import { QrCode, Smartphone, Share2, BarChart3, Globe, Shield, Star, Zap, Users, Lock, Wifi, Heart, Store, CreditCard, Package, Truck } from 'lucide-react';
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
  'package': Package, 'truck': Truck,
};

const defaultFeaturesEN: Feature[] = [
  { title: 'Multi-Store Management', description: 'Create and manage unlimited online stores from one centralized dashboard with ease.', icon: 'store' },
  { title: '7+ Professional Themes', description: 'Choose from beautifully designed themes for different business categories and industries.', icon: 'star' },
  { title: '30+ Payment Gateways', description: 'Accept payments globally with Stripe, PayPal, Razorpay, and 30+ other payment methods.', icon: 'credit-card' },
  { title: 'Advanced Analytics', description: 'Track sales, customers, inventory, and performance with detailed reports and insights.', icon: 'chart' },
  { title: 'Customer Management', description: 'Manage customer profiles, orders, and communication across all your stores.', icon: 'users' },
  { title: 'Inventory Management', description: 'Track stock levels, manage products, and automate inventory across multiple stores.', icon: 'package' },
  { title: 'Mobile Responsive', description: 'All stores are fully optimized for mobile devices and tablets for better customer experience.', icon: 'smartphone' },
  { title: 'Secure & Reliable', description: 'Enterprise-grade security with SSL certificates, data encryption, and regular backups.', icon: 'shield' },
  { title: '24/7 Support', description: 'Get help when you need it with our dedicated support team available around the clock.', icon: 'heart' },
];

const defaultFeaturesAR: Feature[] = [
  { title: 'إدارة متاجر متعددة', description: 'أنشئ وأدر متاجر إلكترونية غير محدودة من لوحة تحكم مركزية واحدة بكل سهولة.', icon: 'store' },
  { title: '+7 تصاميم احترافية', description: 'اختر من تصاميم مميزة مصممة خصيصاً لفئات أعمال مختلفة ومتنوعة.', icon: 'star' },
  { title: '+30 بوابة دفع', description: 'اقبل المدفوعات عالمياً عبر Stripe وPayPal وRazorpay و+30 طريقة دفع أخرى.', icon: 'credit-card' },
  { title: 'تحليلات متقدمة', description: 'تتبع المبيعات والعملاء والمخزون والأداء مع تقارير مفصلة ورؤى دقيقة.', icon: 'chart' },
  { title: 'إدارة العملاء', description: 'أدر ملفات العملاء والطلبات والتواصل عبر جميع متاجرك من مكان واحد.', icon: 'users' },
  { title: 'إدارة المخزون', description: 'تتبع مستويات المخزون وأدر المنتجات وأتمت المخزون عبر متاجر متعددة.', icon: 'package' },
  { title: 'متجاوب مع الموبايل', description: 'جميع المتاجر محسّنة بالكامل للهواتف والأجهزة اللوحية لتجربة عملاء أفضل.', icon: 'smartphone' },
  { title: 'آمن وموثوق', description: 'أمان بمستوى المؤسسات مع شهادات SSL وتشفير البيانات ونسخ احتياطية منتظمة.', icon: 'shield' },
  { title: 'دعم على مدار الساعة', description: 'احصل على المساعدة متى احتجتها مع فريق دعم مخصص متاح على مدار الساعة.', icon: 'heart' },
];

const gradientColors = [
  ['#6366f1', '#818cf8'], ['#8b5cf6', '#a78bfa'], ['#ec4899', '#f472b6'],
  ['#14b8a6', '#2dd4bf'], ['#f59e0b', '#fbbf24'], ['#3b82f6', '#60a5fa'],
  ['#ef4444', '#f87171'], ['#10b981', '#34d399'], ['#6366f1', '#a78bfa'],
];

export default function FeaturesSection({ settings, sectionData, brandColor = '#6366f1' }: FeaturesSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { ref, isVisible } = useScrollAnimation();
  
  const features = isRTL 
    ? defaultFeaturesAR 
    : (sectionData.features_list?.length ? sectionData.features_list : defaultFeaturesEN);

  const title = isRTL ? 'كل ما تحتاجه لبناء إمبراطوريتك الإلكترونية' : (sectionData.title || 'Everything You Need to Build Your Online Empire');
  const description = isRTL ? 'منصة شاملة لإدارة المتاجر المتعددة بميزات قوية مصممة لرواد التجارة الإلكترونية.' : (sectionData.description || 'Comprehensive multi-store management platform with powerful features designed for modern e-commerce entrepreneurs.');
  const badge = isRTL ? 'ميزات قوية' : 'Powerful Features';

  return (
    <section id="features" className="relative py-20 sm:py-28 overflow-hidden" ref={ref} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-gray-200/60 bg-white/60 backdrop-blur-sm text-gray-600">
            <Zap className="w-4 h-4" style={{ color: brandColor }} />
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
            return (
              <div key={index} className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" style={{ background: `linear-gradient(135deg, ${gradFrom}20, ${gradTo}20)` }}></div>
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
