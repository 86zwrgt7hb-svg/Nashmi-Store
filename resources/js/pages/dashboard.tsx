import React, { useState } from 'react';
import { PageTemplate, type PageAction } from '@/components/page-template';
import { RefreshCw, BarChart3, Download, Building2, ShoppingCart, Users, DollarSign, Package, TrendingUp, QrCode, Copy, Check, CreditCard, FileText, Tag, Activity, ArrowRight, Sparkles, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Link, router, usePage } from '@inertiajs/react';
import QRCode from 'react-qr-code';
import { formatCurrency } from '@/utils/currency-helper';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { hasPermission, checkPermission } from '@/utils/permissions';
import { ResourceUsageCard } from '@/components/dashboard/ResourceUsageCard';

interface Props {
  dashboardData: {
    metrics: {
      orders?: number;
      products?: number;
      customers?: number;
      revenue?: number;
      totalCompanies?: number;
      totalStores?: number;
      activeStores?: number;
      totalPlans?: number;
      activePlans?: number;
      totalRevenue?: number;
      monthlyRevenue?: number;
      monthlyGrowth?: number;
      pendingRequests?: number;
      pendingOrders?: number;
      approvedOrders?: number;
      totalOrders?: number;
      activeCoupons?: number;
      totalCoupons?: number;
    };
    recentOrders: any[];
    topProducts?: any[];
    topPlans?: any[];
  };
  currentStore?: any;
  storeUrl?: string;
  isSuperAdmin: boolean;
  resourceUsage?: any;
}

export default function Dashboard({ dashboardData, currentStore, storeUrl, isSuperAdmin, resourceUsage }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  
  const breadcrumbs = [
    { title: t('Dashboard') }
  ];


  const { themeColor, customColor } = useBrand();
  
  const userHasPermission = (permission: string) => {
    return isSuperAdmin || hasPermission(permission);
  };
  
  const handleCardClick = (routeName: string, requiredPermission: string, id?: any) => {
    if (!checkPermission(requiredPermission)) {
      return;
    }
    
    if (id) {
      router.visit(route(routeName, id));
    } else {
      router.visit(route(routeName));
    }
  };
  
  const getThemeColorValue = () => {
    return themeColor === 'custom' ? customColor : THEME_COLORS[themeColor];
  };
  
  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(storeUrl!);
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = storeUrl!;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
    }
  };

  const pageActions: PageAction[] = isSuperAdmin ? [
    {
      label: t('Refresh'),
      icon: <RefreshCw className="h-4 w-4" />,
      variant: 'outline',
      onClick: () => router.reload({ only: ['dashboardData'] })
    }
  ] : [
    ...(userHasPermission('manage-analytics') ? [{
      label: t('Analytics'),
      icon: <BarChart3 className="h-4 w-4" />,
      variant: 'outline',
      onClick: () => router.visit(route('analytics.index'))
    }] : []),
    ...(userHasPermission('export-dashboard') ? [{
      label: t('Export'),
      icon: <Download className="h-4 w-4" />,
      variant: 'default',
      onClick: () => window.open(route('dashboard.export'), '_blank')
    }] : [])
  ];

  if (isSuperAdmin) {
    return (
      <PageTemplate title={t('Dashboard')} description={t('Nashmi Store system-wide statistics and overview')} url="/dashboard" actions={pageActions} breadcrumbs={breadcrumbs}>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('Total Companies')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{dashboardData.metrics.totalCompanies || 0}</div>
                  <div className="p-3 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{t('Registered companies')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('Total Stores')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{dashboardData.metrics.totalStores || 0}</div>
                  <div className="p-3 bg-green-100 rounded-full flex items-center justify-center">
                    <Store className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{dashboardData.metrics.activeStores || 0} {t('active stores')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('Active Plans')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{dashboardData.metrics.activePlans || 0}</div>
                  <div className="p-3 bg-purple-100 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{t('Currently enabled plans')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('Monthly Growth')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">
                    {(dashboardData.metrics.monthlyGrowth || 0) >= 0 ? '+' : ''}{dashboardData.metrics.monthlyGrowth || 0}%
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{t('System growing monthly')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('Total Revenue')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{formatCurrency(dashboardData.metrics.totalRevenue || 0)}</div>
                  <div className="p-3 bg-yellow-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{t('All-time earnings')}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t('System Activity')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentOrders.length > 0 ? dashboardData.recentOrders.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        activity.type === 'company_registered' ? 'bg-blue-500' :
                        activity.type === 'store_created' ? 'bg-green-500' :
                        activity.type === 'plan_subscribed' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description || activity.company || 'System Activity'}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time || 'Recently'}</p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded font-medium ${
                        activity.type === 'company_registered' ? 'bg-blue-100 text-blue-700' :
                        activity.type === 'store_created' ? 'bg-green-100 text-green-700' :
                        activity.type === 'plan_subscribed' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {activity.status || activity.type || 'active'}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{t('No recent system activity')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t('Subscription Plans Performance')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.topPlans?.length > 0 ? dashboardData.topPlans.map((plan, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-green-100 text-green-600' :
                          index === 1 ? 'bg-blue-100 text-blue-600' :
                          index === 2 ? 'bg-purple-100 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          #{index + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">{plan.name}</p>
                          <p className="text-sm text-gray-500">{plan.subscribers || plan.orders || 0} {t('active subscriptions')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">{formatCurrency(plan.revenue || 0)}</p>
                        <p className="text-xs text-gray-500">{t('monthly revenue')}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{t('No subscription data available')}</p>
                      <p className="text-xs mt-1">{t('Plans will appear here once companies subscribe')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <DashboardOverview 
            userType="superadmin" 
            stats={{
              totalCompanies: dashboardData.metrics.totalCompanies,
              totalStores: dashboardData.metrics.totalStores,
              activeStores: dashboardData.metrics.activeStores,
              totalPlans: dashboardData.metrics.totalPlans,
              activePlans: dashboardData.metrics.activePlans,
              totalRevenue: dashboardData.metrics.totalRevenue
            }}
          />
        </div>
      </PageTemplate>
    );
  }
  
  if (!currentStore) {
    return (
      <PageTemplate title={t('Dashboard')} description={t('Please select a store to view dashboard')} url="/dashboard" breadcrumbs={breadcrumbs}>
        <div className="text-center py-12">
          <p className="text-gray-500">{t('Please select a store to view dashboard')}</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate 
      title={t('Dashboard')}
      description={t('Store dashboard and analytics')}
      url="/dashboard"
      actions={pageActions}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-4">
        {/* Resource Usage Section - Shows warnings and progress bars */}
        {resourceUsage && (
          <ResourceUsageCard resourceUsage={resourceUsage} />
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {userHasPermission('view-orders') && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('orders.index', 'view-orders')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('Total Orders')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{dashboardData.metrics.orders?.toLocaleString() || 0}</div>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{currentStore.name}</p>
              </CardContent>
            </Card>
          )}
          
          {userHasPermission('view-products') && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('products.index', 'view-products')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('Total Products')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{dashboardData.metrics.products?.toLocaleString() || 0}</div>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{t('Active products')}</p>
              </CardContent>
            </Card>
          )}
          
          {userHasPermission('view-customers') && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('customers.index', 'view-customers')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('Total Customers')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{dashboardData.metrics.customers?.toLocaleString() || 0}</div>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{t('Registered customers')}</p>
              </CardContent>
            </Card>
          )}
          
          {userHasPermission('manage-analytics') && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('analytics.index', 'manage-analytics')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('Total Revenue')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{formatCurrency(dashboardData.metrics.revenue || 0)}</div>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{t('All time revenue')}</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {userHasPermission('view-orders') && (
            <Card>
              <CardHeader>
                <CardTitle>{t('Recent Orders')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentOrders.map((order, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <Link 
                          href={route('orders.show', order.id)} 
                          className="font-medium hover:underline"
                          style={{ color: getThemeColorValue() }}
                        >
                          {order.order_number}
                        </Link>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.amount)}</p>
                        <p className="text-sm text-muted-foreground">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {userHasPermission('view-products') && (
            <Card>
              <CardHeader>
                <CardTitle>{t('Top Products')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.topProducts?.map((product, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <Link 
                          href={route('products.show', product.id)} 
                          className="font-medium hover:underline"
                          style={{ color: getThemeColorValue() }}
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{product.sold} sold</p>
                      </div>
                      <div className="text-right">
                        <div className="flex flex-col items-end">
                          <p className="font-medium">{formatCurrency(product.sale_price || product.price)}</p>
                          {product.sale_price && (
                            <p className="text-xs line-through text-muted-foreground">{formatCurrency(product.price)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      {t('No products available')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                {t('Store QR Code')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <QRCode value={storeUrl!} size={120} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">{currentStore.name}</p>
                  <p className="text-xs text-muted-foreground">{t('Scan to visit store')}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? t('Copied!') : t('Copy Link')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DashboardOverview 
          userType="company" 
          stats={{
            orders: dashboardData.metrics.orders,
            products: dashboardData.metrics.products,
            customers: dashboardData.metrics.customers,
            revenue: dashboardData.metrics.revenue
          }}
        />
      </div>
    </PageTemplate>
  );
}
