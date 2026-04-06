import { useForm, usePage, Link } from '@inertiajs/react';
import { Mail, ArrowRight } from 'lucide-react';
import { FormEventHandler, useEffect, useRef } from 'react';
import TextLink from '@/components/text-link';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/layouts/auth-layout';
import AuthButton from '@/components/auth/auth-button';
import { toast } from '@/components/custom-toast';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useTranslation();
    const { themeColor, customColor } = useBrand();
    const primaryColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
    const { post, processing } = useForm({});
    const { flash } = usePage().props as any;
    // Use refs to prevent the same flash value from triggering duplicate toasts
    // (React StrictMode double-invokes effects in development)
    const shownErrorRef = useRef<string | null>(null);
    const shownStatusRef = useRef<string | null>(null);
    // Show flash error toast (e.g. SMTP not configured)
    useEffect(() => {
        if (flash?.error && flash.error !== shownErrorRef.current) {
            shownErrorRef.current = flash.error;
            toast.error(flash.error);
        }
    }, [flash?.error]);
    // Show success toast when status is 'verification-link-sent'
    useEffect(() => {
        if (status === 'verification-link-sent' && status !== shownStatusRef.current) {
            shownStatusRef.current = status;
            toast.success(t('A new verification link has been sent to your email address.'));
        }
    }, [status]);
    // Submit — no onSuccess/onError callbacks; toasts are driven by page props above
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Reset refs so new responses can trigger toasts
        shownErrorRef.current = null;
        shownStatusRef.current = null;
        post(route('verification.send'));
    };
    return (
        <AuthLayout
            title={t("Verify your email")}
            description={t("Please verify your email address by clicking on the link we just emailed to you.")}
            icon={<Mail className="h-7 w-7" style={{ color: primaryColor }} />}
            status={status === 'verification-link-sent' ? 
                t("A new verification link has been sent to the email address you provided during registration.") : 
                undefined}
        >
            <form onSubmit={submit} className="space-y-5">
                <AuthButton 
                    processing={processing}
                >
                    {t("Resend verification email")}
                </AuthButton>
                
                {/* Verify Later - Continue to Dashboard */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">{t("or")}</span>
                    </div>
                </div>
                
                <Link
                    href={route('dashboard')}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                    {t("Verify later, continue to dashboard")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
                
                <div className="text-center">
                    <TextLink 
                        href={route('logout')} 
                        method="post" 
                        className="font-medium transition-colors duration-200"
                        style={{ color: primaryColor }}
                    >
                        {t("Log out")}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
