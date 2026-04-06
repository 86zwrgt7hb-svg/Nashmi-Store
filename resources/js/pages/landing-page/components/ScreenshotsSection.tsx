import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { Monitor } from 'lucide-react';

interface ScreenshotsSectionProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    title?: string;
    subtitle?: string;
    screenshots?: Array<{ title: string; image: string; description?: string }>;
    [key: string]: any;
  };
}

export default function ScreenshotsSection({ settings, sectionData, brandColor = '#6366f1' }: ScreenshotsSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const { i18n } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();
  const isRTL = i18n.language === 'ar';

  // Auto-rotate tabs every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab(prev => (prev + 1) % 6);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const tx = {
    badge: isRTL ? 'شاهد المنصة الحقيقية' : 'See the Real Platform',
    title: isRTL ? 'كل شيء بسيط وسريع' : 'Everything is Simple & Fast',
    subtitle: isRTL ? 'شاهد لقطات حقيقية من لوحة التحكم والمتجر - هذا بالضبط ما ستحصل عليه' : 'See real screenshots from the dashboard and store - this is exactly what you get',
  };

  const tabs = [
    {
      label: isRTL ? 'لوحة التحكم' : 'Dashboard',
      desc: isRTL ? 'تحكم كامل بمتجرك من مكان واحد' : 'Full control of your store from one place',
      image: isRTL ? '/images/screenshots/dashboard_ar.png' : '/images/screenshots/dashboard_en.png',
      url: 'https://nashmistore.com/dashboard',
    },
    {
      label: isRTL ? 'المنتجات' : 'Products',
      desc: isRTL ? 'إدارة كتالوج المنتجات بسهولة' : 'Manage your product catalog easily',
      image: isRTL ? '/images/screenshots/products_ar.png' : '/images/screenshots/products_en.png',
      url: 'https://nashmistore.com/products',
    },
    {
      label: isRTL ? 'إضافة منتج' : 'Add Product',
      desc: isRTL ? 'أضف منتجاتك بخطوات بسيطة' : 'Add your products in simple steps',
      image: isRTL ? '/images/screenshots/add_product_ar.png' : '/images/screenshots/add_product_en.png',
      url: 'https://nashmistore.com/products/create',
    },
    {
      label: isRTL ? 'المتجر الإلكتروني' : 'Online Store',
      desc: isRTL ? 'متجرك الإلكتروني الجاهز للعملاء' : 'Your online store ready for customers',
      image: isRTL ? '/images/screenshots/store_ar.png' : '/images/screenshots/store_en.png',
      url: 'https://yourstore.nashmistore.com',
    },
    {
      label: isRTL ? 'نظام POS' : 'POS System',
      desc: isRTL ? 'نقطة بيع متكاملة للمحل' : 'Complete point of sale for your shop',
      image: isRTL ? '/images/screenshots/pos_ar.png' : '/images/screenshots/pos_en.png',
      url: 'https://nashmistore.com/pos',
    },
    {
      label: isRTL ? 'التحليلات' : 'Analytics',
      desc: isRTL ? 'تقارير وإحصائيات مفصّلة' : 'Detailed reports and statistics',
      image: isRTL ? '/images/screenshots/analytics_ar.png' : '/images/screenshots/analytics_en.png',
      url: 'https://nashmistore.com/analytics',
    },
  ];

  return (
    <section ref={ref} className={`py-20 bg-gradient-to-b from-gray-50 to-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-4">
            <Monitor className="w-4 h-4" />
            {tx.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{tx.title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{tx.subtitle}</p>
        </div>

        {/* Text-only Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                activeTab === idx
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200'
              }`}
              style={activeTab === idx ? { backgroundColor: brandColor, boxShadow: `0 10px 25px -5px ${brandColor}40` } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Screenshot Display */}
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
            {/* Browser Chrome */}
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-gray-700 rounded-lg px-4 py-1.5 text-gray-300 text-sm text-center truncate">
                {tabs[activeTab].url}
              </div>
            </div>

            {/* Screenshot Image */}
            <div className="relative bg-gray-100 overflow-hidden" style={{ minHeight: '400px' }}>
              {tabs.map((tab, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-500 ${
                    activeTab === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <img loading="lazy"
                    src={tab.image}
                    alt={tab.label}
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tab indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {tabs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeTab === idx ? 'w-8' : 'w-2 bg-gray-300'
                }`}
                style={activeTab === idx ? { backgroundColor: brandColor } : {}}
              />
            ))}
          </div>

          {/* Description */}
          <p className="text-center text-sm text-gray-500 mt-3">{tabs[activeTab].desc}</p>
        </div>
      </div>
    </section>
  );
}
