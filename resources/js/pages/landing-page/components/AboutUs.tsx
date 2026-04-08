import React, { useState } from 'react';
import { Target, Heart, Handshake, Eye, Crown, Infinity } from 'lucide-react';
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
      title: isRTL ? 'مهمتنا' : 'Our Mission',
      content: isRTL
        ? 'نؤمن أن كل تاجر يستحق متجراً إلكترونياً احترافياً بدون أن يُثقل كاهله برسوم شهرية. مهمتنا هي تمكين رواد الأعمال في الأردن والعالم العربي من امتلاك متاجرهم الإلكترونية بدفعة واحدة فقط، مع استضافة ودعم مدى الحياة.'
        : 'We believe every merchant deserves a professional online store without the burden of monthly fees. Our mission is to empower entrepreneurs in Jordan and the Arab world to own their online stores with a single payment, with lifetime hosting and support.',
    },
    {
      key: 'values',
      icon: Heart,
      title: isRTL ? 'قيمنا' : 'Our Values',
      content: isRTL
        ? 'الشفافية في التسعير هي أساس عملنا. لا رسوم مخفية، لا مفاجآت، لا تجديدات تلقائية. ندفعك للنجاح بتوفير كل الأدوات التي تحتاجها بسعر واحد عادل. نؤمن أن نجاحك هو نجاحنا.'
        : 'Transparent pricing is the foundation of our business. No hidden fees, no surprises, no auto-renewals. We push you to succeed by providing all the tools you need at one fair price. We believe your success is our success.',
    },
    {
      key: 'commitment',
      icon: Handshake,
      title: isRTL ? 'التزامنا' : 'Our Commitment',
      content: isRTL
        ? 'عندما تشتري رخصة "مدى الحياة"، فهذا وعد حقيقي. نلتزم بتقديم تحديثات مستمرة، دعم فني مخصص، واستضافة مجانية طالما متجرك يعمل. متجرك ملكك، وبياناتك ملكك.'
        : 'When you buy a "Lifetime" license, it\'s a real promise. We commit to providing continuous updates, dedicated technical support, and free hosting as long as your store is running. Your store is yours, and your data is yours.',
    },
    {
      key: 'vision',
      icon: Eye,
      title: isRTL ? 'رؤيتنا' : 'Our Vision',
      content: isRTL
        ? 'أن نصبح المنصة الأولى في العالم العربي للتجارة الإلكترونية بنموذج "ادفع مرة واحدة". نطمح لتمكين 10,000 تاجر من امتلاك متاجرهم الإلكترونية بحلول 2028، وتغيير مفهوم التجارة الإلكترونية في المنطقة.'
        : 'To become the #1 e-commerce platform in the Arab world with a "pay once" model. We aspire to empower 10,000 merchants to own their online stores by 2028, and change the concept of e-commerce in the region.',
    },
  ];

  const activeTabData = tabs.find(tab => tab.key === activeTab) || tabs[0];

  const tx = {
    title: isRTL ? 'عن نشمي ستور' : 'About Nashmi Store',
    subtitle: isRTL ? 'المنصة الوحيدة التي تمنحك متجراً إلكترونياً مدى الحياة بدفعة واحدة' : 'The only platform that gives you a lifetime online store with a single payment',
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
