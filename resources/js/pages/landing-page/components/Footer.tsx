import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Mail, Phone, MapPin, CheckCircle, Send, Heart, Shield } from 'lucide-react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaTiktok, FaPinterest, FaSnapchat, FaWhatsapp, FaTelegram, FaDiscord, FaReddit, FaTwitch, FaGithub, FaDribbble, FaBehance } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useBrand } from '@/contexts/BrandContext';
import { getImageUrl } from '@/utils/image-helper';

interface FooterProps {
  brandColor?: string;
  settings: {
    company_name: string;
    contact_email: string;
    contact_phone: string;
    contact_address: string;
  };
  sectionData?: {
    description?: string;
    newsletter_title?: string;
    newsletter_subtitle?: string;
    links?: any;
    social_links?: Array<{ name: string; icon: string; href: string }>;
    section_titles?: { product: string; company: string; support: string; legal: string };
  };
  superadminLogoLight?: string;
}

const socialIconMap: Record<string, React.ComponentType<any>> = {
  facebook: FaFacebook, twitter: FaTwitter, linkedin: FaLinkedin, instagram: FaInstagram,
  youtube: FaYoutube, tiktok: FaTiktok, pinterest: FaPinterest, snapchat: FaSnapchat,
  whatsapp: FaWhatsapp, telegram: FaTelegram, discord: FaDiscord, reddit: FaReddit,
  twitch: FaTwitch, github: FaGithub, dribbble: FaDribbble, behance: FaBehance,
};

export default function Footer({ settings, sectionData = {}, brandColor = '#6366f1', superadminLogoLight }: FooterProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { footerText } = useBrand();
  const currentYear = new Date().getFullYear();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({ email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('landing-page.subscribe'), {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitted(true);
        reset();
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    });
  };

  const tx = {
    description: isRTL ? 'المنصة الشاملة للتجارة الإلكترونية متعددة المتاجر للأعمال الحديثة.' : (sectionData.description || 'The complete multi-store e-commerce platform for modern businesses.'),
    product: isRTL ? 'المنتج' : (sectionData.section_titles?.product || 'Product'),
    company: isRTL ? 'الشركة' : (sectionData.section_titles?.company || 'Company'),
    contact: isRTL ? 'التواصل' : (sectionData.section_titles?.support || 'Contact'),
    legal: isRTL ? 'القانونية' : (sectionData.section_titles?.legal || 'Legal'),
    features: isRTL ? 'المميزات' : 'Features',
    themes: isRTL ? 'التصاميم' : 'Themes',
    pricing: isRTL ? 'الأسعار' : 'Pricing',
    faq: isRTL ? 'الأسئلة الشائعة' : 'FAQ',
    aboutUs: isRTL ? 'عن نشمي ستور' : 'About Us',
    contactUs: isRTL ? 'تواصل معنا' : 'Contact',
    privacyPolicy: isRTL ? 'سياسة الخصوصية' : 'Privacy Policy',
    termsConditions: isRTL ? 'الشروط والأحكام' : 'Terms & Conditions',
    refundPolicy: isRTL ? 'سياسة الاسترجاع' : 'Refund Policy',
    newsletterTitle: isRTL ? 'اشترك في نشرتنا البريدية' : (sectionData.newsletter_title || 'Subscribe to our newsletter'),
    newsletterSubtitle: isRTL ? 'احصل على آخر التحديثات والعروض.' : (sectionData.newsletter_subtitle || 'Get the latest updates and offers.'),
    emailPlaceholder: isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email',
    subscribed: isRTL ? 'تم الاشتراك بنجاح!' : 'Subscribed successfully!',
    rights: isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.',
    productOf: isRTL ? 'أحد منتجات' : 'A product of',
  };

  const productLinks = [
    { name: tx.features, href: '#features' },
    { name: tx.themes, href: '#themes' },
    { name: tx.pricing, href: '#pricing' },
    { name: tx.faq, href: '#faq' },
  ];

  const companyLinks = [
    { name: tx.aboutUs, href: '#about' },
    { name: tx.contactUs, href: '#contact' },
  ];

  const legalLinks = [
    { name: tx.privacyPolicy, href: '/page/privacy-policy' },
    { name: tx.termsConditions, href: '/page/terms-and-conditions' },
    { name: tx.refundPolicy, href: '/page/refund-policy' },
  ];

  const contactDetails = [
    { icon: Mail, value: settings.contact_email },
    { icon: Phone, value: settings.contact_phone },
    { icon: MapPin, value: settings.contact_address },
  ];

  return (
    <footer className="relative bg-gray-950 text-gray-300 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-5 blur-[100px]" style={{ background: `radial-gradient(circle, ${brandColor}, transparent)` }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-1">
            {superadminLogoLight ? (
              <img loading="lazy" src={getImageUrl(superadminLogoLight)} alt={settings.company_name} className="h-8 w-auto object-contain mb-4" />
            ) : (
              <h3 className="text-xl font-bold text-white mb-4">{settings.company_name}</h3>
            )}
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{tx.description}</p>
            <p className="text-xs text-gray-500 mb-6">
              {tx.productOf}{' '}
              <a href="https://urdun-tech.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">
                {isRTL ? 'أردن تك' : 'Urdun Tech'}
              </a>
            </p>
            {sectionData.social_links && sectionData.social_links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {sectionData.social_links.map((social, index) => {
                  const IconComp = socialIconMap[social.icon.toLowerCase()] || FaFacebook;
                  return (
                    <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:bg-gray-800" aria-label={social.name}>
                      <IconComp className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{tx.product}</h4>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <li key={index}><a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors duration-300">{link.name}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{tx.company}</h4>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}><a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors duration-300">{link.name}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{tx.legal}</h4>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}><a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors duration-300">{link.name}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{tx.contact}</h4>
            <ul className="space-y-3">
              {contactDetails.map((detail, index) => (
                <li key={index} className="flex items-start gap-3">
                  <detail.icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                  <span className="text-sm text-gray-400" dir="ltr">{detail.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-base font-semibold text-white mb-1">{tx.newsletterTitle}</h4>
              <p className="text-sm text-gray-400">{tx.newsletterSubtitle}</p>
            </div>
            {isSubmitted ? (
              <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                {tx.subscribed}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder={tx.emailPlaceholder} className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all" style={{ '--tw-ring-color': `${brandColor}40` } as any} required dir="ltr" />
                <button type="submit" disabled={processing} className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50" style={{ background: `linear-gradient(135deg, ${brandColor}, var(--secondary-color, #8b5cf6))` }}>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} {settings.company_name}. {tx.rights}
          </p>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-xs text-gray-600">
              {legalLinks.map((link, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span>|</span>}
                  <a href={link.href} className="hover:text-gray-400 transition-colors duration-300">{link.name}</a>
                </React.Fragment>
              ))}
            </div>
            {footerText && (
              <p className="text-sm text-gray-500 flex items-center gap-1">{footerText}</p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
