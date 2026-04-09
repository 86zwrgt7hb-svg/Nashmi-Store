import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Crown, Circle, Infinity, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Plan {
  id: number;
  name: string;
  price: string;
  yearly_price?: string;
  monthly_price?: string;
  duration: string;
  description?: string;
  features?: string[];
  is_active?: boolean;
  is_current?: boolean;
}

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (planId: number, billingCycle: 'monthly' | 'yearly') => void;
  plans: Plan[];
  currentPlanId?: number;
  companyCurrentPlanDuration?: string;
  companyName: string;
}

export function UpgradePlanModal({
  isOpen,
  onClose,
  onConfirm,
  plans,
  currentPlanId,
  companyCurrentPlanDuration,
  companyName
}: UpgradePlanModalProps) {
  const { t } = useTranslation();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  
  useEffect(() => {
    if (!isOpen || !plans || plans.length === 0) return;
    
    const currentPlan = plans.find(plan => plan.is_current === true);
    if (currentPlan) {
      setSelectedPlanId(currentPlan.id);
    } else if (currentPlanId) {
      setSelectedPlanId(currentPlanId);
    } else {
      setSelectedPlanId(plans[0].id);
    }
  }, [isOpen, plans, currentPlanId]);
  
  const handleConfirm = () => {
    if (selectedPlanId) {
      // Always pass 'yearly' as a placeholder — backend handles lifetime logic
      onConfirm(selectedPlanId, 'yearly');
    }
  };
  
  const formatCurrency = (amount: number | string): string => {
    const num = Number(amount) || 0;
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            {t("Assign Lifetime License")} — {companyName}
          </DialogTitle>
          <DialogDescription>
            {t("Assign a lifetime store license to this company")}
          </DialogDescription>
        </DialogHeader>
        
        {/* Lifetime Badge — replaces the old monthly/yearly toggle */}
        <div className="flex items-center justify-center gap-3 py-4 border-b">
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-purple-50 border border-amber-200 rounded-full px-5 py-2">
            <Infinity className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-800">{t('Lifetime License')}</span>
            <Shield className="h-4 w-4 text-purple-600" />
          </div>
        </div>
        
        <div className="py-4 flex-1 overflow-y-auto -mx-6 px-6">
          <RadioGroup 
            value={selectedPlanId?.toString() || ""} 
            onValueChange={(value) => setSelectedPlanId(parseInt(value))}
            className="space-y-4"
          >
            <div className="space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex items-center space-x-3 rounded-xl border-2 p-5 transition-all ${
                    selectedPlanId === plan.id 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.is_current ? 'bg-green-50 border-green-300' : ''}`}
                >
                  <div className="relative">
                    <RadioGroupItem 
                      value={plan.id.toString()} 
                      id={`plan-${plan.id}`} 
                      className="h-5 w-5"
                    />
                    {selectedPlanId === plan.id && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Circle className="h-2.5 w-2.5 fill-primary text-primary" />
                      </div>
                    )}
                  </div>
                  <Label
                    htmlFor={`plan-${plan.id}`}
                    className="flex flex-1 cursor-pointer items-center justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-bold">{plan.name}</p>
                        {plan.is_current && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            {t("Current")}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-extrabold text-primary">
                          {formatCurrency(plan.price)}
                        </span>
                        <span className="text-sm text-muted-foreground font-medium">
                          / {t('Lifetime')}
                        </span>
                      </div>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      )}
                      {plan.features && plan.features.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-xs text-muted-foreground">
                              <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedPlanId}
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
          >
            <Crown className="h-4 w-4 mr-2" />
            {t("Assign Lifetime License")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
