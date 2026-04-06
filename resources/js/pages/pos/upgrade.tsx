import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Lock, Smartphone, Barcode, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
    message?: string;
}

export default function PosUpgrade({ message }: Props) {
    const { t } = useTranslation();

    const features = [
        {
            icon: Barcode,
            title: t('Barcode Scanner'),
            description: t('Scan product barcodes for instant checkout with hardware scanner support'),
        },
        {
            icon: ShoppingCart,
            title: t('Quick Sales'),
            description: t('Process in-store sales quickly with an intuitive point of sale interface'),
        },
        {
            icon: Smartphone,
            title: t('Mobile POS'),
            description: t('Turn any device into a point of sale terminal for your business'),
        },
    ];

    return (
        <AppLayout>
            <Head title={t('POS System - Upgrade Required')} />
            <div className="flex items-center justify-center min-h-[70vh] p-4">
                <div className="max-w-2xl w-full text-center space-y-8">
                    {/* Lock Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <Lock className="w-10 h-10 text-primary" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {t('Upgrade to Unlock POS System')}
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-md mx-auto">
                            {t('The Point of Sale system is available on paid plans. Upgrade your plan to start processing in-store sales.')}
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                        {features.map((feature, index) => (
                            <Card key={index} className="border-dashed">
                                <CardContent className="pt-6 text-center space-y-3">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                        <Link href={route('plans.index')}>
                            <Button size="lg" className="gap-2 text-base px-8">
                                {t('View Plans & Upgrade')}
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <p className="text-xs text-muted-foreground mt-3">
                            {t('Upgrade takes effect immediately. No data will be lost.')}
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
