import React from 'react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '@/utils/image-helper';
import { Store, ArrowRight } from 'lucide-react';

interface FeaturedStore {
  id: number;
  name: string;
  description: string;
  slug: string;
  logo: string;
}

interface ActiveCampaignsSectionProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    title?: string;
    subtitle?: string;
    [key: string]: any;
  };
  featuredStores?: FeaturedStore[];
}

export default function ActiveCampaignsSection({ settings, sectionData, featuredStores = [], brandColor = '#6366f1' }: ActiveCampaignsSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { ref, isVisible } = useScrollAnimation();

  if (!featuredStores || featuredStores.length === 0) return null;

  const tx = {
    badge: isRTL ? 'متاجر مميزة' : 'Featured Stores',
    title: isRTL ? 'متاجر بُنيت معنا' : (sectionData.title || 'Stores Built With Us'),
    subtitle: isRTL ? 'اكتشف متاجر ناجحة تعمل على منصتنا.' : (sectionData.subtitle || 'Discover successful stores powered by our platform.'),
  };

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden" ref={ref} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50/30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-gray-200/60 bg-white/60 backdrop-blur-sm text-gray-600">
            <Store className="w-4 h-4" style={{ color: brandColor }} />
            {tx.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 tracking-tight">{tx.title}</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{tx.subtitle}</p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {featuredStores.map((store) => (
            <a key={store.id} href={`/${store.slug}`} className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                {store.logo ? (
                  <img loading="lazy" src={getImageUrl(store.logo)} alt={store.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold" style={{ background: `linear-gradient(135deg, ${brandColor}, var(--secondary-color, #8b5cf6))` }}>
                    {store.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 truncate">{store.name}</h3>
                {store.description && <p className="text-sm text-gray-500 truncate">{store.description}</p>}
              </div>
              <ArrowRight className={`w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
