import React, { useEffect, useState, useMemo } from 'react';
import { X, Smartphone, Wifi, Zap, Home, Plus } from 'lucide-react';
import { getImageUrl } from '@/utils/image-helper';

interface PWAInstallPopupProps {
  isVisible: boolean;
  onInstall: () => void;
  onClose: () => void;
  onLater: () => void;
  storeName: string;
  storeIcon?: string;
  themeColors?: {
    primary: string;
    background: string;
  };
  language?: 'ar' | 'en';
}

type BrowserType = 'ios-safari' | 'ios-chrome' | 'android-chrome' | 'android-other' | 'desktop-chrome' | 'desktop-other';

function detectBrowser(): BrowserType {
  if (typeof navigator === 'undefined') return 'desktop-other';
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua) && !/FxiOS/.test(ua);
  const isChrome = /Chrome/.test(ua) && !/Edg/.test(ua);
  const isCriOS = /CriOS/.test(ua);

  if (isIOS && isSafari) return 'ios-safari';
  if (isIOS && (isCriOS || isChrome)) return 'ios-chrome';
  if (isAndroid && isChrome) return 'android-chrome';
  if (isAndroid) return 'android-other';
  if (isChrome) return 'desktop-chrome';
  return 'desktop-other';
}

interface GuideStep {
  icon: React.ReactNode;
  text: string;
  bold: string;
  after?: string;
}

function getGuideSteps(browser: BrowserType, lang: 'ar' | 'en'): { title: string; steps: GuideStep[] } {
  const isAr = lang === 'ar';

  // Share icon SVG for iOS
  const shareIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
      <polyline points="16 6 12 2 8 6"/>
      <line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  );

  // Three dots menu icon for Chrome/Android
  const menuIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1.5" fill="#007AFF"/>
      <circle cx="12" cy="12" r="1.5" fill="#007AFF"/>
      <circle cx="12" cy="19" r="1.5" fill="#007AFF"/>
    </svg>
  );

  switch (browser) {
    case 'ios-safari':
      return {
        title: isAr ? 'طريقة التثبيت' : 'How to Install',
        steps: [
          {
            icon: shareIcon,
            text: isAr ? 'اضغط على زر' : 'Tap the',
            bold: isAr ? 'المشاركة' : 'Share',
            after: isAr ? 'في أسفل الشاشة' : 'button at the bottom of your screen',
          },
          {
            icon: <Plus className="w-4 h-4 text-blue-600" />,
            text: isAr ? 'مرر للأسفل واضغط' : 'Scroll down and tap',
            bold: isAr ? 'إضافة إلى الشاشة الرئيسية' : 'Add to Home Screen',
          },
          {
            icon: null,
            text: isAr ? 'اضغط' : 'Tap',
            bold: isAr ? 'إضافة' : 'Add',
            after: isAr ? 'في أعلى الشاشة' : 'in the top right corner',
          },
        ],
      };

    case 'ios-chrome':
      return {
        title: isAr ? 'طريقة التثبيت' : 'How to Install',
        steps: [
          {
            icon: shareIcon,
            text: isAr ? 'اضغط على زر' : 'Tap the',
            bold: isAr ? 'المشاركة' : 'Share',
            after: isAr ? 'في أعلى الشاشة' : 'button at the top of your screen',
          },
          {
            icon: <Plus className="w-4 h-4 text-blue-600" />,
            text: isAr ? 'اضغط' : 'Tap',
            bold: isAr ? 'إضافة إلى الشاشة الرئيسية' : 'Add to Home Screen',
          },
          {
            icon: null,
            text: isAr ? 'اضغط' : 'Tap',
            bold: isAr ? 'إضافة' : 'Add',
            after: isAr ? 'للتأكيد' : 'to confirm',
          },
        ],
      };

    case 'android-chrome':
      return {
        title: isAr ? 'طريقة التثبيت' : 'How to Install',
        steps: [
          {
            icon: menuIcon,
            text: isAr ? 'اضغط على' : 'Tap the',
            bold: isAr ? 'القائمة ⋮' : 'Menu ⋮',
            after: isAr ? 'في أعلى يمين الشاشة' : 'at the top right of your screen',
          },
          {
            icon: <Plus className="w-4 h-4 text-blue-600" />,
            text: isAr ? 'اضغط' : 'Tap',
            bold: isAr ? 'إضافة إلى الشاشة الرئيسية' : 'Add to Home Screen',
          },
          {
            icon: null,
            text: isAr ? 'اضغط' : 'Tap',
            bold: isAr ? 'إضافة' : 'Add',
            after: isAr ? 'للتأكيد' : 'to confirm',
          },
        ],
      };

    case 'android-other':
      return {
        title: isAr ? 'طريقة التثبيت' : 'How to Install',
        steps: [
          {
            icon: menuIcon,
            text: isAr ? 'افتح' : 'Open the',
            bold: isAr ? 'قائمة المتصفح' : 'browser menu',
            after: isAr ? '(⋮ أو ☰)' : '(⋮ or ☰)',
          },
          {
            icon: <Plus className="w-4 h-4 text-blue-600" />,
            text: isAr ? 'ابحث عن' : 'Look for',
            bold: isAr ? 'إضافة إلى الشاشة الرئيسية' : 'Add to Home Screen',
            after: isAr ? 'أو "تثبيت التطبيق"' : 'or "Install App"',
          },
          {
            icon: null,
            text: isAr ? 'اضغط' : 'Tap',
            bold: isAr ? 'إضافة' : 'Add',
            after: isAr ? 'للتأكيد' : 'to confirm',
          },
        ],
      };

    case 'desktop-chrome':
      return {
        title: isAr ? 'طريقة التثبيت' : 'How to Install',
        steps: [
          {
            icon: menuIcon,
            text: isAr ? 'اضغط على' : 'Click the',
            bold: isAr ? 'القائمة ⋮' : 'Menu ⋮',
            after: isAr ? 'في أعلى يمين المتصفح' : 'at the top right of your browser',
          },
          {
            icon: <Plus className="w-4 h-4 text-blue-600" />,
            text: isAr ? 'اختر' : 'Select',
            bold: isAr ? 'تثبيت التطبيق' : 'Install App',
            after: isAr ? 'أو "إضافة إلى الشاشة الرئيسية"' : 'or "Add to Home Screen"',
          },
          {
            icon: null,
            text: isAr ? 'اضغط' : 'Click',
            bold: isAr ? 'تثبيت' : 'Install',
            after: isAr ? 'للتأكيد' : 'to confirm',
          },
        ],
      };

    default: // desktop-other
      return {
        title: isAr ? 'طريقة التثبيت' : 'How to Install',
        steps: [
          {
            icon: menuIcon,
            text: isAr ? 'افتح' : 'Open the',
            bold: isAr ? 'قائمة المتصفح' : 'browser menu',
          },
          {
            icon: <Plus className="w-4 h-4 text-blue-600" />,
            text: isAr ? 'ابحث عن' : 'Look for',
            bold: isAr ? 'تثبيت التطبيق' : 'Install App',
            after: isAr ? 'أو "إضافة إلى الشاشة الرئيسية"' : 'or "Add to Home Screen"',
          },
          {
            icon: null,
            text: isAr ? 'اضغط' : 'Click',
            bold: isAr ? 'تثبيت' : 'Install',
            after: isAr ? 'للتأكيد' : 'to confirm',
          },
        ],
      };
  }
}

const translations = {
  en: {
    addToHomeScreen: 'Add to Home Screen',
    installDescription: 'Install this app on your device for quick access and a better experience. It works offline and loads faster.',
    worksOffline: 'Works Offline',
    lightningFast: 'Lightning Fast',
    easyAccess: 'Easy Access',
    maybeLater: 'Maybe Later',
    installNow: 'Add to Home Screen',
    gotIt: 'Got it!',
  },
  ar: {
    addToHomeScreen: 'أضف إلى الشاشة الرئيسية',
    installDescription: 'ثبّت هذا التطبيق على جهازك للوصول السريع وتجربة أفضل. يعمل بدون إنترنت ويُحمّل بشكل أسرع.',
    worksOffline: 'يعمل بدون إنترنت',
    lightningFast: 'سرعة فائقة',
    easyAccess: 'وصول سهل',
    maybeLater: 'لاحقاً',
    installNow: 'أضف إلى الشاشة الرئيسية',
    gotIt: 'فهمت!',
  }
};

export default function PWAInstallPopup({ 
  isVisible, 
  onInstall, 
  onClose, 
  onLater,
  storeName,
  storeIcon,
  themeColors,
  language = 'en',
}: PWAInstallPopupProps) {
  const isAr = language === 'ar';
  const t = translations[isAr ? 'ar' : 'en'];
  const [showGuide, setShowGuide] = useState(false);

  const browser = useMemo(() => detectBrowser(), []);
  const guide = useMemo(() => getGuideSteps(browser, language), [browser, language]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  // Reset guide state when popup visibility changes
  useEffect(() => {
    if (!isVisible) {
      setShowGuide(false);
    }
  }, [isVisible]);
  
  if (!isVisible) return null;

  const primaryColor = themeColors?.primary || '#3B82F6';

  const handleInstallClick = () => {
    // Always show the step-by-step guide on all browsers
    setShowGuide(true);
  };

  // Step-by-step guide view (for ALL browsers)
  if (showGuide) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-hidden">
        <div 
          className="bg-white rounded-2xl w-full max-w-md mx-auto shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-gray-100">
            <button
              onClick={onClose}
              className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} p-2 hover:bg-gray-100 rounded-full transition-colors`}
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
            
            <div className="flex items-center gap-4">
              {storeIcon ? (
                <img loading="lazy" src={getImageUrl(storeIcon)} alt={storeName} className="w-14 h-14 rounded-xl object-contain border-2 border-gray-100 bg-white p-1" />
              ) : (
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center border-2 border-gray-100"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Smartphone className="w-7 h-7 text-white" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {guide.title}
                </h3>
                <p className="text-gray-500 text-sm">{storeName}</p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="p-6 space-y-5">
            {guide.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${index === guide.steps.length - 1 ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-center`}>
                  <span className={`${index === guide.steps.length - 1 ? 'text-green-600' : 'text-blue-600'} font-bold text-lg`}>{index + 1}</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-700 text-[15px] leading-relaxed">
                    {step.text}{' '}
                    {step.icon ? (
                      <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md">
                        {step.icon}
                        <strong className="text-blue-600">{step.bold}</strong>
                      </span>
                    ) : (
                      <strong className="text-blue-600 bg-gray-100 px-2 py-0.5 rounded-md">{step.bold}</strong>
                    )}
                    {step.after ? ` ${step.after}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Got it button */}
          <div className="p-6 pt-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-4 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              style={{ 
                backgroundColor: primaryColor,
                boxShadow: `0 4px 14px 0 ${primaryColor}40`
              }}
            >
              {t.gotIt}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default install popup view
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-hidden">
      <div 
        className="bg-white rounded-2xl w-full max-w-md mx-auto shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} p-2 hover:bg-gray-100 rounded-full transition-colors`}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="flex items-center gap-4">
            {storeIcon ? (
              <img loading="lazy" src={getImageUrl(storeIcon)} alt={storeName} className="w-16 h-16 rounded-xl object-contain border-2 border-gray-100 bg-white p-1" />
            ) : (
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center border-2 border-gray-100"
                style={{ backgroundColor: primaryColor }}
              >
                <Smartphone className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-xl mb-1">
                {storeName}
              </h3>
              <p className="text-gray-500 text-sm">
                {t.addToHomeScreen}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            {t.installDescription}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-50 flex items-center justify-center">
                <Wifi className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">{t.worksOffline}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-50 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">{t.lightningFast}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-50 flex items-center justify-center">
                <Home className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium">{t.easyAccess}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={`p-6 pt-0 flex gap-3 ${isAr ? 'flex-row-reverse' : 'flex-row'}`}>
          <button
            onClick={onLater}
            className="flex-1 py-3 px-4 text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {t.maybeLater}
          </button>
          <button
            onClick={handleInstallClick}
            className="flex-1 py-3 px-4 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{ 
              backgroundColor: primaryColor,
              boxShadow: `0 4px 14px 0 ${primaryColor}40`
            }}
          >
            <Plus className="w-4 h-4" />
            {t.installNow}
          </button>
        </div>
      </div>
    </div>
  );
}
