import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { MessageCircle, CheckCircle } from 'lucide-react';

interface WhatsAppPaymentFormProps {
  planId: number;
  planPrice: number;
  couponCode: string;
  billingCycle: string;
  whatsappNumber: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function WhatsAppPaymentForm({ 
  planId, 
  planPrice,
  couponCode, 
  billingCycle, 
  whatsappNumber,
  onSuccess, 
  onCancel 
}: WhatsAppPaymentFormProps) {
  const { t, i18n } = useTranslation();
  const [processing, setProcessing] = useState(false);
  const isArabic = i18n.language === 'ar';

  const messageTemplate = isArabic
    ? `مرحباً، أود ترخيص متجري على منصة نشمي ستور\nالباقة: ${planPrice}\nنوع الاشتراك: ${billingCycle}`
    : `Hello, I would like to license my store on Nashmi Store\nPlan: ${planPrice}\nBilling: ${billingCycle}`;

  const whatsappLink = `https://wa.me/${whatsappNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(messageTemplate)}`;

  const handleWhatsAppPayment = () => {
    setProcessing(true);
    
    // First record the payment intent
    router.post(route('bank.payment'), {
      plan_id: planId,
      billing_cycle: billingCycle,
      coupon_code: couponCode,
      amount: planPrice,
      payment_method: 'whatsapp',
    }, {
      onSuccess: () => {
        toast.success(t('Payment request submitted. Redirecting to WhatsApp...'));
        // Open WhatsApp link
        window.open(whatsappLink, '_blank');
        onSuccess();
      },
      onError: () => {
        toast.error(t('Failed to submit payment request'));
      },
      onFinish: () => {
        setProcessing(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-medium">{t('WhatsApp Payment')}</h3>
          </div>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              {t('Click the button below to send a licensing request via WhatsApp. Our team will process your payment and activate your plan.')}
            </p>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-800 font-medium mb-1">{t('Message Preview:')}</p>
              <p className="text-xs text-green-700 whitespace-pre-line">{messageTemplate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">{t('How it works')}</p>
              <ul className="space-y-1 text-xs">
                <li>• {t('A WhatsApp message will be sent with your licensing request')}</li>
                <li>• {t('Our team will guide you through the payment process')}</li>
                <li>• {t('Your plan will be activated after payment confirmation')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          {t('Cancel')}
        </Button>
        <Button 
          onClick={handleWhatsAppPayment} 
          disabled={processing}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {processing ? t('Processing...') : t('Send via WhatsApp')}
        </Button>
      </div>
    </div>
  );
}
