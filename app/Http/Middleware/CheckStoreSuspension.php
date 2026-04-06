<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckStoreSuspension
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();
        
        if (!$user || $user->type !== 'company') {
            return $next($request);
        }

        // If store is archived, nothing to check - user must subscribe
        if ($user->store_archived) {
            return $next($request);
        }

        // If store is suspended (grace period active), check if user fixed the limits
        if ($user->store_suspended) {
            $limitsCheck = function_exists('checkExceedsFreePlanLimits') 
                ? checkExceedsFreePlanLimits($user) 
                : ['exceeds' => false];
            
            if (!$limitsCheck['exceeds']) {
                // User fixed the limits! Unsuspend stores
                if (function_exists('unsuspendUserStores')) {
                    unsuspendUserStores($user);
                }
                
                if ($user->lang === 'ar') {
                    session()->flash('success', 'تم إعادة تفعيل متجرك بنجاح! أنت الآن ضمن حدود الخطة المجانية.');
                } else {
                    session()->flash('success', 'Your store has been reactivated! You are now within the free plan limits.');
                }
            }
        }

        return $next($request);
    }
}
