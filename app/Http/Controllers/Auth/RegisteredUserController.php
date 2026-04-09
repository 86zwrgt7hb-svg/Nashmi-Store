<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Plan;
use App\Models\Referral;
use App\Models\ReferralSetting;
use App\Services\UserService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Setting;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(Request $request): Response
    {
        $referralCode = $request->get('ref');
        $encryptedPlanId = $request->get('plan');
        $planId = null;
        $referrer = null;
        
        // Decrypt and validate plan ID
        if ($encryptedPlanId) {
            $planId = $this->decryptPlanId($encryptedPlanId);
            if ($planId && !Plan::find($planId)) {
                $planId = null; // Invalid plan ID
            }
        }
        
        if ($referralCode) {
            $referrer = User::where('referral_code', $referralCode)
                ->where('type', 'company')
                ->first();
        }
        
        return Inertia::render('auth/register', [
            'referralCode' => $referralCode,
            'planId' => $planId,
            'referrer' => $referrer ? $referrer->name : null,
            'settings' => settings(),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];
        
        $recaptchaEnabled = Setting::where('key', 'recaptchaEnabled')->value('value');
        if ($recaptchaEnabled === 'true' || $recaptchaEnabled === true || $recaptchaEnabled === 1 || $recaptchaEnabled === '1') {
            $rules['recaptcha_token'] = 'required|string';
        }
        
        $validated = $request->validate($rules);
        
        // Validate reCAPTCHA if enabled
        if ($recaptchaEnabled === 'true' || $recaptchaEnabled === true || $recaptchaEnabled === 1 || $recaptchaEnabled === '1') {
            $token = $request->input('recaptcha_token');
            $secretKey = Setting::where('key', 'recaptchaSecretKey')->value('value');
            
            if (!empty($token) && !empty($secretKey)) {
                $response = \Illuminate\Support\Facades\Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret' => $secretKey,
                    'response' => $token,
                    'remoteip' => $request->ip(),
                ]);
                
                $result = $response->json();
                if (!$result['success']) {
                    return back()->withErrors(['recaptcha_token' => 'reCAPTCHA verification failed. Please try again.'])->withInput();
                }
            }
        }

        // Get the lifetime plan for trial assignment
        $lifetimePlan = Plan::getLifetimePlan() ?? Plan::getDefaultPlan();

        // Check if this email already used a trial (one trial per email, ever)
        $alreadyTrialed = \Illuminate\Support\Facades\DB::table('trial_emails')
            ->where('email', strtolower($request->email))
            ->exists();

        if ($alreadyTrialed) {
            // No trial — account created but store is frozen until payment
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'type' => 'company',
                'is_active' => 1,
                'is_enable_login' => 1,
                'created_by' => 0,
                'plan_is_active' => 0,
                'plan_id' => $lifetimePlan ? $lifetimePlan->id : null,
                'is_trial' => 'no',
                'trial_day' => 0,
                'trial_expire_date' => null,
                'trial_used' => true,
                'is_lifetime' => false,
                'plan_expire_date' => null,
            ];
        } else {
            // Fresh trial — 7 days free
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'type' => 'company',
                'is_active' => 1,
                'is_enable_login' => 1,
                'created_by' => 0,
                'plan_is_active' => 1,
                'plan_id' => $lifetimePlan ? $lifetimePlan->id : null,
                'is_trial' => 'yes',
                'trial_day' => 7,
                'trial_expire_date' => now()->addDays(7),
                'trial_used' => false,
                'is_lifetime' => false,
                'plan_expire_date' => now()->addDays(7),
            ];
        }
        
        // Handle referral code
        if ($request->referral_code) {
            $referrer = User::where('referral_code', $request->referral_code)
                ->where('type', 'company')
                ->first();
            
            if ($referrer) {
                $userData['used_referral_code'] = $request->referral_code;
            }
        }
        
        $user = User::create($userData);

        // Record this email in trial_emails (so it can never get a trial again)
        if (!$alreadyTrialed) {
            \Illuminate\Support\Facades\DB::table('trial_emails')->insertOrIgnore([
                'email' => strtolower($request->email),
                'trial_started_at' => now(),
                'trial_expired_at' => now()->addDays(7),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Assign role and settings to the user
        defaultRoleAndSetting($user);
        
        // Create referral record when user purchases a plan
        if ($user->used_referral_code && $user->plan_id) {
            $this->createReferralRecord($user);
        }

        Auth::login($user);
        
        // Check if email verification is enabled
        $emailVerificationEnabled = getSetting('emailVerification', false);
        if ($emailVerificationEnabled) {
            try {
                // Send verification email
                $user->sendEmailVerificationNotification();
                return redirect()->route('verification.notice');
            } catch (\Exception $e) {
                \Log::error('Email verification failed during registration: ' . $e->getMessage());

                // User is created & logged in — just skip the email requirement
                // and show a friendly admin-facing error
                $planId = $request->plan_id;
                if ($planId) {
                    return redirect()
                        ->route('plans.index', ['selected' => $planId])
                        ->with('error', __('Your account was created, but the verification email could not be sent. Please contact the administrator to configure SMTP email settings.'));
                }
                return to_route('dashboard')
                    ->with('error', __('Your account was created, but the verification email could not be sent. Please contact the administrator to configure SMTP email settings.'));
            }
        }

        // Redirect to plans page with selected plan
        $planId = $request->plan_id;
        if ($planId) {
            return redirect()->route('plans.index', ['selected' => $planId]);
        }
        return to_route('dashboard');
    }
    
    /**
     * Decrypt plan ID from encrypted string
     */
    private function decryptPlanId($encryptedPlanId)
    {
        try {
            $key = 'WhatsStore2024';
            $encrypted = base64_decode($encryptedPlanId);
            $decrypted = '';
            
            for ($i = 0; $i < strlen($encrypted); $i++) {
                $decrypted .= chr(ord($encrypted[$i]) ^ ord($key[$i % strlen($key)]));
            }
            
            return is_numeric($decrypted) ? (int)$decrypted : null;
        } catch (\Exception $e) {
            return null;
        }
    }
    
    /**
     * Create referral record when user purchases a plan
     */
    private function createReferralRecord(User $user)
    {
        $settings = ReferralSetting::current();
        
        if (!$settings->is_enabled) {
            return;
        }
        
        $referrer = User::where('referral_code', $user->used_referral_code)->first();
        if (!$referrer || !$user->plan) {
            return;
        }
        
        // Calculate commission based on plan price
        $planPrice = $user->plan->price ?? 0;
        $commissionAmount = ($planPrice * $settings->commission_percentage) / 100;
        
        if ($commissionAmount > 0) {
            Referral::create([
                'user_id' => $user->id,
                'company_id' => $referrer->id,
                'commission_percentage' => $settings->commission_percentage,
                'amount' => $commissionAmount,
                'plan_id' => $user->plan_id,
            ]);
        }
    }
}
