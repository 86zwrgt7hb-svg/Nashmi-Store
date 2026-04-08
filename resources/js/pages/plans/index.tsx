import { useState, useEffect } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { router, usePage } from '@inertiajs/react';
import { 
  CheckCircle2, 
  Pencil, 
  Trash2, 
  Globe, 
  FileText, 
  Bot, 
  Box, 
  Store, 
  Users, 
  HardDrive,
  Plus,
  Sparkles,
  Crown,
  Zap,
  Clock,
  CreditCard,
  IndianRupee,
  Wallet,
  Coins,
  Smartphone,
  Infinity,
  Shield,
  Server,
  HeadphonesIcon,
  AlertTriangle,
  Timer,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { useForm } from '@inertiajs/react';
import { PlanSubscriptionModal } from '@/components/plan-subscription-modal';
import { hasPermission } from '@/utils/permissions';
import { formatSuperadminCurrency } from '@/utils/currency-helper';

interface Plan {
  id: number;
  name: string;
  price: string | number;
  formatted_price?: string;
  duration: string;
  description: string;
  trial_days: number;
  features: string[];
  stats: {
    stores: number | string;
    users_per_store: number | string;
    products_per_store: number | string;
    storage: string;
    templates: number | string;
  };
  status: boolean;
  recommended?: boolean;
  is_default?: boolean;
  is_current?: boolean;
  is_trial_available?: boolean;
  is_free?: boolean;
  is_lifetime?: boolean;
  paymentMethods?: any;
}

interface Props {
  plans: Plan[];
  billingCycle: string;
  hasDefaultPlan?: boolean;
  isAdmin?: boolean;
  currentPlan?: any;
  userTrialUsed?: boolean;
  userOnTrial?: boolean;
  trialDaysLeft?: number;
  trialPeriodActive?: boolean;
  isLifetime?: boolean;
  isTrialExpired?: boolean;
  paymentMethods?: any[];
}

export default function Plans({ 
  plans: initialPlans, 
  billingCycle: initialBillingCycle = 'lifetime', 
  hasDefaultPlan, 
  isAdmin = false, 
  currentPlan, 
  userTrialUsed, 
  userOnTrial = false, 
  trialDaysLeft = 0, 
  trialPeriodActive = false, 
  isLifetime = false,
  isTrialExpired = false,
  paymentMethods = [] 
}: Props) {
  const { t } = useTranslation();
  const { auth } = usePage().props as any;
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  const { post, processing } = useForm();

  useEffect(() => {
    setPlans(initialPlans);
  }, [initialPlans]);

  const paymentSettings = (usePage().props as any)?.paymentSettings;

  const handleSubscribe = (planId: number) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setIsSubscriptionModalOpen(true);
    }
  };

  const formatPaymentMethods = (planPaymentMethods: any) => {
    const methods: any[] = [];
    
    if (paymentSettings?.is_stripe_enabled === true || paymentSettings?.is_stripe_enabled === '1') {
      methods.push({ id: 'stripe', name: t('Stripe'), icon: <CreditCard className="h-5 w-5" />, enabled: true });
    }
    if (paymentSettings?.is_paypal_enabled === true || paymentSettings?.is_paypal_enabled === '1') {
      methods.push({ id: 'paypal', name: t('PayPal'), icon: <Wallet className="h-5 w-5" />, enabled: true });
    }
    if (paymentSettings?.is_razorpay_enabled === true || paymentSettings?.is_razorpay_enabled === '1') {
      methods.push({ id: 'razorpay', name: t('Razorpay'), icon: <IndianRupee className="h-5 w-5" />, enabled: true });
    }
    if (paymentSettings?.is_flutterwave_enabled === true || paymentSettings?.is_flutterwave_enabled === '1') {
      methods.push({ id: 'flutterwave', name: t('Flutterwave'), icon: <Coins className="h-5 w-5" />, enabled: true });
    }
    if (paymentSettings?.is_paytm_enabled === true || paymentSettings?.is_paytm_enabled === '1') {
      methods.push({ id: 'paytm', name: t('Paytm'), icon: <Smartphone className="h-5 w-5" />, enabled: true });
    }
    if (paymentSettings?.is_paystack_enabled === true || paymentSettings?.is_paystack_enabled === '1') {
      methods.push({ id: 'paystack', name: t('Paystack'), icon: <CreditCard className="h-5 w-5" />, enabled: true });
    }
    if (paymentSettings?.is_mercadopago_enabled === true || paymentSettings?.is_mercadopago_enabled === '1') {
      methods.push({ id: 'mercadopago', name: t('MercadoPago'), icon: <CreditCard className="h-5 w-5" />, enabled: true });
    }
    if (paymentSettings?.is_tap_enabled === true || paymentSettings?.is_tap_enabled === '1') {
      methods.push({ id: 'tap', name: t('Tap'), icon: <CreditCard className="h-5 w-5" />, enabled: true });
    }
    if (paymentSettings?.is_benefit_enabled === true || paymentSettings?.is_benefit_enabled === '1') {
      methods.push({ id: 'benefit', name: t('Benefit'), icon: <CreditCard className="h-5 w-5" />, enabled: true });
    }
    // Add other payment methods as needed...
    
    return methods;
  };

  // Admin view: keep original admin functionality
  if (isAdmin) {
    return (
      <PageTemplate 
        title={t("Plans")}
        description={t("Manage subscription plans")}
        url="/plans"
        breadcrumbs={[
          { title: t('Dashboard'), href: route('dashboard') },
          { title: t('Plans') }
        ]}
      >
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{t("Subscription Plans")}</h1>
              <p className="text-muted-foreground max-w-2xl">{t("Manage the lifetime plan for your customers.")}</p>
            </div>
            {hasPermission('create-plans', auth) && (
              <Button onClick={() => router.get(route('plans.create'))}>
                <Plus className="h-4 w-4 mr-2" />
                {t("Add Plan")}
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.id} className="group relative h-full flex flex-col">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30 border shadow-lg"></div>
                <div className="relative z-10 flex flex-col h-full p-6 pt-8">
                  <h3 className="text-2xl font-bold mb-2 text-primary">{plan.name}</h3>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-3xl font-extrabold text-primary">{plan.formatted_price || formatSuperadminCurrency(plan.price)}</span>
                    <span className="text-muted-foreground text-sm">/ {t('Lifetime')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch checked={true} className="data-[state=checked]:bg-primary" />
                        <span className="text-sm text-muted-foreground">{t("Active")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasPermission('edit-plans', auth) && (
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => router.get(route('plans.edit', plan.id))}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageTemplate>
    );
  }

  // Company view: Single lifetime plan
  const plan = plans[0];

  const commonFeatures = [
    'Custom Domain',
    'Subdomain',
    'PWA',
    'AI Integration',
    'Shipping Method',
    'POS System'
  ];

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'Custom Domain':
      case 'Subdomain':
        return <Globe className="h-4 w-4" />;
      case 'PWA':
        return <FileText className="h-4 w-4" />;
      case 'AI Integration':
        return <Bot className="h-4 w-4" />;
      case 'POS System':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  return (
    <PageTemplate 
      title={t("Plans")}
      description={t("Your store plan")}
      url="/plans"
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Plans') }
      ]}
    >
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Status Banner */}
        {userOnTrial && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Timer className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-900">{t('Free Trial Active')}</h3>
              <p className="text-sm text-blue-700">
                {t('You have {{days}} days left in your free trial. Subscribe now to keep your store online!', { days: trialDaysLeft })}
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-lg px-4 py-1">
              {trialDaysLeft} {t('days')}
            </Badge>
          </div>
        )}

        {isTrialExpired && !isLifetime && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-900">{t('Trial Expired')}</h3>
              <p className="text-sm text-red-700">
                {t('Your 7-day free trial has ended. Your store is currently offline. Subscribe now to bring it back online!')}
              </p>
            </div>
          </div>
        )}

        {isLifetime && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Crown className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-green-900">{t('Lifetime License Active')}</h3>
              <p className="text-sm text-green-700">
                {t('Your store is active forever. Enjoy unlimited access with lifetime hosting and support!')}
              </p>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 px-4 py-1">
              <Infinity className="h-4 w-4 mr-1" />
              {t('Lifetime')}
            </Badge>
          </div>
        )}

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {isLifetime ? t("Your Lifetime Plan") : t("Own Your Store Forever")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isLifetime 
              ? t("You have a lifetime license. Your store will never expire.")
              : t("One-time payment. Lifetime hosting, support & updates. No monthly fees.")
            }
          </p>
        </div>

        {/* Plan Card */}
        {plan && (
          <div className="relative">
            {/* Lifetime Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-primary text-primary-foreground px-5 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-sm font-medium">
                <Infinity className="h-4 w-4" />
                {t("Lifetime")}
              </div>
            </div>

            <div className="relative rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/5 shadow-xl p-8 pt-10">
              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-6xl font-extrabold text-primary">
                    {plan.formatted_price || formatSuperadminCurrency(plan.price)}
                  </span>
                </div>
                <p className="text-muted-foreground mt-2 font-medium">{t('One-time payment')}</p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: <Server className="h-5 w-5" />, text: t('Free Lifetime Hosting') },
                  { icon: <HeadphonesIcon className="h-5 w-5" />, text: t('Lifetime Support') },
                  { icon: <Zap className="h-5 w-5" />, text: t('Free Updates Forever') },
                  { icon: <Shield className="h-5 w-5" />, text: t('No Monthly Fees') },
                ].map((h, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-primary/30 transition-colors">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      {h.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{h.text}</span>
                  </div>
                ))}
              </div>

              {/* Stats - All Unlimited */}
              <div className="grid grid-cols-5 gap-2 mb-8">
                {[
                  { icon: <Store className="h-4 w-4" />, value: '∞', label: t('Stores'), color: 'blue' },
                  { icon: <Users className="h-4 w-4" />, value: '∞', label: t('Users'), color: 'emerald' },
                  { icon: <Box className="h-4 w-4" />, value: '∞', label: t('Products'), color: 'orange' },
                  { icon: <HardDrive className="h-4 w-4" />, value: '∞', label: t('Storage'), color: 'amber' },
                  { icon: <FileText className="h-4 w-4" />, value: plan.stats?.templates || '7', label: t('Themes'), color: 'purple' },
                ].map((stat, i) => (
                  <div key={i} className={`relative overflow-hidden bg-white rounded-xl border border-gray-200 p-3 text-center`}>
                    <div className={`text-xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                    <div className={`text-xs font-medium text-${stat.color}-600 uppercase tracking-wide`}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="relative flex items-center my-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <div className="mx-3 bg-primary/10 text-primary p-1.5 rounded-full">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t("Features")}</h4>
                <ul className="grid grid-cols-2 gap-2.5">
                  {commonFeatures.map((feature, index) => {
                    const included = plan.features?.includes(feature);
                    return (
                      <li key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-medium">{t(feature)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t border-gray-200">
                {isLifetime ? (
                  <Button disabled className="w-full bg-green-100 text-green-800 border-green-200 h-12 text-base">
                    <Crown className="h-5 w-5 mr-2" />
                    {t('Lifetime License Active')}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    {hasPermission('subscribe-plans', auth) && (
                      <Button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={processing}
                        className="w-full h-12 text-base font-bold"
                      >
                        <Sparkles className="h-5 w-5 mr-2" />
                        {isTrialExpired 
                          ? t('Subscribe Now - Bring Your Store Back Online!')
                          : userOnTrial 
                            ? t('Subscribe Now - {{price}}', { price: plan.formatted_price || formatSuperadminCurrency(plan.price) })
                            : t('Subscribe Now')
                        }
                      </Button>
                    )}
                    {userOnTrial && (
                      <p className="text-center text-sm text-muted-foreground">
                        {t('Your trial ends in {{days}} days', { days: trialDaysLeft })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Image Size Note */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t('Maximum image size: 5MB per file. Supported formats: JPG, PNG, WebP, GIF.')}
          </p>
        </div>
      </div>

      {/* Subscription Modal */}
      {!isAdmin && selectedPlan && (
        <PlanSubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => {
            setIsSubscriptionModalOpen(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
          billingCycle="lifetime"
          paymentMethods={formatPaymentMethods(selectedPlan.paymentMethods)}
        />
      )}
    </PageTemplate>
  );
}
