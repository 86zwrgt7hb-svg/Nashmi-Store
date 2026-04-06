import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Clock, Crown, X } from 'lucide-react';
import { useState } from 'react';

export function TrialBanner() {
    const { auth } = usePage().props as any;
    const trial = auth?.trial;
    const { t } = useTranslation();
    const [dismissed, setDismissed] = useState(false);

    if (!trial || !trial.is_trial || dismissed) return null;

    const daysLeft = trial.days_left;
    const planName = trial.plan_name || 'Pro';

    const getDaysText = () => {
        if (daysLeft > 1) {
            return `${daysLeft} ${t('days remaining')}`;
        } else if (daysLeft === 1) {
            return t('Last day!');
        } else {
            return t('Trial ending today!');
        }
    };

    return (
        <div className="relative mx-4 mt-3 mb-1 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:border-amber-800 dark:from-amber-950/50 dark:to-orange-950/50 px-4 py-3">
            <button
                onClick={() => setDismissed(true)}
                className="absolute top-2 right-2 text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-200"
            >
                <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                    <Crown className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        {`${t('Trial Active')} - ${planName}`}
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {getDaysText()}
                    </p>
                </div>
                <a
                    href={route('plans.index')}
                    className="flex-shrink-0 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600 transition-colors"
                >
                    {t('Upgrade Now')}
                </a>
            </div>
        </div>
    );
}
