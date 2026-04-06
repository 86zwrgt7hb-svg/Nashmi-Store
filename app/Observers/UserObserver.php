<?php

namespace App\Observers;

use App\Models\User;
use App\Models\Plan;

class UserObserver
{
    /**
     * Handle the User "creating" event.
     */
    public function creating(User $user): void
    {
        // If user is company type and has no plan_id, assign Free plan
        if ($user->type === 'company' && is_null($user->plan_id)) {
            $freePlan = Plan::where('name', 'Free')->first() ?? Plan::find(1);
            
            if ($freePlan) {
                $user->plan_id = $freePlan->id;
                $user->plan_is_active = 1;
            }
        }
    }
    
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        // Generate a unique referral code if not already set
        if ($user->type === 'company' && empty($user->referral_code)) {
            do {
                $code = rand(100000, 999999);
            } while (User::where('referral_code', $code)->exists());
            
            $user->referral_code = $code;
            $user->saveQuietly();
        }
        
        // Create default settings for new users
        if ($user->type === 'superadmin') {
            createDefaultSettings($user->id);
        } elseif ($user->type === 'company') {
            // Create default store if current_store is null and not during seeding
            if (is_null($user->current_store) && $user->email !== 'company@example.com' && !app()->runningInConsole()) {
                $storeName = $user->lang === 'ar' ? 'اسم نشاطك التجاري' : 'Your Business Name';
                $store = \App\Models\Store::create([
                    'name' => $storeName,
                    'slug' => \App\Models\Store::generateUniqueSlug($storeName),
                    'theme' => 'gadgets',
                    'user_id' => $user->id,
                    'email' => $user->email,
                ]);
                
                $user->update(['current_store' => $store->id]);
            }

            copySettingsFromSuperAdmin($user->id, $user->current_store);
        }
    }
}
