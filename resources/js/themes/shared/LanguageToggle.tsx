import React from 'react';
import { useStoreLanguage } from './StoreLanguageContext';

interface LanguageToggleProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'pill';
}

export default function LanguageToggle({ className = '', variant = 'pill' }: LanguageToggleProps) {
  const { language, toggleLanguage, isArabic } = useStoreLanguage();

  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleLanguage}
        className={`inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
        title={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span>{isArabic ? 'EN' : 'عربي'}</span>
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleLanguage}
        className={`relative inline-flex items-center h-8 rounded-full w-[72px] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 ${
          isArabic ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
        } ${className}`}
        title={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
      >
        <span className={`absolute left-2 text-xs font-bold transition-opacity duration-300 ${isArabic ? 'opacity-100 text-white' : 'opacity-50 text-gray-600 dark:text-gray-300'}`}>
          ع
        </span>
        <span className={`absolute right-2 text-xs font-bold transition-opacity duration-300 ${!isArabic ? 'opacity-100 text-gray-700 dark:text-white' : 'opacity-50 text-white'}`}>
          EN
        </span>
        <span
          className={`inline-block w-6 h-6 transform bg-white rounded-full shadow-md transition-transform duration-300 ${
            isArabic ? 'translate-x-[44px]' : 'translate-x-[2px]'
          }`}
        />
      </button>
    );
  }

  // Default variant
  return (
    <div className={`inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <button
        onClick={() => !isArabic || toggleLanguage()}
        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
          !isArabic
            ? 'bg-green-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => isArabic || toggleLanguage()}
        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
          isArabic
            ? 'bg-green-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        عربي
      </button>
    </div>
  );
}
