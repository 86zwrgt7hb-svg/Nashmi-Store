import { usePage } from '@inertiajs/react';

interface CurrencySettings {
    defaultCurrency?: string;
    decimalFormat?: string;
    decimalSeparator?: string;
    thousandsSeparator?: string;
    currencySymbolPosition?: string;
    currencySymbolSpace?: boolean | string;
    floatNumber?: boolean | string;
    currencySymbol?: string;
}

// Map of currency codes to their English and Arabic symbols
const CURRENCY_SYMBOLS: Record<string, { en: string; ar: string }> = {
    JOD: { en: 'JOD', ar: 'د.أ' },
    USD: { en: '$', ar: '$' },
    EUR: { en: '€', ar: '€' },
    GBP: { en: '£', ar: '£' },
    SAR: { en: 'SAR', ar: 'ر.س' },
    AED: { en: 'AED', ar: 'د.إ' },
    KWD: { en: 'KWD', ar: 'د.ك' },
    EGP: { en: 'EGP', ar: 'ج.م' },
    IQD: { en: 'IQD', ar: 'د.ع' },
};

/**
 * Get the appropriate currency symbol based on current language
 */
function getLocalizedSymbol(dbSymbol: string, currencyCode?: string): string {
    const currentLang = typeof localStorage !== 'undefined' 
        ? (localStorage.getItem('userLanguageChoice') || localStorage.getItem('i18nextLng') || 'ar')
        : 'ar';
    
    const isArabic = currentLang === 'ar';
    
    // If we have a currency code, use the map
    if (currencyCode && CURRENCY_SYMBOLS[currencyCode.toUpperCase()]) {
        return isArabic 
            ? CURRENCY_SYMBOLS[currencyCode.toUpperCase()].ar 
            : CURRENCY_SYMBOLS[currencyCode.toUpperCase()].en;
    }
    
    // Fallback: if symbol is Arabic and language is English, try to find the code
    if (!isArabic && dbSymbol === 'د.أ') return 'JOD';
    if (!isArabic && dbSymbol === 'ر.س') return 'SAR';
    if (!isArabic && dbSymbol === 'د.إ') return 'AED';
    if (!isArabic && dbSymbol === 'د.ك') return 'KWD';
    if (!isArabic && dbSymbol === 'ج.م') return 'EGP';
    if (!isArabic && dbSymbol === 'د.ع') return 'IQD';
    
    // If Arabic and symbol is a code like JOD, convert to Arabic
    if (isArabic && dbSymbol === 'JOD') return 'د.أ';
    if (isArabic && dbSymbol === 'SAR') return 'ر.س';
    if (isArabic && dbSymbol === 'AED') return 'د.إ';
    
    return dbSymbol;
}

/**
 * Universal currency formatter - works for all pages
 * Uses superadmin settings for superadmin pages, store settings for company pages
 */
export function formatCurrency(amount: number | string): string {
    try {
        const { props } = usePage<any>();
        const user = props.auth?.user;
        
        // Determine which settings to use based on user type
        if (user?.type === 'superadmin' || !user) {
            // Use globalSettings for superadmin and guests (has currencySymbol)
            const settings = props.globalSettings || {};
            
            const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
            if (isNaN(numAmount)) return '$0.00';
            
            const decimals = parseInt(settings.decimalFormat || '2');
            const decimalSeparator = settings.decimalSeparator || '.';
            const thousandsSeparator = settings.thousandsSeparator || ',';
            const position = settings.currencySymbolPosition || 'before';
            const dbSymbol = settings.currencySymbol || '$';
            const symbol = getLocalizedSymbol(dbSymbol, settings.defaultCurrency);
            const space = (settings.currencySymbolSpace === true || settings.currencySymbolSpace === '1') ? ' ' : '';
            
            const formattedNumber = numAmount.toFixed(decimals);
            const parts = formattedNumber.split('.');
            
            if (thousandsSeparator !== 'none') {
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
            }
            
            const finalNumber = parts.join(decimalSeparator);
            
            return position === 'after' 
                ? `${finalNumber}${space}${symbol}`
                : `${symbol}${space}${finalNumber}`;
        } else {
            // Use store-specific currency settings for company users
            const storeCurrency = props.storeCurrency || {};
            
            const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
            if (isNaN(numAmount)) return '$0.00';
            
            const decimals = storeCurrency.decimals || 2;
            const decimalSeparator = storeCurrency.decimal_separator || '.';
            const thousandsSeparator = storeCurrency.thousands_separator || ',';
            const position = storeCurrency.position || 'before';
            const dbSymbol = storeCurrency.symbol || '$';
            const symbol = getLocalizedSymbol(dbSymbol, storeCurrency.code);
            
            const formattedNumber = numAmount.toFixed(decimals);
            const parts = formattedNumber.split('.');
            
            if (thousandsSeparator !== 'none') {
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
            }
            
            const finalNumber = parts.join(decimalSeparator);
            
            const space = (storeCurrency.space === true || storeCurrency.space === '1' || storeCurrency.space === 1) ? ' ' : '';
            
            return position === 'after' 
                ? `${finalNumber}${space}${symbol}`
                : `${symbol}${space}${finalNumber}`;
        }
            
    } catch (error) {
        return `$${Number(amount).toFixed(2)}`;
    }
}

/**
 * Format currency using superadmin settings only
 * Use this for plan prices and other superadmin-controlled pricing
 */
export function formatSuperadminCurrency(amount: number | string): string {
    try {
        const { props } = usePage<any>();
        // Always use globalSettings which contains superadmin currency settings
        const settings = props.globalSettings || {};
        
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) return '$0.00';
        
        const decimals = parseInt(settings.decimalFormat || '2');
        const decimalSeparator = settings.decimalSeparator || '.';
        const thousandsSeparator = settings.thousandsSeparator || ',';
        const position = settings.currencySymbolPosition || 'before';
        const dbSymbol = settings.currencySymbol || '$';
        const symbol = getLocalizedSymbol(dbSymbol, settings.defaultCurrency);
        const space = (settings.currencySymbolSpace === true || settings.currencySymbolSpace === '1') ? ' ' : '';
        
        const formattedNumber = numAmount.toFixed(decimals);
        const parts = formattedNumber.split('.');
        
        if (thousandsSeparator !== 'none') {
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        }
        
        const finalNumber = parts.join(decimalSeparator);
        
        return position === 'after' 
            ? `${finalNumber}${space}${symbol}`
            : `${symbol}${space}${finalNumber}`;
            
    } catch (error) {
        return `$${Number(amount).toFixed(2)}`;
    }
}

// Legacy support
export const formatAmount = formatCurrency;
