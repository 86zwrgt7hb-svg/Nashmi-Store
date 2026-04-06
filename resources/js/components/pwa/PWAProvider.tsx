import React, { useEffect, useState } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import PWAInstallPopup from './PWAInstallPopup';
import PWAMetaTags from './PWAMetaTags';
import PWAServiceWorker from './PWAServiceWorker';

interface PWAProviderProps {
  children: React.ReactNode;
  store?: {
    favicon?: string;
    pwa?: {
      enabled: boolean;
      name: string;
      short_name: string;
      description: string;
      theme_color: string;
      background_color: string;
      icon?: string;
      manifest_url: string;
      sw_url: string;
    };
  };
}

export default function PWAProvider({ children, store }: PWAProviderProps) {
  const { canInstall, install } = usePWAInstall();
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [storeLanguage, setStoreLanguage] = useState<'ar' | 'en'>('en');

  // Detect store language from localStorage (set by StoreLanguageContext)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('store_language');
      if (savedLang === 'ar' || savedLang === 'en') {
        setStoreLanguage(savedLang);
      }
      
      // Listen for language changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'store_language' && (e.newValue === 'ar' || e.newValue === 'en')) {
          setStoreLanguage(e.newValue);
        }
      };
      window.addEventListener('storage', handleStorageChange);
      
      // Also poll for changes (since same-tab localStorage changes don't trigger storage event)
      const interval = setInterval(() => {
        const lang = localStorage.getItem('store_language');
        if (lang === 'ar' || lang === 'en') {
          setStoreLanguage(lang);
        }
      }, 1000);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, []);

  useEffect(() => {
    if (!store?.pwa?.enabled) return;
    
    // Show popup after delay
    const timer = setTimeout(() => {
      const dismissedAt = localStorage.getItem('pwa-install-dismissed-at');
      const appInstalled = localStorage.getItem('pwa-app-installed');
      const laterThisSession = sessionStorage.getItem('pwa-install-later');
      
      // Check if dismissed via X button - show again after 24 hours
      let isDismissedByClose = false;
      if (dismissedAt) {
        const dismissTime = parseInt(dismissedAt, 10);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (now - dismissTime < twentyFourHours) {
          isDismissedByClose = true;
        } else {
          // 24 hours passed, remove the flag
          localStorage.removeItem('pwa-install-dismissed-at');
        }
      }
      
      // Check if PWA is already installed
      const isPWAInstalled = () => {
        return window.matchMedia('(display-mode: standalone)').matches ||
               (window.navigator as any).standalone === true ||
               document.referrer.includes('android-app://') ||
               window.matchMedia('(display-mode: minimal-ui)').matches ||
               window.matchMedia('(display-mode: fullscreen)').matches;
      };

      // Check if device is mobile
      const isMobile = () => {
        const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;
        return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      };
      
      if (!hasShownPopup && !isDismissedByClose && !laterThisSession && !appInstalled && !isPWAInstalled() && isMobile()) {
        setShowInstallPopup(true);
        setHasShownPopup(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [store?.pwa, canInstall, hasShownPopup]);

  // The install button now always shows the guide, so this handler is simplified
  const handleInstall = () => {
    // The PWAInstallPopup handles showing the guide internally
    // This is called but the popup component will show the guide instead
  };

  // X button: dismiss for 24 hours
  const handleClosePopup = () => {
    setShowInstallPopup(false);
    localStorage.setItem('pwa-install-dismissed-at', Date.now().toString());
  };

  // "Maybe Later" button: dismiss for this session only, show again next visit
  const handleLater = () => {
    setShowInstallPopup(false);
    sessionStorage.setItem('pwa-install-later', 'true');
  };

  return (
    <>
      {store?.pwa?.enabled && (
        <>
          <PWAMetaTags store={store} />
          <PWAServiceWorker store={store} />
          <PWAInstallPopup
            isVisible={showInstallPopup}
            onInstall={handleInstall}
            onClose={handleClosePopup}
            onLater={handleLater}
            storeName={store.pwa.name}
            storeIcon={store.favicon}
            themeColors={{
              primary: store.pwa.theme_color,
              background: store.pwa.background_color
            }}
            language={storeLanguage}
          />
        </>
      )}
      {children}
    </>
  );
}
