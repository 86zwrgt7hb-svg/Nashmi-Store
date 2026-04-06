import { useForm, router, usePage } from '@inertiajs/react';
import { Mail, Lock } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/layouts/auth-layout';
import AuthButton from '@/components/auth/auth-button';
import Recaptcha, { executeRecaptcha } from '@/components/recaptcha';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import { getStoreThemes } from '@/data/storeThemes';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
    recaptcha_token?: string;
};

interface DemoStore {
    id: number;
    name: string;
    slug: string;
    theme: string;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    isDemo?: boolean;
    demoStores?: DemoStore[];
}

export default function Login({ status, canResetPassword, isDemo = false, demoStores = [] }: LoginProps) {
    const { t } = useTranslation();
    const [recaptchaToken, setRecaptchaToken] = useState<string>('');
    const { themeColor, customColor } = useBrand();
    const { settings = {} } = usePage().props as any;
    const recaptchaEnabled = settings.recaptchaEnabled === 'true' || settings.recaptchaEnabled === true || settings.recaptchaEnabled === 1 || settings.recaptchaEnabled === '1';
    const primaryColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
    const [hoveredStore, setHoveredStore] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, transform } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        // Set default credentials if in demo mode
        if (isDemo) {
            setData({
                email: 'company@example.com',
                password: 'password',
                remember: false
            });
        }
    }, [isDemo]);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        if (recaptchaEnabled) {
            try {
                const token = await executeRecaptcha();
                if (!token) {
                    alert(t('Please complete the reCAPTCHA verification'));
                    return;
                }
                transform((data) => ({
                    ...data,
                    recaptcha_token: token,
                }));
                post(route('login'), {
                    onFinish: () => reset('password'),
                });
                return;
            } catch {
                alert(t('reCAPTCHA verification failed. Please try again.'));
                return;
            }
        }

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const openStoreInNewTab = (storeSlug: string, e: React.MouseEvent) => {
        // Prevent the default form submission
        e.preventDefault();
        e.stopPropagation();
        
        // Construct the URL for the store
        const url = route('store.slug', { slug: storeSlug });
        
        // Open in a new tab
        window.open(url, '_blank');
    };

    const getThemeThumbnail = (theme: string) => {
        return `/images/themes/${theme}.png`;
    };

    const distinctThemes = demoStores.reduce((acc: DemoStore[], current) => {
        const x = acc.find(item => item.theme === current.theme);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);

    return (
        <AuthLayout
            title={t("Sign in to your account")}
            description={t("Enter your email and password to access your account")}
        >
            <form onSubmit={submit}>
                {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">{t("Email")}</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="pl-10"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                tabIndex={1}
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">{t("Password")}</Label>
                            {canResetPassword && (
                                <TextLink
                                    href={route('password.request')}
                                    className="text-sm font-medium hover:underline"
                                    style={{ color: primaryColor }}
                                    tabIndex={5}
                                >
                                    {t("Forgot password?")}
                                </TextLink>
                            )}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="pl-10"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                tabIndex={2}
                            />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked as boolean)}
                            tabIndex={3}
                        />
                        <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {t("Remember me")}
                        </label>
                    </div>
                </div>

                {recaptchaEnabled && (
                    <Recaptcha
                        onVerify={(token) => {
                            setRecaptchaToken(token);
                            setData('recaptcha_token', token);
                        }}
                        onExpired={() => {
                            setRecaptchaToken('');
                            setData('recaptcha_token', '');
                        }}
                        onError={() => {
                            setRecaptchaToken('');
                            setData('recaptcha_token', '');
                        }}
                    />
                )}
                <InputError message={errors.recaptcha_token} />

                <AuthButton
                    tabIndex={4}
                    processing={processing}
                >
                    {t("SIGN IN")}
                </AuthButton>



                {(settings.registrationEnabled === 'true' || settings.registrationEnabled === true || settings.registrationEnabled === '1' || settings.registrationEnabled === 1) && (
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-5">
                        {t("Don't have an account?")}{' '}
                        <TextLink
                            href={route('register')}
                            className="font-medium hover:underline"
                            style={{ color: primaryColor }}
                            tabIndex={6}
                        >
                            {t("Create one")}
                        </TextLink>
                    </div>
                )}

                                {/* Back to Home */}
                <div className="text-center mt-4">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                        {t("Back to Home")}
                    </a>
                </div>
{/* Divider */}
                <div className="mt-5 mb-0">
                    <div className="flex items-center">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <div className="w-2 h-2 rotate-45 mx-4" style={{ backgroundColor: primaryColor }}></div>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>
                </div>

                {isDemo && (
                    <div className="mt-6">
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setData({ email: 'company@example.com', password: 'password', remember: false })}
                                        className="flex-1 py-2 px-3 text-xs font-medium text-white rounded-md transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {t('Shop Owner')}
                                    </button>
                                </div>

                                {/* Divider */}
                                <div className="my-5">
                                    <div className="flex items-center">
                                        <div className="flex-1 h-px bg-gray-200"></div>
                                        <div className="w-2 h-2 rotate-45 mx-4" style={{ backgroundColor: primaryColor }}></div>
                                        <div className="flex-1 h-px bg-gray-200"></div>
                                    </div>
                                </div>

                                {distinctThemes && distinctThemes.length > 0 && (
                                    <div className='mt-4'>
                                        <h3 className="text-sm font-medium text-gray-900 tracking-wider mb-4 text-center">{t('Store Themes')}</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {distinctThemes.map((store, index) => (
                                                <div
                                                    key={store.id}
                                                    className={`relative group w-full ${distinctThemes.length % 2 !== 0 && index === distinctThemes.length - 1 ? 'col-span-2' : ''}`}
                                                >
                                                    <button
                                                        onClick={(e) => openStoreInNewTab(store.slug, e)}
                                                        className="w-full py-2 px-3 text-[13px] text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 rounded-md border border-gray-200 hover:border-gray-300 font-medium cursor-pointer"
                                                        onMouseEnter={(e) => {
                                                            setHoveredStore(store.theme);
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            setHoveredStore(null);
                                                        }}
                                                    >
                                                        {store.theme
                                                            .split('-')
                                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                            .join(' ')}
                                                    </button>
                                                    {hoveredStore === store.theme && (
                                                        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white p-1.5 rounded-lg shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 w-48 pointer-events-none demo-store-preview">
                                                            <div className="relative rounded overflow-hidden bg-gray-50 aspect-[16/10] demo-store-preview-container">
                                                                <img loading="lazy"
                                                                    src={getThemeThumbnail(store.theme)}
                                                                    alt={store.theme}
                                                                    className="w-full h-full object-cover demo-store-preview-image"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = `https://placehold.co/300x600?text=${encodeURIComponent(store.theme)}`;
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 shadow-sm"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </AuthLayout>
    );
}
