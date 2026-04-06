import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

// Make i18n instance available for direct imports
export { default as i18next } from 'i18next';

// Determine initial language
// Logic: 
// 1. If user has explicitly chosen a language (via any language toggle), use that
// 2. If no choice has been made (first visit), default to Arabic
const getInitialLang = () => {
    if (typeof window !== 'undefined') {
        // Check if user has ever made a language choice
        const userChose = localStorage.getItem('userLanguageChoice');
        if (userChose) return userChose;
        
        // First visit - set Arabic as default and mark it
        localStorage.setItem('userLanguageChoice', 'ar');
    }
    return 'ar';
};

const initialLang = getInitialLang();

// Initialize i18n
i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        fallbackLng: 'ar',
        lng: initialLang,
        load: 'currentOnly',
        debug: false,
        
        interpolation: {
            escapeValue: false,
        },
        
        backend: {
            loadPath: (lng) => window.route ? window.route("translations", lng) : "/translations/" + lng,
            requestOptions: {
                cache: 'default'
            }
        },
        ns: ['translation'],
        defaultNS: 'translation',
        
        saveMissing: false,
        
        partialBundledLanguages: true,
        loadOnInitialization: true
    });

// Set initial direction immediately
if (typeof document !== 'undefined') {
    const dir = initialLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.lang = initialLang;
    localStorage.setItem('i18nextLng', initialLang);
    localStorage.setItem('layoutDirection', dir);
}

// Export the initialized instance
export default i18n;

// Make sure the i18n instance is available for direct imports
if (typeof window !== 'undefined') {
    window.i18next = i18n;
}
