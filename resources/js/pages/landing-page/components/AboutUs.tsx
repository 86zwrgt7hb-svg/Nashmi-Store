import React, { useState } from 'react';
import { Target, Heart, Handshake, Eye } from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';

interface AboutUsProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    title?: string;
    subtitle?: string;
    mission?: { title?: string; content?: string };
    values?: { title?: string; content?: string };
    commitment?: { title?: string; content?: string };
    vision?: { title?: string; content?: string };
    [key: string]: any;
  };
}

export default function AboutUs({ settings, sectionData, brandColor = '#6366f1' }: AboutUsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { ref, isVisible } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState('mission');

  const tabs = [
    {
      key: 'mission',
      icon: Target,
      title: isRTL ? 'مهمتنا' : (sectionData.mission?.title || 'Our Mission'),
      content: isRTL ? 'تمكين رواد الأعمال حول العالم بالأدوات التي يحتاجونها لبناء وتنمية أعمال تجارية ناجحة عبر الإنترنت.' : (sectionData.mission?.content || 'To empower entrepreneurs worldwide with the tools they need to build and grow successful online businesses.'),
    },
    {
      key: 'values',
      icon: Heart,
      title: isRTL ? 'قيمنا' : (sectionData.values?.title || 'Our Values'),
      content: isRTL ? 'الابتكار والشفافية ونجاح العملاء هي ما يحرك كل ما نفعله. نؤمن ببناء منتجات تحدث فرقاً حقيقياً.' : (sectionData.values?.content || 'Innovation, transparency, and customer success drive everything we do. We believe in building products that make a real difference.'),
    },
    {
      key: 'commitment',
      icon: Handshake,
      title: isRTL ? 'التزامنا' : (sectionData.commitment?.title || 'Our Commitment'),
      content: isRTL ? 'نلتزم بتقديم حلول موثوقة وآمنة وقابلة للتوسع تنمو مع احتياجات عملك.' : (sectionData.commitment?.content || 'We are committed to providing reliable, secure, and scalable solutions that grow with your business needs.'),
    },
    {
      key: 'vision',
      icon: Eye,
      title: isRTL ? 'رؤيتنا' : (sectionData.vision?.title || 'Our Vision'),
      content: isRTL ? 'أن نصبح المنصة الرائدة للتجارة الإلكترونية متعددة المتاجر، مما يمكّن ملايين الأعمال من الازدهار في الاقتصاد الرقمي.' : (sectionData.vision?.content || 'To become the leading multi-store e-commerce platform, enabling millions of businesses to thrive in the digital economy.'),
    },
  ];

  const activeTabData = tabs.find(tab => tab.key === activeTab) || tabs[0];

  const tx = {
    title: isRTL ? 'عن نشمي ستور' : (sectionData.title || 'About Nashmi Store'),
    subtitle: isRTL ? 'تعرف أكثر على مهمتنا وما يدفعنا للأمام' : (sectionData.subtitle || 'Learn more about our mission and what drives us forward'),
  };

  return (
    <section id="about" className="relative py-20 sm:py-28 overflow-hidden" ref={ref} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50/30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">{tx.title}</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{tx.subtitle}</p>
        </div>

        <div className={`max-w-4xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {tabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive ? 'text-white shadow-lg scale-105' : 'text-gray-600 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`} style={isActive ? { background: `linear-gradient(135deg, ${brandColor}, var(--secondary-color, #8b5cf6))`, boxShadow: `0 8px 25px -5px ${brandColor}40` } : {}}>
                  <IconComp className="w-4 h-4" />
                  {tab.title}
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${brandColor}15, var(--secondary-color, #8b5cf6)15)` }}>
                <activeTabData.icon className="w-7 h-7" style={{ color: brandColor }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{activeTabData.title}</h3>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">{activeTabData.content}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
