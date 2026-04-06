import { usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MailWarning, X, RefreshCw } from 'lucide-react';

export function EmailVerificationBanner() {
    const { t } = useTranslation();
    const props = usePage().props as any;
    const auth = props.auth;
    const [dismissed, setDismissed] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    // Don't show if: no user, email already verified, verification not enabled, or dismissed
    if (!auth?.user || auth.email_verified || !auth.email_verification_enabled || dismissed) {
        return null;
    }

    const handleResend = () => {
        setSending(true);
        router.post(route('verification.send'), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setSent(true);
                setSending(false);
            },
            onError: () => {
                setSending(false);
            }
        });
    };

    return (
        <div className="px-4 pt-3 md:px-3">
            <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700">
                <MailWarning className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-800 dark:text-amber-300 flex items-center justify-between">
                    <span>{t('Email Not Verified')}</span>
                    <button 
                        onClick={() => setDismissed(true)} 
                        className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-200 transition-colors"
                        aria-label={t('Dismiss')}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-400">
                    <p className="mb-2">
                        {t('Your email address is not verified. Please verify it to secure your account and receive important notifications.')}
                    </p>
                    <button
                        onClick={handleResend}
                        disabled={sending || sent}
                        className="inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <RefreshCw className={`h-3 w-3 ${sending ? 'animate-spin' : ''}`} />
                        {sent ? t('Verification Email Sent!') : sending ? t('Sending...') : t('Resend Verification Email')}
                    </button>
                </AlertDescription>
            </Alert>
        </div>
    );
}
