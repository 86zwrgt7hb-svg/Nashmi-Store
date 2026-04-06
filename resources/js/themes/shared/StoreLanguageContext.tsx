import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface StoreLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isArabic: boolean;
  getLocalizedField: (item: any, field: string) => string;
}

const StoreLanguageContext = createContext<StoreLanguageContextType | undefined>(undefined);

export function StoreLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('store_language') as Language) || 'en';
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('store_language', lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const isArabic = language === 'ar';

  // Helper function to get the localized field value with fallback
  const getLocalizedField = (item: any, field: string): string => {
    if (!item) return '';
    if (language === 'ar') {
      const arField = item[`${field}_ar`];
      // If Arabic field exists and is not empty, use it; otherwise fallback to English
      if (arField && arField.trim && arField.trim() !== '') {
        return arField;
      }
    }
    return item[field] || '';
  };

  // Update document direction when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const storeContent = document.getElementById('store-content');
      if (storeContent) {
        storeContent.dir = isArabic ? 'rtl' : 'ltr';
      }
    }
  }, [isArabic]);

  return (
    <StoreLanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isArabic, getLocalizedField }}>
      {children}
    </StoreLanguageContext.Provider>
  );
}

export function useStoreLanguage() {
  const context = useContext(StoreLanguageContext);
  if (context === undefined) {
    throw new Error('useStoreLanguage must be used within a StoreLanguageProvider');
  }
  return context;
}

export default StoreLanguageContext;
