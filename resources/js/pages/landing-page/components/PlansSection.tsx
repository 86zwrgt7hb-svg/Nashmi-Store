import React, { useMemo } from 'react';
import { Check, ArrowRight, Sparkles, Crown, Shield, Infinity, Server, HeadphonesIcon, Zap } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';

const encryptPlanId = (planId: number): string => {
  const key = 'Store2025';
  const str = planId.toString();
  let encrypted = '';
  for (let i = 0; i < str.length; i++) {
    encrypted += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(encrypted);
};

interface Feature {
  name: string;
  enabled: boolean;
}

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  yearly_price?: number;
  duration: string;
  features?: string[];
  allFeatures?: Feature[];
  is_popular?: boolean;
  is_plan_enable: string;
  stats?: {
    businesses?: number;
    users?: number;
    products_per_store?: any;
    storage?: any;
    templates?: number;
    [key: string]: any;
  };
}

interface PlansSectionProps {
  brandColor?: string;
  plans: Plan[];
  settings?: any;
  sectionData?: {
    title?: string;
    subtitle?: string;
    faq_text?: string;
  };
}

function PlansSection({ plans, settings, sectionData, brandColor = '#6366f1' }: PlansSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { ref, isVisible } = useScrollAnimation();

  // Get the first (and only) plan - the lifetime plan
  const plan = plans[0];
  if (!plan) return null;

  const featuresList = plan.allFeatures || (plan.features || []).map(f => ({ name: f, enabled: true }));
  const enabledFeatures = featuresList.filter((f: Feature) => f.enabled);

  // Feature translations
  const featureTranslations: Record<string, string> = {
    'Custom Domain': isRTL ? 'دومين مخصص' : 'Custom Domain',
    'Subdomain': isRTL ? 'نطاق فرعي' : 'Subdomain',
    'PWA': isRTL ? 'تطبيق ويب (PWA)' : 'PWA App',
    'AI Integration': isRTL ? 'الذكاء الاصطناعي' : 'AI Integration',
    'Shipping Method': isRTL ? 'طرق الشحن' : 'Shipping Methods',
    'POS System': isRTL ? 'نظام نقاط البيع (POS)' : 'POS System',
    'Remove Branding': isRTL ? 'إزالة شعار المنصة' : 'Remove Branding',
  };

  const translateFeature = (name: string): string => featureTranslations[name] || name;

  const tx = {
    badge: isRTL ? 'عرض خاص' : 'Special Offer',
    title: isRTL ? 'امتلك متجرك للأبد' : 'Own Your Store Forever',
    subtitle: isRTL ? 'ادفع مرة واحدة فقط واحصل على متجر إلكتروني احترافي مع استضافة ودعم فني مدى الحياة. لا اشتراكات شهرية، لا رسوم مخفية.' : 'Pay once and get a professional online store with lifetime hosting and support. No monthly subscriptions, no hidden fees.',
    price: '499',
    currency: isRTL ? 'د.أ' : 'JOD',
    oneTime: isRTL ? 'دفعة واحدة' : 'One-time payment',
    lifetime: isRTL ? 'مدى الحياة' : 'Lifetime',
    getStarted: isRTL ? 'ابدأ تجربتك المجانية' : 'Start Your Free Trial',
    trialNote: isRTL ? '7 أيام تجربة مجانية - بدون بطاقة ائتمان' : '7-day free trial - No credit card required',
    faqText: isRTL ? 'هل لديك أسئلة؟ تواصل معنا.' : (sectionData?.faq_text || 'Have questions? Contact us.'),
    // Highlights
    freeHosting: isRTL ? 'استضافة مجانية مدى الحياة' : 'Free Lifetime Hosting',
    freeSupport: isRTL ? 'دعم فني مدى الحياة' : 'Lifetime Support',
    freeUpdates: isRTL ? 'تحديثات مجانية مدى الحياة' : 'Free Lifetime Updates',
    noSubscription: isRTL ? 'لا اشتراكات شهرية أو سنوية' : 'No Monthly or Yearly Fees',
    maxImageSize: isRTL ? 'حجم الصورة: حتى 5MB' : 'Image size: up to 5MB',
    // Comparison
    comparisonTitle: isRTL ? 'قارن وفّر' : 'Compare & Save',
    otherPlatforms: isRTL ? 'المنصات الأخرى' : 'Other Platforms',
    nashmiStore: isRTL ? 'نشمي ستور' : 'Nashmi Store',
    monthlyFee: isRTL ? 'رسوم شهرية: ~30 د.أ' : 'Monthly fee: ~30 JOD',
    yearCost: isRTL ? 'تكلفة سنة: ~360 د.أ' : '1 year cost: ~360 JOD',
    threeYearCost: isRTL ? 'تكلفة 3 سنوات: ~1,080 د.أ' : '3 years cost: ~1,080 JOD',
    oneTimeCost: isRTL ? 'دفعة واحدة: 499 د.أ فقط' : 'One-time: Only 499 JOD',
    foreverCost: isRTL ? 'للأبد: 499 د.أ' : 'Forever: 499 JOD',
    saveAmount: isRTL ? 'وفّر أكثر من 581 د.أ خلال 3 سنوات!' : 'Save over 581 JOD in 3 years!',
  };

  const highlights = [
    { icon: <Server className="w-5 h-5" />, text: tx.freeHosting },
    { icon: <HeadphonesIcon className="w-5 h-5" />, text: tx.freeSupport },
    { icon: <Zap className="w-5 h-5" />, text: tx.freeUpdates },
    { icon: <Shield className="w-5 h-5" />, text: tx.noSubscription },
  ];

  const stats = plan.stats || {};

  return (
    <section id="pricing" className="relative py-20 sm:py-28 overflow-hidden" ref={ref} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/30 to-white"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-6 tracking-wide uppercase">
            <Sparkles className="w-4 h-4" />
            {tx.badge}
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">{tx.title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">{tx.subtitle}</p>
        </div>

        {/* Main Pricing Card */}
        <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative max-w-2xl mx-auto">
            {/* Lifetime Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="flex items-center gap-1.5 px-5 py-2 rounded-full text-white text-sm font-semibold shadow-lg" style={{ background: `linear-gradient(135deg, ${brandColor}, var(--secondary-color, #8b5cf6))`, boxShadow: `0 8px 25px -5px ${brandColor}40` }}>
                <Infinity className="w-4 h-4" />
                {tx.lifetime}
              </div>
            </div>

            <div className="bg-white rounded-3xl border-2 border-transparent shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] p-8 sm:p-10" style={{ borderColor: `${brandColor}30` }}>
              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-6xl sm:text-7xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${brandColor}, var(--secondary-color, #8b5cf6))` }}>
                    {tx.price}
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-2xl font-bold text-gray-700">{tx.currency}</span>
                    <span className="text-sm text-gray-400 font-medium">{tx.oneTime}</span>
                  </div>
                </div>
              </div>

              {/* Highlights Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50/50 transition-colors">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                      {h.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{h.text}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-8">
                {[
                  { value: '1', label: isRTL ? 'متجر' : 'Store' },
                  { value: '∞', label: isRTL ? 'مستخدمين' : 'Users' },
                  { value: '∞', label: isRTL ? 'منتجات' : 'Products' },
                  { value: '∞', label: isRTL ? 'تخزين' : 'Storage' },
                  { value: stats.templates ?? '7', label: isRTL ? 'قوالب' : 'Themes' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl p-3 text-center bg-gray-50">
                    <div className="text-lg font-bold" style={{ color: brandColor }}>{stat.value}</div>
                    <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>

              {/* Features */}
              <div className="mb-8">
                <ul className="grid grid-cols-2 gap-3">
                  {enabledFeatures.map((feature: Feature, index: number) => (
                    <li key={index} className="flex items-center gap-2.5">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandColor}15` }}>
                        <Check className="w-3 h-3" style={{ color: brandColor }} />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{translateFeature(feature.name)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Link
                href={route('register', { plan: encryptPlanId(plan.id) })}
                className="group/btn flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-white"
                style={{
                  background: `linear-gradient(135deg, ${brandColor}, var(--secondary-color, #8b5cf6))`,
                  boxShadow: `0 8px 25px -5px ${brandColor}40`
                }}
              >
                {tx.getStarted}
                <ArrowRight className={`w-5 h-5 group-hover/btn:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <p className="text-center text-sm text-gray-400 mt-3">{tx.trialNote}</p>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className={`mt-16 max-w-2xl mx-auto transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">{tx.comparisonTitle}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Other Platforms */}
            <div className="rounded-2xl border border-red-200 bg-red-50/30 p-6">
              <h4 className="font-bold text-red-600 mb-4">{tx.otherPlatforms}</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  {tx.monthlyFee}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  {tx.yearCost}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  {tx.threeYearCost}
                </li>
              </ul>
            </div>
            {/* Nashmi Store */}
            <div className="rounded-2xl border-2 p-6" style={{ borderColor: `${brandColor}40`, backgroundColor: `${brandColor}05` }}>
              <h4 className="font-bold mb-4" style={{ color: brandColor }}>{tx.nashmiStore}</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }}></span>
                  {tx.oneTimeCost}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }}></span>
                  {tx.foreverCost}
                </li>
              </ul>
              <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm font-bold text-green-700 text-center">{tx.saveAmount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500">{tx.faqText}</p>
        </div>
      </div>
    </section>
  );
}

export default PlansSection;
