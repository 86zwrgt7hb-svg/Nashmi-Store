import { Head } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useBrand } from '@/contexts/BrandContext';
import { useAppearance, THEME_COLORS } from '@/hooks/use-appearance';
import { getImageUrl } from '@/utils/image-helper';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
    icon?: ReactNode;
    status?: string;
    statusType?: 'success' | 'error';
}

export default function AuthLayout({
    children,
    title,
    description,
    icon,
    status,
    statusType = 'success',
}: AuthLayoutProps) {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { logoLight, logoDark, themeColor, customColor, titleText } = useBrand();
    const { appearance } = useAppearance();

    const appName = titleText; // Use titleText as the app name


    const currentLogo = appearance === 'dark' ? logoLight : logoDark;
    const primaryColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];



    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 relative overflow-hidden font-sans">
            <Head title={title} />

            {/* Enhanced Background Design */}
            <div className="absolute inset-0">
                {/* Base Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300"></div>

                {/* Elegant Pattern Overlay */}
                <div className="absolute inset-0 opacity-70" style={{
                    backgroundImage: `radial-gradient(circle at 30% 70%, ${primaryColor} 1px, transparent 1px)`,
                    backgroundSize: '80px 80px'
                }}></div>
            </div>

            {/* Language Dropdown */}
            <div className="absolute top-6 right-6 z-10 md:block hidden">
                <LanguageSwitcher />
            </div>

            <div className={`flex items-center justify-center min-h-screen p-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="relative inline-block px-6 rounded-xl">
                            {currentLogo && !imageError ? (
                                <img loading="lazy"
                                    src={getImageUrl(currentLogo)}
                                    alt={appName}
                                    className="w-auto h-6 mx-auto object-contain"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{appName}</span>
                            )}
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="relative">
                        {/* Corner accents */}
                        <div className="absolute -top-3 -left-3 w-6 h-6 border-l-2 border-t-2 rounded-tl-md transition-colors" style={{ borderColor: primaryColor }}></div>
                        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r-2 border-b-2 rounded-br-md transition-colors" style={{ borderColor: primaryColor }}></div>

                        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg lg:p-8 p-4 lg:pt-5 shadow-sm">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <h1 className="md:text-2xl text-xl font-semibold text-gray-900 dark:text-white mb-1.5 tracking-wide">{title}</h1>
                                <div className="w-12 h-px mx-auto mb-2.5 transition-colors" style={{ backgroundColor: primaryColor }}></div>
                                {description && (
                                    <p className="text-gray-700 dark:text-gray-400 text-sm">{description}</p>
                                )}
                            </div>

                            {status && (
                                <div className={`mb-6 text-center text-sm font-medium ${statusType === 'success'
                                    ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30'
                                    : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30'
                                    } p-3 rounded-lg border`}>
                                    {status}
                                </div>
                            )}

                            {children}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <div className="lg:px-9 lg:relative lg:inline-flex group">
                            <div className="hidden lg:block absolute inset-0 bg-gray-50/80 dark:bg-slate-900/80 blur-lg rounded-full"></div>
                            <div className="relative inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-md px-4 py-2 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-colors shadow-sm">
                                <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} {appName}</p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
