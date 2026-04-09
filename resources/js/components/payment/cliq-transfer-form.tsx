import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { Copy, CheckCircle } from 'lucide-react';

interface CliQTransferFormProps {
  planId: number;
  planPrice: number;
  couponCode: string;
  billingCycle: string;
  cliqDetails: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CliQTransferForm({ 
  planId, 
  planPrice,
  couponCode, 
  billingCycle, 
  cliqDetails,
  onSuccess, 
  onCancel 
}: CliQTransferFormProps) {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('Copied to clipboard'));
  };

  const handleConfirmPayment = () => {
    setProcessing(true);
    
    router.post(route('bank.payment'), {
      plan_id: planId,
      billing_cycle: billingCycle,
      coupon_code: couponCode,
      amount: planPrice,
      payment_method: 'cliq',
    }, {
      onSuccess: () => {
        toast.success(t('Payment request submitted successfully'));
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
          <h3 className="font-medium mb-3">{t('CliQ Transfer Details')}</h3>
          <div className="space-y-3 text-sm">
            <div className="whitespace-pre-line">{cliqDetails}</div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">{t('Amount')}: {planPrice}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(planPrice.toString())}
              >
                <Copy className="h-3 w-3 mr-1" />
                {t('Copy')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">{t('Important Instructions')}</p>
              <ul className="space-y-1 text-xs">
                <li>• {t('Transfer the exact amount using CliQ')}</li>
                <li>• {t('Your plan will be activated after payment verification')}</li>
                <li>• {t('Verification may take 1-3 business days')}</li>
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
          onClick={handleConfirmPayment} 
          disabled={processing}
          className="flex-1"
        >
          {processing ? t('Processing...') : t('I have made the payment')}
        </Button>
      </div>
    </div>
  );
}
