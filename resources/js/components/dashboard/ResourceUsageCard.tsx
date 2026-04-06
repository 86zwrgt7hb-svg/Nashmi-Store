import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, XCircle, Infinity, Package, HardDrive, Store, Users, ArrowUpRight, Crown } from 'lucide-react';

interface ResourceItem {
  current: number;
  max: number;
  percentage: number;
  unlimited: boolean;
  label: string;
  label_ar: string;
  unit?: string;
}

interface Warning {
  type: 'warning' | 'error';
  resource: string;
  message: string;
  message_ar: string;
}

interface ResourceUsageProps {
  resourceUsage: {
    plan_name: string;
    resources: {
      products: ResourceItem;
      storage: ResourceItem;
      stores: ResourceItem;
      users: ResourceItem;
    };
    warnings: Warning[];
  } | null;
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 100) return 'bg-red-500';
  if (percentage >= 80) return 'bg-amber-500';
  if (percentage >= 60) return 'bg-yellow-400';
  return 'bg-emerald-500';
};

const getProgressBgColor = (percentage: number) => {
  if (percentage >= 100) return 'bg-red-100';
  if (percentage >= 80) return 'bg-amber-100';
  return 'bg-gray-100';
};

const getIcon = (resource: string) => {
  switch (resource) {
    case 'products': return <Package className="h-4 w-4" />;
    case 'storage': return <HardDrive className="h-4 w-4" />;
    case 'stores': return <Store className="h-4 w-4" />;
    case 'users': return <Users className="h-4 w-4" />;
    default: return <Package className="h-4 w-4" />;
  }
};

const ResourceBar = ({ resource, data, resourceKey }: { resource: string; data: ResourceItem; resourceKey: string }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const label = isArabic ? data.label_ar : data.label;

  if (data.unlimited) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 font-medium text-gray-700">
            {getIcon(resourceKey)}
            <span>{label}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600">
            <Infinity className="h-4 w-4" />
            <span className="text-xs font-medium">{isArabic ? 'غير محدود' : 'Unlimited'}</span>
          </div>
        </div>
        <div className="w-full h-2 rounded-full bg-emerald-100">
          <div className="h-full rounded-full bg-emerald-500 w-full opacity-30" />
        </div>
        <p className="text-xs text-gray-500">
          {isArabic ? `${data.current} مستخدم حالياً` : `${data.current} currently used`}
        </p>
      </div>
    );
  }

  const percentage = Math.min(data.percentage, 100);
  const unit = data.unit || '';
  const currentDisplay = unit ? `${data.current} ${unit}` : data.current;
  const maxDisplay = unit ? `${data.max} ${unit}` : data.max;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 font-medium text-gray-700">
          {getIcon(resourceKey)}
          <span>{label}</span>
        </div>
        <span className="text-xs text-gray-500">
          {currentDisplay} / {maxDisplay}
        </span>
      </div>
      <div className={`w-full h-2 rounded-full ${getProgressBgColor(percentage)}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">
          {percentage}% {isArabic ? 'مستخدم' : 'used'}
        </p>
        {percentage >= 80 && percentage < 100 && (
          <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 text-[10px] px-1.5 py-0">
            {isArabic ? 'يقترب من الحد' : 'Near limit'}
          </Badge>
        )}
        {percentage >= 100 && (
          <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50 text-[10px] px-1.5 py-0">
            {isArabic ? 'وصل للحد' : 'Limit reached'}
          </Badge>
        )}
      </div>
    </div>
  );
};

export function ResourceUsageCard({ resourceUsage }: ResourceUsageProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  if (!resourceUsage) return null;

  const { plan_name, resources, warnings } = resourceUsage;
  const hasWarnings = warnings.length > 0;
  const hasErrors = warnings.some(w => w.type === 'error');

  return (
    <div className="space-y-4">
      {/* Friendly Upgrade Nudge */}
      {hasWarnings && (
        <div className="rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 dark:border-purple-800/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <Crown className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                {isArabic ? 'متجرك ينمو! ترقّى واحصل على إمكانيات أكبر' : 'Your store is growing! Upgrade for more power'}
              </p>
            </div>
            <Link href={route('plans.index')}>
              <Button size="sm" variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-100 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-900/50 whitespace-nowrap">
                <ArrowUpRight className="h-3 w-3 ltr:mr-1 rtl:ml-1" />
                {isArabic ? 'اكتشف الخطط' : 'View Plans'}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Resource Usage Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-500" />
              {isArabic ? 'استخدام الموارد' : 'Resource Usage'}
            </CardTitle>
            <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50">
              {plan_name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2">
            {Object.entries(resources).map(([key, data]) => (
              <ResourceBar key={key} resource={key} data={data} resourceKey={key} />
            ))}
          </div>
          
          {/* Upgrade CTA for Free plan */}
          {plan_name === 'Free' && !hasWarnings && (
            <div className="mt-5 pt-4 border-t border-dashed border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {isArabic ? 'هل تريد المزيد من الموارد؟' : 'Need more resources?'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isArabic ? 'قم بترقية خطتك للحصول على ميزات إضافية وموارد أكبر' : 'Upgrade your plan for more features and resources'}
                  </p>
                </div>
                <Link href={route('plans.index')}>
                  <Button size="sm" variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                    <ArrowUpRight className="h-3 w-3 ltr:mr-1 rtl:ml-1" />
                    {isArabic ? 'ترقية' : 'Upgrade'}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
