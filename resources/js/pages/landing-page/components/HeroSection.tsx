import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Play, Sparkles, TrendingUp, ShoppingBag, Users, BarChart3 } from 'lucide-react';
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
    title: isRTL ? 'أطلق متجرك الإلكتروني في دقائق' : (sectionData.title || 'Launch Your Online Store in Minutes'),
    subtitle: isRTL ? 'أنشئ وأدر متاجر إلكترونية متعددة مع منصتنا القوية للتجارة الإلكترونية.' : (sectionData.subtitle || 'Create, customize, and manage multiple online stores with our powerful e-commerce platform.'),
    primaryBtn: isRTL ? 'ابدأ التجربة المجانية' : (sectionData.primary_button_text || 'Start Free Trial'),
    secondaryBtn: isRTL ? 'تسجيل الدخول' : (sectionData.secondary_button_text || 'Login'),
    announcement: isRTL ? 'جديد: لوحة تحليلات متقدمة' : (sectionData.announcement_text || 'New: Advanced Analytics Dashboard'),
    stats: isRTL ? [] : [],
    dashboard: isRTL ? 'لوحة تحكم نشمي ستور' : 'Nashmi Store Dashboard',
    totalStores: isRTL ? 'إجمالي المتاجر' : 'Total Stores',
    revenue: isRTL ? 'الإيرادات' : 'Revenue',
    orders: isRTL ? 'الطلبات' : 'Orders',
    storeManagement: isRTL ? 'إدارة المتاجر' : 'Store Management',
    active: isRTL ? 'نشط' : 'Active',
    pending: isRTL ? 'قيد الانتظار' : 'Pending',
  };

  const titleWords = tx.title.split(' ');
  const firstHalf = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(' ');
  const secondHalf = titleWords.slice(Math.ceil(titleWords.length / 2)).join(' ');

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-gray-200/60 bg-white/60 backdrop-blur-sm text-gray-700 shadow-sm">
              <Sparkles className="w-4 h-4" style={{ color: brandColor }} />
              {tx.announcement}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight">
              <span className="text-gray-900">{firstHalf}</span>
              <br />
              <span className="bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${brandColor}, ${secondaryColor})` }}>
                {secondHalf}
              </span>
            </h1>

            <p className={`text-lg sm:text-xl text-gray-500 leading-relaxed max-w-xl mx-auto lg:${isRTL ? 'mr-0' : 'ml-0'}`}>
              {tx.subtitle}
            </p>

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

            {/* Stats - hidden when empty */}
            {tx.stats.length > 0 && <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
              {tx.stats.map((stat: any, index: number) => (
                <div key={index} className={`text-center lg:${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${brandColor}, ${secondaryColor})` }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 font-medium mt-1">{stat.label}</div>
                </div>
              ))}
            </div>}
          </div>

          {/* Right Content - Code-built Dashboard Mockup */}
          <div className="relative lg:flex lg:justify-center">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-2 border-dashed opacity-10" style={{ borderColor: brandColor }}></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full border-2 border-dashed opacity-10" style={{ borderColor: secondaryColor }}></div>
            <div className="absolute top-10 right-10 w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: brandColor }}></div>
            <div className="absolute bottom-20 left-5 w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: secondaryColor, animationDelay: '1s' }}></div>

            <div className="relative transform hover:scale-[1.02] transition-transform duration-500">
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
