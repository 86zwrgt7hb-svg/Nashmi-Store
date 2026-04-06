import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBrand } from '@/contexts/BrandContext';
import { getImageUrl } from '@/utils/image-helper';

interface CustomPage {
  id: number;
  title: string;
  slug: string;
}

interface HeaderProps {
  brandColor?: string;
  settings: {
    company_name: string;
  };
  sectionData?: any;
  customPages?: CustomPage[];
  user?: any;
  superadminLogoDark?: string;
  superadminLogoLight?: string;
}

export default function Header({ settings, sectionData, customPages = [], brandColor = '#6366f1', user, superadminLogoDark, superadminLogoLight }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === 'ar' || document.documentElement.dir === 'rtl';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set default language to Arabic on first visit
  useEffect(() => {
    const userChoice = localStorage.getItem('userLanguageChoice');
    if (!userChoice) {
      // No explicit user choice yet - force Arabic as default
      i18n.changeLanguage('ar');
      document.documentElement.dir = 'rtl';
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.lang = 'ar';
      localStorage.setItem('layoutDirection', 'rtl');
      localStorage.setItem('i18nextLng', 'ar');
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    const newDir = newLang === 'ar' ? 'rtl' : 'ltr';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newDir;
    document.documentElement.setAttribute('dir', newDir);
    document.documentElement.lang = newLang;
    localStorage.setItem('layoutDirection', newDir);
    localStorage.setItem('i18nextLng', newLang);
    // Mark that user explicitly chose a language
    localStorage.setItem('userLanguageChoice', newLang);
  };

  // Filter out legal pages from header navigation (they belong in footer only)
  const legalSlugs = ['privacy-policy', 'terms-and-conditions', 'refund-policy'];
  const menuItems = customPages
    .filter(page => !legalSlugs.includes(page.slug))
    .map(page => ({
      name: page.title,
      href: route('custom-page.show', page.slug)
    }));

  const isTransparent = sectionData?.transparent;
  const backgroundColor = sectionData?.background_color || '#ffffff';

  const navLinks = [
    { name: t('Features'), href: '#features' },
    { name: t('Themes'), href: '#themes' },
    { name: t('Pricing'), href: '#pricing' },
    { name: t('Contact'), href: '#contact' },
    ...menuItems,
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_2px_30px_-10px_rgba(0,0,0,0.1)] border-b border-white/20'
          : isTransparent ? 'bg-transparent' : ''
      }`}
      style={!isTransparent && !isScrolled ? { backgroundColor } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {superadminLogoDark ? (
              <img loading="lazy"
                src={getImageUrl(superadminLogoDark)}
                alt={settings.company_name}
                className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {settings.company_name}
              </span>
            )}
          </Link>

          <span className="ml-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white rounded-full shadow-sm animate-pulse">Beta</span>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-300 rounded-lg hover:bg-gray-50/80"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-300 border border-gray-200/60"
              title={isRTL ? 'Switch to English' : 'التبديل للعربية'}
            >
              <Globe className="w-4 h-4" />
              <span>{isRTL ? 'EN' : 'عربي'}</span>
            </button>

            {user ? (
              <Link
                href={route('dashboard')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{ backgroundColor: brandColor }}
              >
                {t('Dashboard')}
              </Link>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-300"
                >
                  {t('Login')}
                </Link>
                <Link
                  href={route('register')}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
                  style={{
                    backgroundColor: brandColor,
                    boxShadow: `0 4px 15px -3px ${brandColor}50`
                  }}
                >
                  {t('Get Started')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Language + Menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200/60"
              title={isRTL ? 'Switch to English' : 'التبديل للعربية'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{isRTL ? 'EN' : 'عربي'}</span>
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-1 border-t border-gray-100">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-3 space-y-2 border-t border-gray-100 mt-2">
              {user ? (
                <Link
                  href={route('dashboard')}
                  className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: brandColor }}
                >
                  {t('Dashboard')}
                </Link>
              ) : (
                <>
                  <Link
                    href={route('login')}
                    className="block w-full text-center py-3 text-gray-600 text-sm font-medium"
                  >
                    {t('Login')}
                  </Link>
                  <Link
                    href={route('register')}
                    className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: brandColor }}
                  >
                    {t('Get Started')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
