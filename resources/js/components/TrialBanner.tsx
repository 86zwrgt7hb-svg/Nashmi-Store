import { usePage, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Clock, Crown, Sparkles, Rocket, X, Timer } from 'lucide-react';
import { useState } from 'react';

export function TrialBanner() {
    const { auth } = usePage().props as any;
    const trial = auth?.trial;
    const isLifetime = auth?.is_lifetime;
    const { t } = useTranslation();
    const [dismissed, setDismissed] = useState(false);

    // Don't show if lifetime user or no trial or dismissed
    if (isLifetime || !trial || !trial.is_trial || dismissed) return null;

    const daysLeft = trial.days_left;
    const totalDays = 7;
    const progress = ((totalDays - daysLeft) / totalDays) * 100;
    const isUrgent = daysLeft <= 2;
    const isLastDay = daysLeft <= 1;

    const getEmoji = () => {
        if (isLastDay) return '⏰';
        if (isUrgent) return '⚡';
        return '🚀';
    };

    const getMessage = () => {
        if (isLastDay) {
            return t('Your free trial ends today! Subscribe now to keep your store online.');
        }
        if (isUrgent) {
            return t('Only {{days}} days left in your trial. Don\'t lose your store!', { days: daysLeft });
        }
        return t('You have {{days}} days left to explore all features for free.', { days: daysLeft });
    };

    const getBorderColor = () => {
        if (isLastDay) return 'border-red-300 dark:border-red-700';
        if (isUrgent) return 'border-orange-300 dark:border-orange-700';
        return 'border-blue-200 dark:border-blue-800';
    };

    const getBgGradient = () => {
        if (isLastDay) return 'from-red-50 via-orange-50 to-amber-50 dark:from-red-950/40 dark:via-orange-950/40 dark:to-amber-950/40';
        if (isUrgent) return 'from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/40 dark:via-amber-950/40 dark:to-yellow-950/40';
        return 'from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40';
    };

    const getProgressColor = () => {
        if (isLastDay) return 'bg-red-500';
        if (isUrgent) return 'bg-orange-500';
        return 'bg-blue-500';
    };

    const getTextColor = () => {
        if (isLastDay) return 'text-red-800 dark:text-red-200';
        if (isUrgent) return 'text-orange-800 dark:text-orange-200';
        return 'text-blue-800 dark:text-blue-200';
    };

    const getSubTextColor = () => {
        if (isLastDay) return 'text-red-600 dark:text-red-400';
        if (isUrgent) return 'text-orange-600 dark:text-orange-400';
        return 'text-blue-600 dark:text-blue-400';
    };

    const getButtonStyle = () => {
        if (isLastDay) return 'bg-red-500 hover:bg-red-600 shadow-red-200';
        if (isUrgent) return 'bg-orange-500 hover:bg-orange-600 shadow-orange-200';
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-blue-200';
    };

    const getIconColor = () => {
        if (isLastDay) return 'text-red-500';
        if (isUrgent) return 'text-orange-500';
        return 'text-blue-500';
    };

    return (
        <div className={`relative rounded-xl border ${getBorderColor()} bg-gradient-to-r ${getBgGradient()} p-4 shadow-sm`}>
            {/* Close button */}
            <button
                onClick={() => setDismissed(true)}
                className={`absolute top-3 ltr:right-3 rtl:left-3 ${getSubTextColor()} hover:opacity-70 transition-opacity`}
            >
                <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center`}>
                    {isLastDay ? (
                        <Timer className={`h-6 w-6 ${getIconColor()} animate-pulse`} />
                    ) : isUrgent ? (
                        <Clock className={`h-6 w-6 ${getIconColor()}`} />
                    ) : (
                        <Rocket className={`h-6 w-6 ${getIconColor()}`} />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-sm font-bold ${getTextColor()}`}>
                            {getEmoji()} {t('Free Trial')} — {daysLeft} {daysLeft === 1 ? t('day left') : t('days left')}
                        </h3>
                    </div>
                    <p className={`text-xs ${getSubTextColor()} mb-2`}>
                        {getMessage()}
                    </p>
                    
                    {/* Progress bar */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-white/60 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full ${getProgressColor()} rounded-full transition-all duration-1000`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>
                        <span className={`text-xs font-medium ${getSubTextColor()} whitespace-nowrap`}>
                            {daysLeft}/{totalDays}
                        </span>
                    </div>
                </div>

                {/* CTA Button */}
                <Link
                    href={route('plans.index')}
                    className={`flex-shrink-0 rounded-lg ${getButtonStyle()} px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg flex items-center gap-1.5`}
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    {isLastDay ? t('Subscribe Now') : t('Get Lifetime — 499 JOD')}
                </Link>
            </div>
        </div>
    );
}
