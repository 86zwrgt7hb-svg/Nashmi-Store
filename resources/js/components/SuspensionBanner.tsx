import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Archive, Clock, ShieldAlert } from 'lucide-react';

export function SuspensionBanner() {
    const { auth } = usePage().props as any;
    const suspension = auth?.suspension;
    const { t } = useTranslation();

    if (!suspension || (!suspension.store_suspended && !suspension.store_archived)) return null;

    // Store is archived (after 3 days grace period)
    if (suspension.store_archived) {
        return (
            <div className="mx-4 mt-3 mb-1 rounded-lg border border-red-300 bg-gradient-to-r from-red-50 to-red-100 dark:border-red-800 dark:from-red-950/50 dark:to-red-900/50 px-4 py-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                        <Archive className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-red-800 dark:text-red-200">
                            {t('Store Archived')}
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {t('Your store has been archived because you exceeded the free plan limits. Subscribe to a paid plan to restore your store.')}
                        </p>
                    </div>
                    <a
                        href={route('plans.index')}
                        className="flex-shrink-0 rounded-md bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                    >
                        {t('Subscribe Now')}
                    </a>
                </div>
            </div>
        );
    }

    // Store is suspended (within 3-day grace period)
    const graceDaysLeft = suspension.grace_days_left || 0;
    const limits = suspension.exceeded_limits || {};

    const getGraceText = () => {
        if (graceDaysLeft > 1) {
            return `${graceDaysLeft} ${t('days remaining to fix')}`;
        } else if (graceDaysLeft === 1) {
            return t('Last day to fix!');
        } else {
            return t('Grace period ending today!');
        }
    };

    const getBannerColor = () => {
        if (graceDaysLeft <= 1) return {
            border: 'border-red-300 dark:border-red-800',
            bg: 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50',
            icon: 'text-red-600 dark:text-red-400',
            title: 'text-red-800 dark:text-red-200',
            text: 'text-red-600 dark:text-red-400',
            btn: 'bg-red-600 hover:bg-red-700',
        };
        if (graceDaysLeft === 2) return {
            border: 'border-orange-300 dark:border-orange-800',
            bg: 'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50',
            icon: 'text-orange-600 dark:text-orange-400',
            title: 'text-orange-800 dark:text-orange-200',
            text: 'text-orange-600 dark:text-orange-400',
            btn: 'bg-orange-600 hover:bg-orange-700',
        };
        return {
            border: 'border-yellow-300 dark:border-yellow-800',
            bg: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50',
            icon: 'text-yellow-600 dark:text-yellow-400',
            title: 'text-yellow-800 dark:text-yellow-200',
            text: 'text-yellow-600 dark:text-yellow-400',
            btn: 'bg-yellow-600 hover:bg-yellow-700',
        };
    };

    const colors = getBannerColor();

    const getLimitDetails = () => {
        const parts: string[] = [];
        if (limits.stores) {
            parts.push(`${t('Stores')}: ${limits.stores.current}/${limits.stores.limit}`);
        }
        if (limits.products) {
            parts.push(`${t('Products')}: ${limits.products.current}/${limits.products.limit}`);
        }
        if (limits.storage) {
            parts.push(`${t('Storage')}: ${limits.storage.current}GB/${limits.storage.limit}GB`);
        }
        if (limits.users) {
            parts.push(`${t("Users")}: ${limits.users.current}/${limits.users.limit}`);
        }
        return parts.join(' | ');
    };

    return (
        <div className={`mx-4 mt-3 mb-1 rounded-lg border ${colors.border} ${colors.bg} px-4 py-4`}>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    <ShieldAlert className={`h-6 w-6 ${colors.icon}`} />
                </div>
                <div className="flex-1">
                    <p className={`text-sm font-bold ${colors.title}`}>
                        {t('Store Suspended - Exceeds Free Plan Limits')}
                    </p>
                    <p className={`text-xs ${colors.text} mt-1`}>
                        {t('Please delete some products or media to return within the free plan limits, or subscribe to a paid plan.')}
                    </p>
                    {getLimitDetails() && (
                        <p className={`text-xs ${colors.text} mt-1 font-medium`}>
                            {getLimitDetails()}
                        </p>
                    )}
                    <p className={`text-xs ${colors.text} flex items-center gap-1 mt-1.5 font-medium`}>
                        <Clock className="h-3 w-3" />
                        {getGraceText()}
                    </p>
                </div>
                <a
                    href={route('plans.index')}
                    className={`flex-shrink-0 rounded-md ${colors.btn} px-4 py-2 text-xs font-medium text-white transition-colors`}
                >
                    {t('Subscribe Now')}
                </a>
            </div>
        </div>
    );
}
