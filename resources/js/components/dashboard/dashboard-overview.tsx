import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Zap,
  ArrowRight,
  Sparkles,
  Building2,
  CreditCard,
  Tag,
  Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
import { hasPermission } from '@/utils/permissions';

interface DashboardOverviewProps {
  userType: 'superadmin' | 'company';
  stats: {
    totalCompanies?: number;
    totalStores?: number;
    activeStores?: number;
    totalPlans?: number;
    activePlans?: number;
    totalRevenue?: number;
    orders?: number;
    products?: number;
    customers?: number;
    revenue?: number;
  };
}

export function DashboardOverview({ userType, stats }: DashboardOverviewProps) {
  const { t } = useTranslation();
  const { themeColor, customColor, titleText } = useBrand();
  
  const getThemeColorValue = () => {
    return themeColor === 'custom' ? customColor : THEME_COLORS[themeColor];
  };
  
  const themeColorName = themeColor === 'custom' ? 'green' : themeColor;

  if (userType === 'superadmin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            {t(`${titleText || 'Nashmi Store'} Platform Overview`)}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('Comprehensive multi-store e-commerce platform with advanced features')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Management */}
            <div className="group">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full transition-shadow hover:shadow-lg">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stats.totalCompanies || 0}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1 text-sm group-hover:text-primary transition-colors">
                    {t('Company Management')}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {t('Manage registered companies and their store subscriptions')}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between text-xs hover:bg-primary/10"
                    onClick={() => router.visit(route('companies.index'))}
                  >
                    {t('Manage Companies')} <Building2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Plan Management */}
            <div className="group">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full transition-shadow hover:shadow-lg">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="rounded-full p-2 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stats.activePlans || 0}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1 text-sm group-hover:text-primary transition-colors">
                    {t('Plan Management')}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {t('Configure subscription plans, pricing, and features')}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between text-xs hover:bg-primary/10"
                    onClick={() => router.visit(route('plans.index'))}
                  >
                    {t('Manage Plans')} <CreditCard className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Referral Management */}
            <div className="group">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full transition-shadow hover:shadow-lg">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="rounded-full p-2 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                      <Users className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="h-2 w-2 mr-1" />
                      {t('Active')}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1 text-sm group-hover:text-primary transition-colors">
                    {t('Referral System')}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {t('Manage referral programs and commission tracking')}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between text-xs hover:bg-primary/10"
                    onClick={() => router.visit(route('referral.index'))}
                  >
                    {t('Manage Referrals')} <Users className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="group">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full transition-shadow hover:shadow-lg">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="rounded-full p-2 bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                      <Settings className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="h-2 w-2 mr-1" />
                      {t('Live')}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1 text-sm group-hover:text-primary transition-colors">
                    {t('System Settings')}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {t('Configure platform settings and system preferences')}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between text-xs hover:bg-primary/10"
                    onClick={() => router.visit(route('settings'))}
                  >
                    {t('System Settings')} <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Features */}
          <div className={`mt-6 p-4 rounded-lg bg-gradient-to-r from-${themeColorName}-50 to-${themeColorName === 'green' ? 'emerald' : themeColorName}-50 dark:from-${themeColorName}-950/20 dark:to-${themeColorName === 'green' ? 'emerald' : themeColorName}-950/20 border border-${themeColorName}-200 dark:border-${themeColorName}-800`}>
            <div className="flex items-start gap-3">
              <div className={`rounded-full p-2 bg-${themeColorName}-100 text-${themeColorName}-600 dark:bg-${themeColorName}-900 dark:text-${themeColorName}-400`}>
                <Globe className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold text-${themeColorName}-900 dark:text-${themeColorName}-100 mb-1`}>
                  {t(`${titleText || 'Nashmi Store'} SaaS Platform`)}
                </h3>
                <p className={`text-sm text-${themeColorName}-700 dark:text-${themeColorName}-300 mb-3`}>
                  {t('Complete multi-tenant e-commerce solution enabling companies to create and manage multiple online stores with advanced subscription management.')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={`text-xs bg-white/50 text-${themeColorName}-700 border-${themeColorName}-300`}>
                    {t('Multi-Store Platform')}
                  </Badge>
                  <Badge variant="outline" className={`text-xs bg-white/50 text-${themeColorName}-700 border-${themeColorName}-300`}>
                    {t('Subscription Management')}
                  </Badge>
                  <Badge variant="outline" className={`text-xs bg-white/50 text-${themeColorName}-700 border-${themeColorName}-300`}>
                    {t('System Analytics')}
                  </Badge>
                  <Badge variant="outline" className={`text-xs bg-white/50 text-${themeColorName}-700 border-${themeColorName}-300`}>
                    {t('Revenue Tracking')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Company user overview
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5 text-green-600" />
          {t('Store Management')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('Manage your online store with powerful e-commerce tools')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Products */}
          {hasPermission('manage-products') && (
            <div className="group">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full transition-shadow hover:shadow-lg">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                      <Package className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stats.products || 0}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1 text-sm group-hover:text-primary transition-colors">
                    {t('Product Catalog')}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {t('Manage your product inventory and listings')}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between text-xs hover:bg-primary/10"
                    onClick={() => router.visit(route('products.index'))}
                  >
                    {t('Manage Products')} <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Orders */}
          {hasPermission('manage-orders') && (
            <div className="group">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full transition-shadow hover:shadow-lg">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="rounded-full p-2 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                      <ShoppingCart className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stats.orders || 0}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1 text-sm group-hover:text-primary transition-colors">
                    {t('Order Management')}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {t('Process and track customer orders')}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between text-xs hover:bg-primary/10"
                    onClick={() => router.visit(route('orders.index'))}
                  >
                    {t('View Orders')} <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Customers */}
          {hasPermission('manage-customers') && (
            <div className="group">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full transition-shadow hover:shadow-lg">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="rounded-full p-2 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                      <Users className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stats.customers || 0}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1 text-sm group-hover:text-primary transition-colors">
                    {t('Customer Base')}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {t('Manage customer relationships and data')}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between text-xs hover:bg-primary/10"
                    onClick={() => router.visit(route('customers.index'))}
                  >
                    {t('View Customers')} <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics */}
          {hasPermission('manage-analytics') && (
            <div className="group">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full transition-shadow hover:shadow-lg">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="rounded-full p-2 bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <BarChart3 className="h-2 w-2 mr-1" />
                      {t('Live')}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1 text-sm group-hover:text-primary transition-colors">
                    {t('Store Analytics')}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {t('Track performance and insights')}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between text-xs hover:bg-primary/10"
                    onClick={() => router.visit(route('analytics.index'))}
                  >
                    {t('View Analytics')} <BarChart3 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Nashmi Store Features */}
        <div className={`mt-6 p-4 rounded-lg bg-gradient-to-r from-${themeColorName}-50 to-${themeColorName === 'green' ? 'emerald' : themeColorName}-50 dark:from-${themeColorName}-950/20 dark:to-${themeColorName === 'green' ? 'emerald' : themeColorName}-950/20 border border-${themeColorName}-200 dark:border-${themeColorName}-800`}>
          <div className="flex items-start gap-3">
            <div className={`rounded-full p-2 bg-${themeColorName}-100 text-${themeColorName}-600 dark:bg-${themeColorName}-900 dark:text-${themeColorName}-400`}>
              <Store className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold text-${themeColorName}-900 dark:text-${themeColorName}-100 mb-1`}>
                {t(`${titleText || 'Nashmi Store'} Features`)}
              </h3>
              <p className={`text-sm text-${themeColorName}-700 dark:text-${themeColorName}-300 mb-3`}>
                {t('Complete e-commerce solution with powerful store management tools and comprehensive analytics.')}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={`text-xs bg-white/50 text-${themeColorName}-700 border-${themeColorName}-300`}>
                  {t('Store Management')}
                </Badge>
                <Badge variant="outline" className={`text-xs bg-white/50 text-${themeColorName}-700 border-${themeColorName}-300`}>
                  {t('Product Catalog')}
                </Badge>
                <Badge variant="outline" className={`text-xs bg-white/50 text-${themeColorName}-700 border-${themeColorName}-300`}>
                  {t('Order Processing')}
                </Badge>
                <Badge variant="outline" className={`text-xs bg-white/50 text-${themeColorName}-700 border-${themeColorName}-300`}>
                  {t('Customer Analytics')}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}