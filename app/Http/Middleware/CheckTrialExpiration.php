<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Plan;
use Carbon\Carbon;

class CheckTrialExpiration
{
    private function isOnTrial($user): bool
    {
        return in_array($user->is_trial, ['yes', '1'], true);
    }

    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();
        
        if (!$user || $user->type !== 'company' || !$this->isOnTrial($user)) {
            return $next($request);
        }

        $trialExpireDate = Carbon::parse($user->trial_expire_date);
        $now = now();
        
        // If trial has expired, downgrade to Free plan
        if ($now->isAfter($trialExpireDate)) {
            $freePlan = Plan::where('name', 'Free')->first() ?? Plan::find(1);
            
            if ($freePlan) {
                $user->update([
                    'plan_id' => $freePlan->id,
                    'is_trial' => 'no',
                    'trial_day' => 0,
                    'trial_used' => true,
                ]);
                
                // Enforce free plan limitations
                // Check if user exceeds free plan limits
                $limitsCheck = checkExceedsFreePlanLimits($user->fresh());
                if ($limitsCheck['exceeds']) {
                    // User exceeds free plan limits - suspend stores and start grace period
                    suspendUserStores($user->fresh());
                } else {
                    // User is within limits - just enforce normally
                    if (function_exists('enforcePlanLimitations')) {
                        enforcePlanLimitations($user->fresh());
                    }
                }
                
                // Show trial ended message
                if ($user->lang === 'ar') {
                    session()->flash('error', 'انتهت فترة التجربة المجانية. تم تحويلك إلى الخطة المجانية. يمكنك الاشتراك في أي وقت.');
                } else {
                    session()->flash('error', 'Your free trial has ended. You have been moved to the Free plan. You can subscribe anytime.');
                }
            }
        }
        // If trial is ending tomorrow, show warning
        elseif ($now->diffInDays($trialExpireDate, false) === 1) {
            if (!session()->has('trial_warning_shown')) {
                if ($user->lang === 'ar') {
                    session()->flash('success', 'تنبيه: فترة التجربة المجانية ستنتهي غداً. قم بالاشتراك الآن للحفاظ على الميزات المتقدمة.');
                } else {
                    session()->flash('success', 'Alert: Your free trial ends tomorrow. Subscribe now to keep advanced features.');
                }
                session()->put('trial_warning_shown', true);
            }
        }
        // Welcome message - show after 1 hour of registration
        elseif (!session()->has('trial_welcome_shown')) {
            $registeredAt = Carbon::parse($user->created_at);
            if ($now->diffInMinutes($registeredAt) >= 60) {
                if ($user->lang === 'ar') {
                    session()->flash('success', 'مبروك! حصلت على هدية 7 أيام تجربة مجانية. استمتع بجميع الميزات المتقدمة!');
                } else {
                    session()->flash('success', 'Congratulations! You received a gift of 7 days free trial. Enjoy all advanced features!');
                }
                session()->put('trial_welcome_shown', true);
            }
        }
        
        return $next($request);
    }
}
