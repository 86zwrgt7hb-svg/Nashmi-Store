import React, { useState, useCallback, useMemo } from 'react';
import { Check, X, ArrowRight, Sparkles, Crown, Star } from 'lucide-react';
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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { ref, isVisible } = useScrollAnimation();

  const enabledPlans = plans.filter(plan => plan.is_plan_enable === 'on' && (plan.duration === 'both' || plan.duration === 'monthly' || plan.duration === 'yearly'));
  const displayPlans = enabledPlans.length > 0 ? enabledPlans : [];

  const getPrice = useCallback((plan: Plan) => {
    if (billingCycle === 'yearly' && plan.yearly_price !== undefined) return plan.yearly_price;
    return plan.price;
  }, [billingCycle]);

  // Currency symbol based on language
  const currencySymbol = isRTL ? 'د.أ' : 'JOD';

  // Format price with currency
  const formatPrice = (price: number): string => {
    return `${price.toFixed(2)} ${currencySymbol}`;
  };

  // Feature name translations
  const featureTranslations: Record<string, string> = {
    'Custom Domain': isRTL ? 'دومين مخصص' : 'Custom Domain',
    'Subdomain': isRTL ? 'نطاق فرعي' : 'Subdomain',
    'PWA': isRTL ? 'تطبيق ويب (PWA)' : 'PWA App',
    'AI Integration': isRTL ? 'الذكاء الاصطناعي' : 'AI Integration',
    'Shipping Method': isRTL ? 'طرق الشحن' : 'Shipping Methods',
    'POS System': isRTL ? 'نظام نقاط البيع (POS)' : 'POS System',
    'Remove Branding': isRTL ? 'إزالة شعار المنصة' : 'Remove Branding',
    'Free Store Setup': isRTL ? 'تجهيز المتجر مجاناً' : 'Free Store Setup',
  };

  const translateFeature = (name: string): string => {
    return featureTranslations[name] || name;
  };

  const tx = {
    badge: isRTL ? 'الأسعار' : 'Pricing',
    title: isRTL ? 'اختر خطتك' : (sectionData?.title || 'Choose Your Plan'),
    subtitle: isRTL ? 'ابدأ بخطتنا المجانية وطوّر مع نمو عملك.' : (sectionData?.subtitle || 'Start with our free plan and upgrade as you grow.'),
    monthly: isRTL ? 'شهرياً' : 'Monthly',
    yearly: isRTL ? 'سنوياً' : 'Yearly',
    recommended: isRTL ? 'الأكثر طلباً' : 'Most Popular',
    stores: isRTL ? 'متاجر' : 'Stores',
    usersStore: isRTL ? 'مستخدمين/متجر' : 'Users/Store',
    productsStore: isRTL ? 'منتجات/متجر' : 'Products/Store',
    storage: isRTL ? 'مساحة التخزين' : 'Storage',
    themes: isRTL ? 'قوالب' : 'Themes',
    perMonth: isRTL ? '/شهرياً' : '/mo',
    perYear: isRTL ? '/سنوياً' : '/yr',
    startFree: isRTL ? 'ابدأ مجاناً' : 'Start Free',
    getStarted: isRTL ? 'ابدأ الآن' : 'Get Started',
    faqText: isRTL ? 'هل لديك أسئلة؟ تواصل معنا.' : (sectionData?.faq_text || 'Have questions? Contact us.'),
    unlimited: isRTL ? 'غير محدود' : 'Unlimited',
    elite: isRTL ? 'النخبة' : 'Elite',
  };

  const planDescriptions: Record<string, string> = {
    'Free': isRTL ? 'خطة مجانية للبدء وتجربة المنصة.' : 'Free plan to get started and try the platform.',
    'Pro': isRTL ? 'مثالية للمتاجر النامية مع دومين خاص ونظام POS.' : 'Ideal for growing stores with custom domain and POS.',
    'Enterprise': isRTL ? 'باقة النخبة للشركات الكبيرة مع ميزات غير محدودة ودعم خاص.' : 'Elite package for large businesses with unlimited features and premium support.',
  };

  return (
    <section id="pricing" className="relative py-20 sm:py-28 overflow-hidden" ref={ref} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/30 to-white"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-6 tracking-wide uppercase">
            <Sparkles className="w-4 h-4" />
            {tx.badge}
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">{tx.title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">{tx.subtitle}</p>

          <div className="inline-flex items-center gap-3 bg-gray-100 rounded-xl p-1.5">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tx.monthly}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${billingCycle === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tx.yearly}
              <span className={`${isRTL ? 'mr-1.5' : 'ml-1.5'} text-xs font-bold px-2 py-0.5 rounded-full text-white`} style={{ backgroundColor: brandColor }}>-17%</span>
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {displayPlans.map((plan, planIndex) => {
            const isEnterprise = plan.name === 'Enterprise';
            const featuresList = plan.allFeatures || (plan.features || []).map(f => ({ name: f, enabled: true }));
            
            // Build a complete features list with all possible features
            const allPossibleFeatures = ['Custom Domain', 'Subdomain', 'PWA', 'AI Integration', 'Shipping Method', 'POS System', 'Remove Branding'];
            
            // Add Free Store Setup for Enterprise
            if (isEnterprise) {
              allPossibleFeatures.push('Free Store Setup');
            }

            const completeFeatures: Feature[] = allPossibleFeatures.map(featureName => {
              const found = featuresList.find((f: Feature) => f.name === featureName);
              if (found) return found;
              
              if (featureName === 'Free Store Setup' && isEnterprise) {
                return { name: featureName, enabled: true };
              }

              const isInLegacy = (plan.features || []).some(f => f === featureName);
              return { name: featureName, enabled: isInLegacy };
            });

            // Sort features: enabled first, then disabled
            const sortedFeatures = [...completeFeatures].sort((a, b) => {
              if (a.enabled === b.enabled) return 0;
              return a.enabled ? -1 : 1;
            });

            // Get stats dynamically from the plan data (comes from DB)
            const stats = plan.stats || {};
            
            // Override stats for Enterprise
            const displayStats = isEnterprise ? {
              ...stats,
              products_per_store: tx.unlimited,
              storage: tx.unlimited
            } : stats;

            return (
              <div key={plan.id} className={`group relative rounded-2xl transition-all duration-500 hover:-translate-y-2 ${plan.is_popular ? 'lg:scale-105 z-10' : ''} ${isEnterprise ? 'lg:scale-[1.02]' : ''}`}>
                {plan.is_popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-sm font-semibold shadow-lg" style={{ background: `linear-gradient(135deg, ${brandColor}, var(--secondary-color, #8b5cf6))`, boxShadow: `0 8px 25px -5px ${brandColor}40` }}>
                      <Crown className="w-3.5 h-3.5" />
                      {tx.recommended}
                    </div>
                  </div>
                )}

                {isEnterprise && !plan.is_popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-sm font-semibold shadow-lg bg-gradient-to-r from-amber-400 to-amber-600">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {tx.elite}
                    </div>
                  </div>
                )}

                <div className={`h-full flex flex-col rounded-2xl p-8 border transition-all duration-500 ${plan.is_popular ? 'bg-white border-transparent shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)]' : isEnterprise ? 'bg-white border-amber-200 shadow-[0_20px_50px_-15px_rgba(245,158,11,0.15)]' : 'bg-white/70 backdrop-blur-sm border-gray-100 hover:border-transparent hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]'}`}>
                  <div className="mb-6">
                    <h3 className={`text-xl font-bold mb-2 ${isEnterprise ? 'text-amber-600' : 'text-gray-900'}`}>{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-4xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: isEnterprise ? 'linear-gradient(135deg, #f59e0b, #d97706)' : `linear-gradient(135deg, ${brandColor}, var(--secondary-color, #8b5cf6))` }}>
                        {formatPrice(getPrice(plan))}
                      </span>
                      <span className="text-sm text-gray-400 font-medium">{billingCycle === 'yearly' ? tx.perYear : tx.perMonth}</span>
                    </div>
                    <p className="text-sm text-gray-500">{planDescriptions[plan.name] || plan.description}</p>
                  </div>

                  {displayStats && (
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {[
                        { value: displayStats.businesses, label: tx.stores },
                        { value: displayStats.users, label: tx.usersStore },
                        { value: displayStats.products_per_store, label: tx.productsStore },
                        { value: displayStats.storage, label: tx.storage },
                        { value: displayStats.templates, label: tx.themes },
                      ].map((stat, i) => (
                        <div key={i} className={`rounded-xl p-3 text-center ${isEnterprise ? 'bg-amber-50/50' : 'bg-gray-50'}`}>
                          <div className="text-base font-bold" style={{ color: isEnterprise ? '#d97706' : brandColor }}>{stat.value ?? 'N/A'}</div>
                          <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>

                  <div className="flex-1 mb-6">
                    <ul className="space-y-3">
                      {sortedFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          {feature.enabled ? (
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isEnterprise ? 'bg-amber-100' : ''}`} style={{ backgroundColor: isEnterprise ? undefined : `${brandColor}15` }}>
                              <Check className="w-3 h-3" style={{ color: isEnterprise ? '#d97706' : brandColor }} />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-red-50">
                              <X className="w-3 h-3 text-red-400" />
                            </div>
                          )}
                          <span className={`text-sm font-medium ${feature.enabled ? 'text-gray-600' : 'text-gray-400 line-through'}`}>
                            {translateFeature(feature.name)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={route('register', { plan: encryptPlanId(plan.id) })}
                    className="group/btn flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-white"
                    style={{
                      background: plan.is_popular
                        ? `linear-gradient(135deg, ${brandColor}, var(--secondary-color, #8b5cf6))`
                        : isEnterprise
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : brandColor,
                      boxShadow: plan.is_popular ? `0 8px 25px -5px ${brandColor}40` : isEnterprise ? '0 8px 25px -5px rgba(245, 158, 11, 0.4)' : 'none'
                    }}
                  >
                    {plan.price === 0 ? tx.startFree : tx.getStarted}
                    <ArrowRight className={`w-4 h-4 group-hover/btn:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500">{tx.faqText}</p>
        </div>
      </div>
    </section>
  );
}

export default PlansSection;
