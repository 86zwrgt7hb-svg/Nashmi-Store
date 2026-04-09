import { usePage, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Clock, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export function TrialBanner() {
    const { auth } = usePage().props as any;
    const trial = auth?.trial;
    const isLifetime = auth?.is_lifetime;
    const { t } = useTranslation();
    const [dismissed, setDismissed] = useState(false);

    if (isLifetime || !trial || !trial.is_trial || dismissed) return null;

    const daysLeft = trial.days_left;
    const isUrgent = daysLeft <= 2;
    const isLastDay = daysLeft <= 1;

    const bgColor = isLastDay
        ? 'bg-red-500'
        : isUrgent
            ? 'bg-amber-500'
            : 'bg-gradient-to-r from-indigo-500 to-purple-500';

    return (
        <div className={`${bgColor} text-white text-sm`}>
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0 opacity-80" />
                    <span className="truncate">
                        {isLastDay
                            ? t('Trial ends today!')
                            : t('{{days}} days left in your free trial', { days: daysLeft })
                        }
                    </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                        href={route('plans.index')}
                        className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold transition-colors"
                    >
                        <Sparkles className="h-3 w-3" />
                        {t('Get Lifetime')}
                    </Link>
                    <button
                        onClick={() => setDismissed(true)}
                        className="opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
