<?php

namespace App\Models;

use App\Mail\VerifyEmailMailable;
use App\Mail\ResetPasswordMailable;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Lab404\Impersonate\Models\Impersonate;
use App\Models\Plan;
use App\Models\Referral;
use App\Models\PayoutRequest;
use App\Models\Store;
use App\Services\MailConfigService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Carbon;
use App\Notifications\BilingualVerifyEmail;
use App\Notifications\BilingualResetPassword;

class User extends BaseAuthenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasRoles, HasFactory, Notifiable, Impersonate;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'google_id',
        'email_verified_at',
        'password',
        'type',
        'avatar',
        'lang',
        'current_store',
        'delete_status',
        'plan_id',
        'plan_duration',
        'plan_expire_date',
        'requested_plan',
        'plan_is_active',
        'is_lifetime',
        'is_enable_login',
        'storage_limit',
        'mode',
        'created_by',
        'referral_code',
        'used_referral_code',
        'google2fa_enable',
        'google2fa_secret',
        'status',
        'is_trial',
        'trial_day',
        'trial_expire_date',
        'trial_used',
        'store_suspended',
        'grace_period_start',
        'store_archived',
        'archived_at',
        'active_module',
        'commission_amount'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'google2fa_secret',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'plan_expire_date' => 'date',
            'trial_expire_date' => 'date',
            'trial_used' => 'boolean',
            'store_suspended' => 'boolean',
            'grace_period_start' => 'datetime',
            'store_archived' => 'boolean',
            'archived_at' => 'datetime',
            'plan_is_active' => 'integer',
            'is_lifetime' => 'boolean',
            'is_active' => 'integer',
            'is_enable_login' => 'integer',
            'google2fa_enable' => 'integer',
            'storage_limit' => 'float',
        ];
    }

    /**
     * Get the creator ID based on user type
     */
    public function creatorId()
    {
        if ($this->type == 'superadmin' || $this->type == 'super admin' || $this->type == 'admin') {
            return $this->id;
        } else {
            return $this->created_by;
        }
    }
    
    /**
     * Get current store - for sub-users, get from company user
     */
    public function getCurrentStoreAttribute($value)
    {
        // If company user, return their own current_store
        if ($this->type === 'company' || $this->type === 'superadmin') {
            return $value;
        }
        
        // If sub-user, get current_store from company user
        if ($this->created_by) {
            $companyUser = static::find($this->created_by);
            return $companyUser ? $companyUser->getOriginal('current_store') : $value;
        }
        
        return $value;
    }

    /**
     * Check if user is super admin
     */
    public function isSuperAdmin()
    {
        return $this->type === 'superadmin' || $this->type === 'super admin';
    }

    /**
     * Check if user is admin
     */
    public function isAdmin()
    {
        return $this->type === 'admin';
    }
        

    
    /**
     * Get the plan associated with the user.
     */
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
    
    /**
     * Check if user is on free plan (legacy - now checks if on trial)
     */
    public function isOnFreePlan()
    {
        return $this->is_trial === 'yes' && !$this->is_lifetime;
    }

    /**
     * Check if user has a lifetime license
     */
    public function hasLifetimeLicense()
    {
        return (bool) $this->is_lifetime;
    }

    /**
     * Check if user is on active trial
     */
    public function isOnActiveTrial()
    {
        return $this->is_trial === 'yes' 
            && $this->trial_expire_date 
            && now()->isBefore(\Carbon\Carbon::parse($this->trial_expire_date));
    }

    /**
     * Get remaining trial days
     */
    public function getTrialDaysLeft()
    {
        if (!$this->isOnActiveTrial()) {
            return 0;
        }
        return max(0, (int) now()->diffInDays(\Carbon\Carbon::parse($this->trial_expire_date), false));
    }
    
    /**
     * Get current plan or default plan
     */
    public function getCurrentPlan()
    {
        if ($this->plan) {
            return $this->plan;
        }
        
        return Plan::getDefaultPlan();
    }
    
    /**
     * Check if user has an active plan subscription
     */
    public function hasActivePlan()
    {
        // Lifetime users always have active plan
        if ($this->is_lifetime && $this->plan_id && $this->plan_is_active) {
            return true;
        }

        // Trial users with valid trial period
        if ($this->isOnActiveTrial()) {
            return true;
        }

        return $this->plan_id && 
               $this->plan_is_active && 
               ($this->plan_expire_date === null || $this->plan_expire_date > now());
    }
    
    /**
     * Check if user's plan has expired
     */
    public function isPlanExpired()
    {
        return $this->plan_expire_date && $this->plan_expire_date < now();
    }
    
    /**
     * Check if user's trial has expired
     */
    public function isTrialExpired()
    {
        return $this->is_trial && $this->trial_expire_date && $this->trial_expire_date < now();
    }
    
    /**
     * Check if user needs to subscribe to a plan
     */
    public function needsPlanSubscription()
    {
        if ($this->isSuperAdmin()) {
            return false;
        }
        
        if ($this->type !== 'company') {
            return false;
        }

        // Lifetime users never need subscription
        if ($this->is_lifetime) {
            return false;
        }
        
        // Check if user has no plan
        if (!$this->plan_id) {
            return true;
        }

        // Active trial users don't need subscription yet
        if ($this->isOnActiveTrial()) {
            return false;
        }
        
        // Check if trial is expired (not lifetime = needs to pay)
        if ($this->isTrialExpired()) {
            return true;
        }
        
        // Check if plan is expired (but not on trial)
        if (!$this->is_trial && $this->isPlanExpired()) {
            return true;
        }
        
        return false;
    }

    /**
     * Check if user can be impersonated
     */
    public function canBeImpersonated()
    {
        return $this->type === 'company';
    }

    /**
     * Check if user can impersonate others
     */
    public function canImpersonate()
    {
        return $this->isSuperAdmin();
    }

    /**
     * Get referrals made by this company
     */
    public function referrals()
    {
        return $this->hasMany(Referral::class, 'company_id');
    }

    /**
     * Get payout requests made by this company
     */
    public function payoutRequests()
    {
        return $this->hasMany(PayoutRequest::class, 'company_id');
    }
    
    /**
     * Get plan orders made by this user
     */
    public function planOrders()
    {
        return $this->hasMany(PlanOrder::class);
    }
    
    /**
     * Get stores owned by this user
     */
    public function stores()
    {
        return $this->hasMany(Store::class);
    }

    /**
     * Get the user who created this user
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get referral balance for company
     */
    public function getReferralBalance()
    {
        $totalEarned = $this->referrals()->sum('amount');
        $totalRequested = $this->payoutRequests()->whereIn('status', ['pending', 'approved'])->sum('amount');
        return $totalEarned - $totalRequested;
    }
    
    /**
     * Send the email verification notification with bilingual template.
     */
    public function sendEmailVerificationNotification()
    {
        try {
            $mailConfigured = MailConfigService::setDynamicConfig();
            if (!$mailConfigured) {
                Log::warning("Mail not configured. Cannot send verification email to: {$this->email}");
                return;
            }

            // Force correct domain for URL generation
            URL::forceRootUrl(config('app.url'));
            URL::forceScheme('https');

            $verificationUrl = URL::temporarySignedRoute(
                'verification.verify',
                Carbon::now()->addMinutes(
                    Config::get('auth.verification.expire', 60)
                ),
                [
                    'id' => $this->getKey(),
                    'hash' => sha1($this->getEmailForVerification()),
                ]
            );

            Mail::to($this->email)->send(
                new VerifyEmailMailable($verificationUrl, $this->name ?? '')
            );

            Log::info("Verification email sent to: {$this->email}");
        } catch (\Throwable $e) {
            Log::error("Failed to send verification email to {$this->email}: " . $e->getMessage());
        }
    }

    /**
     * Send the password reset notification with bilingual template.
     */
    public function sendPasswordResetNotification($token)
    {
        try {
            $mailConfigured = MailConfigService::setDynamicConfig();
            if (!$mailConfigured) {
                Log::warning("Mail not configured. Cannot send password reset email to: {$this->email}");
                return;
            }

            // Force correct domain for URL generation
            URL::forceRootUrl(config('app.url'));
            URL::forceScheme('https');

            $resetUrl = url(route('password.reset', [
                'token' => $token,
                'email' => $this->getEmailForPasswordReset(),
            ], false));

            Mail::to($this->email)->send(
                new ResetPasswordMailable($resetUrl, $this->name ?? '')
            );

            Log::info("Password reset email sent to: {$this->email}");
        } catch (\Throwable $e) {
            Log::error("Failed to send password reset email to {$this->email}: " . $e->getMessage());
        }
    }

    /**
     * Check if user can create a new store
     */
    public function canCreateStore()
    {
        return \App\Http\Middleware\CheckPlanAccess::checkStoreLimit($this);
    }
    
    /**
     * Check if user can add more users to a store
     */
    public function canAddUserToStore($storeId)
    {
        return \App\Http\Middleware\CheckPlanAccess::checkUserLimit($this, $storeId);
    }
    
    /**
     * Check if user can add more products to a store
     */
    public function canAddProductToStore($storeId)
    {
        return \App\Http\Middleware\CheckPlanAccess::checkProductLimit($this, $storeId);
    }
    
    /**
     * Check if user has access to a specific feature
     */
    public function hasFeatureAccess($feature)
    {
        return \App\Http\Middleware\CheckPlanAccess::checkFeatureAccess($this, $feature);
    }
    
    /**
     * Get available themes based on plan
     */
    public function getAvailableThemes()
    {
        if (!$this->plan) {
            return [];
        }
        
        // If plan has specific themes, return only those
        if (is_array($this->plan->themes) && count($this->plan->themes) > 0) {
            return $this->plan->themes;
        }
        
        // If no specific themes, return all available themes
        return null; // null means all themes are available
    }

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();
        
        static::updating(function ($user) {
            // Check if status is being changed from inactive to active
            if ($user->isDirty('status') && $user->status === 'active' && $user->getOriginal('status') !== 'active') {
                if ($user->type !== 'company' && $user->current_store) {
                    $store = Store::find($user->current_store);
                    $companyUser = $store?->user;
                    if ($companyUser?->plan) {
                        $canActivate = \App\Http\Middleware\CheckPlanAccess::canActivateResource(
                            $companyUser, 'user', $user->current_store, $user->id
                        );
                        if (!$canActivate) {
                            // Set status back to inactive instead of throwing exception
                            $user->status = 'inactive';
                            \Log::warning('User activation blocked due to plan limit', ['user_id' => $user->id]);
                        }
                    }
                }
            }
        });
        
        static::updated(function ($user) {
            try {
                // Enforce plan limitations after user is activated
                if ($user->status === 'active' && $user->wasChanged('status') && $user->type !== 'company') {
                    if ($user->current_store) {
                        $store = Store::find($user->current_store);
                        $companyUser = $store ? $store->user : null;
                        if ($companyUser) {
                            enforcePlanLimitations($companyUser->fresh());
                        }
                    }
                }
                
                // Handle plan changes
                if ($user->wasChanged('plan_id') && $user->type === 'company') {
                    $oldPlan = $user->getOriginal('plan_id') ? Plan::find($user->getOriginal('plan_id')) : null;
                    $newPlan = $user->plan;
                    
                    if ($oldPlan && $newPlan && isPlanUpgrade($oldPlan, $newPlan)) {
                        reactivateResources($user);
                    }
                    
                    if ($newPlan) {
                        enforcePlanLimitations($user);
                    }
                }
            } catch (\Exception $e) {
                \Log::error('User updated event failed: ' . $e->getMessage(), ['user_id' => $user->id]);
            }
        });
        
        static::creating(function ($user) {
            if ($user->type === 'company' && !$user->referral_code) {
                // Generate referral code after the user is saved to get the ID
                static::created(function ($createdUser) {
                    if (!$createdUser->referral_code) {
                        $createdUser->referral_code = 'REF' . str_pad($createdUser->id, 6, '0', STR_PAD_LEFT);
                        $createdUser->save();
                    }
                });
            }
        });
        
        static::created(function ($user) {
            // Assign default plan to company users if no default plan exists
            if ($user->type === 'company' && !$user->plan_id) {
                $defaultPlan = Plan::getDefaultPlan();
                if ($defaultPlan) {
                    $user->plan_id = $defaultPlan->id;
                    $user->plan_is_active = 1;
                    $user->save();
                }
            }
        });
    }
}