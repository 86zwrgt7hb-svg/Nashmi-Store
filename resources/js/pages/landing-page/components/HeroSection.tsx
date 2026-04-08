import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Play, Sparkles, Crown, Shield, Infinity, Clock, CreditCard, ShoppingBag, Users, BarChart3, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HeroSectionProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    title?: string;
    subtitle?: string;
    announcement_text?: string;
    primary_button_text?: string;
    secondary_button_text?: string;
    image?: string;
    stats?: Array<{ value: string; label: string }>;
    [key: string]: any;
  };
}

export default function HeroSection({ settings, sectionData, brandColor = '#6366f1' }: HeroSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const secondaryColor = 'var(--secondary-color, #8b5cf6)';

  const tx = {
    announcement: isRTL ? 'عرض حصري - ادفع مرة واحدة فقط' : 'Exclusive Offer - Pay Once, Own Forever',
    titleLine1: isRTL ? 'امتلك متجرك' : 'Own Your Store',
    titleLine2: isRTL ? 'للأبد' : 'Forever',
    subtitle: isRTL
      ? 'متجر إلكتروني احترافي بـ 499 دينار فقط. استضافة مجانية مدى الحياة، دعم فني، وتحديثات مستمرة. بدون أي رسوم شهرية أو سنوية.'
      : 'A professional online store for just 499 JOD. Free lifetime hosting, support, and updates. No monthly or yearly fees ever.',
    primaryBtn: isRTL ? 'ابدأ تجربتك المجانية' : 'Start Your Free Trial',
    secondaryBtn: isRTL ? 'تسجيل الدخول' : 'Login',
    trialNote: isRTL ? '7 أيام مجاناً - بدون بطاقة ائتمان' : '7 days free - No credit card required',
    priceTag: '499',
    currency: isRTL ? 'دينار' : 'JOD',
    oneTime: isRTL ? 'دفعة واحدة' : 'One-time',
    badge1: isRTL ? 'استضافة مجانية' : 'Free Hosting',
    badge2: isRTL ? 'دعم مدى الحياة' : 'Lifetime Support',
    badge3: isRTL ? 'بدون رسوم شهرية' : 'No Monthly Fees',
    badge4: isRTL ? 'كل شي غير محدود' : 'Everything Unlimited',
    dashboard: isRTL ? 'لوحة تحكم نشمي ستور' : 'Nashmi Store Dashboard',
    totalStores: isRTL ? 'إجمالي المتاجر' : 'Total Stores',
    revenue: isRTL ? 'الإيرادات' : 'Revenue',
    orders: isRTL ? 'الطلبات' : 'Orders',
    storeManagement: isRTL ? 'إدارة المتاجر' : 'Store Management',
    active: isRTL ? 'نشط' : 'Active',
    pending: isRTL ? 'قيد الانتظار' : 'Pending',
    lifetimeBadge: isRTL ? 'مدى الحياة' : 'LIFETIME',
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] animate-pulse" style={{ background: `radial-gradient(circle, ${brandColor}40, transparent)` }}></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] animate-pulse" style={{ background: `radial-gradient(circle, ${secondaryColor}40, transparent)`, animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 blur-[120px]" style={{ background: `radial-gradient(circle, ${brandColor}30, transparent)` }}></div>
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className={`text-center lg:${isRTL ? 'text-right' : 'text-left'} space-y-8`}>
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-amber-200/60 bg-amber-50/60 backdrop-blur-sm text-amber-700 shadow-sm">
              <Crown className="w-4 h-4 text-amber-500" />
              {tx.announcement}
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight">
              <span className="text-gray-900">{tx.titleLine1}</span>
              <br />
              <span className="bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${brandColor}, ${secondaryColor})` }}>
                {tx.titleLine2}
              </span>
            </h1>

            {/* Price Highlight */}
            <div className={`flex items-center gap-4 justify-center lg:${isRTL ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${brandColor}, ${secondaryColor})` }}>
                  {tx.priceTag}
                </span>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-700">{tx.currency}</span>
                  <span className="text-sm text-gray-400 font-medium">{tx.oneTime}</span>
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <p className={`text-lg sm:text-xl text-gray-500 leading-relaxed max-w-xl mx-auto lg:${isRTL ? 'mr-0' : 'ml-0'}`}>
              {tx.subtitle}
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {[
                { icon: Shield, text: tx.badge1 },
                { icon: Infinity, text: tx.badge4 },
                { icon: CreditCard, text: tx.badge3 },
              ].map((badge, i) => (
                <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-gray-100 text-gray-600 shadow-sm">
                  <badge.icon className="w-3.5 h-3.5" style={{ color: brandColor }} />
                  {badge.text}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:${isRTL ? 'justify-end' : 'justify-start'}`}>
              <Link
                href={route('register')}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-base transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, ${brandColor}, ${secondaryColor})`,
                  boxShadow: `0 10px 40px -10px ${brandColor}60`
                }}
              >
                {tx.primaryBtn}
                <ArrowRight size={18} className={`group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                href={route('login')}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base border-2 border-gray-200 text-gray-700 bg-white/60 backdrop-blur-sm hover:border-gray-300 hover:bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <Play size={18} className="group-hover:scale-110 transition-transform" style={{ color: brandColor }} />
                {tx.secondaryBtn}
              </Link>
            </div>

            {/* Trial Note */}
            <p className={`text-sm text-gray-400 flex items-center gap-1.5 justify-center lg:${isRTL ? 'justify-end' : 'justify-start'}`}>
              <Clock className="w-4 h-4" />
              {tx.trialNote}
            </p>
          </div>

          {/* Right Content - Dashboard Mockup with Lifetime Badge */}
          <div className="relative lg:flex lg:justify-center">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-2 border-dashed opacity-10" style={{ borderColor: brandColor }}></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full border-2 border-dashed opacity-10" style={{ borderColor: secondaryColor }}></div>
            <div className="absolute top-10 right-10 w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: brandColor }}></div>
            <div className="absolute bottom-20 left-5 w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: secondaryColor, animationDelay: '1s' }}></div>

            <div className="relative transform hover:scale-[1.02] transition-transform duration-500">
              {/* Lifetime Badge floating */}
              <div className="absolute -top-4 -right-4 z-20 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-lg animate-pulse" style={{ background: `linear-gradient(135deg, ${brandColor}, ${secondaryColor})` }}>
                <div className="flex items-center gap-1.5">
                  <Infinity className="w-4 h-4" />
                  {tx.lifetimeBadge}
                </div>
              </div>

              <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_20px_80px_-20px_rgba(0,0,0,0.15)] p-4 sm:p-6 max-w-lg mx-auto border border-white/40">
                <div className="absolute inset-0 rounded-3xl opacity-30 blur-xl -z-10" style={{ background: `linear-gradient(135deg, ${brandColor}20, ${secondaryColor}20)` }}></div>

                {/* Dashboard Mockup */}
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100" dir={isRTL ? 'rtl' : 'ltr'}>
                  {/* Dashboard Header */}
                  <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: brandColor }}>
                    <span className="text-white text-sm font-bold">{tx.dashboard}</span>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 p-3">
                    {[
                      { value: '156', label: tx.totalStores, change: '+23%', icon: ShoppingBag },
                      { value: '$47K', label: tx.revenue, change: '+18%', icon: TrendingUp },
                      { value: '2.4K', label: tx.orders, change: '+12%', icon: BarChart3 },
                    ].map((item, i) => (
                      <div key={i} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: `${brandColor}10` }}>
                        <div className="text-lg font-bold" style={{ color: brandColor }}>{item.value}</div>
                        <div className="text-[10px] text-gray-500">{item.label}</div>
                        <div className="text-[9px] text-green-500 mt-0.5">{item.change}</div>
                      </div>
                    ))}
                  </div>

                  {/* Store List */}
                  <div className="px-3 pb-3">
                    <div className="text-xs font-bold text-gray-700 mb-2">{tx.storeManagement}</div>
                    {[
                      { name: isRTL ? 'بوتيك الأزياء' : 'Fashion Boutique', status: tx.active, statusColor: 'text-green-500' },
                      { name: isRTL ? 'هب الإلكترونيات' : 'Electronics Hub', status: tx.active, statusColor: 'text-green-500' },
                      { name: isRTL ? 'مستلزمات المنزل' : 'Home Essentials', status: tx.pending, statusColor: 'text-yellow-500' },
                    ].map((store, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i < 2 ? '#22c55e' : '#eab308' }}></div>
                          <span className="text-xs text-gray-700">{store.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex -space-x-1">
                            {[brandColor, '#8b5cf6', '#a78bfa', '#c4b5fd'].map((c, j) => (
                              <div key={j} className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: c }}></div>
                            ))}
                          </div>
                          <span className={`text-[10px] font-medium ms-2 ${store.statusColor}`}>{store.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
