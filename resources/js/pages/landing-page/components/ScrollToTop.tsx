import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 z-50 group flex items-center gap-2 px-4 py-3 rounded-full bg-gray-900/80 backdrop-blur-sm text-white shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105 ${isRTL ? 'left-8' : 'right-8'}`}
      aria-label={isRTL ? 'العودة للأعلى' : 'Back to top'}
    >
      <ArrowUp className="w-4 h-4" />
      <span className="text-sm font-medium">
        {isRTL ? 'العودة للأعلى' : 'Back to Top'}
      </span>
    </button>
  );
}
