import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Bell, Mail, Smartphone, Save, ShoppingCart, Package, Star, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';

interface NotificationPreference {
  email_new_order: boolean;
  email_order_status: boolean;
  email_low_stock: boolean;
  email_new_review: boolean;
  push_new_order: boolean;
  push_order_status: boolean;
  push_low_stock: boolean;
  push_new_review: boolean;
  low_stock_threshold: number;
}

interface Props {
  preferences: NotificationPreference;
}

export default function NotificationSettingsIndex({ preferences }: Props) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<NotificationPreference>(preferences || {
    email_new_order: true,
    email_order_status: true,
    email_low_stock: true,
    email_new_review: true,
    push_new_order: false,
    push_order_status: false,
    push_low_stock: false,
    push_new_review: false,
    low_stock_threshold: 5,
  });
  const [saving, setSaving] = useState(false);

  const handleToggle = (key: keyof NotificationPreference) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaving(true);
    router.put(route('notification-settings.update'), settings, {
      preserveState: true,
      onSuccess: () => {
        toast.success(t('Notification settings updated successfully'));
        setSaving(false);
      },
      onError: () => {
        setSaving(false);
      }
    });
  };

  const notificationTypes = [
    {
      key: 'new_order',
      icon: ShoppingCart,
      title: t('New Order'),
      description: t('Notify me when a new order is placed'),
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      key: 'order_status',
      icon: Package,
      title: t('Order Status Change'),
      description: t('Notify me when order status changes'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      key: 'low_stock',
      icon: AlertTriangle,
      title: t('Low Stock Alert'),
      description: t('Notify me when stock is low'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      key: 'new_review',
      icon: Star,
      title: t('New Review'),
      description: t('Notify me when a new review is submitted'),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    },
  ];

  return (
    <PageTemplate
      title={t('Notification Settings')}
      description={t('Configure your notification preferences')}
      url="/notification-settings"
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Notification Settings') }
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>{t('Email Notifications')}</CardTitle>
                <CardDescription>{t('Manage your email notification preferences')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationTypes.map((type) => {
              const emailKey = `email_${type.key}` as keyof NotificationPreference;
              return (
                <div key={type.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${type.bgColor}`}>
                      <type.icon className={`h-4 w-4 ${type.color}`} />
                    </div>
                    <div>
                      <Label className="font-medium cursor-pointer">{type.title}</Label>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings[emailKey] as boolean}
                    onCheckedChange={() => handleToggle(emailKey)}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>{t('Push Notifications')}</CardTitle>
                <CardDescription>{t('Manage your push notification preferences')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationTypes.map((type) => {
              const pushKey = `push_${type.key}` as keyof NotificationPreference;
              return (
                <div key={type.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${type.bgColor}`}>
                      <type.icon className={`h-4 w-4 ${type.color}`} />
                    </div>
                    <div>
                      <Label className="font-medium cursor-pointer">{type.title}</Label>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings[pushKey] as boolean}
                    onCheckedChange={() => handleToggle(pushKey)}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Stock Alert Threshold */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>{t('Low Stock Threshold')}</CardTitle>
                <CardDescription>{t('Minimum stock quantity to trigger alert')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={1000}
                value={settings.low_stock_threshold}
                onChange={(e) => setSettings(prev => ({ ...prev, low_stock_threshold: parseInt(e.target.value) || 5 }))}
                className="w-32"
              />
              <span className="text-sm text-muted-foreground">{t('units')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="h-4 w-4 me-2" />
            {saving ? t('Saving...') : t('Save Preferences')}
          </Button>
        </div>
      </div>
    </PageTemplate>
  );
}
