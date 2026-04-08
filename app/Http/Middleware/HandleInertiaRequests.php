<?php
namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\Currency;
use App\Models\Setting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        
        // Skip database queries during installation
        if ($request->is('install*') || $request->is('update*') || $request->is('installer*') || !file_exists(storage_path('installed'))) {
            $globalSettings = [
                'currencySymbol' => '$',
                'currencyNname' => 'US Dollar',
                'base_url' => config('app.url')
            ];
            $storeCurrency = [
                'code' => 'USD',
                'symbol' => '$',
                'name' => 'US Dollar',
                'position' => 'before',
                'decimals' => 2,
                'decimal_separator' => '.',
                'thousands_separator' => ','
            ];
        } else {
            // Get system settings (will use superadmin for unauthenticated users)
            $settings = settings();
            // Get currency symbol
            $currencyCode = $settings['defaultCurrency'] ?? 'USD';
            $currency = Currency::where('code', $currencyCode)->first();
            $currencySettings = [];
            if ($currency) {
                $currencySettings = [
                    'currencySymbol' => $currency->symbol, 
                    'currencyNname' => $currency->name
                ];
            } else {
                $currencySettings = [
                    'currencySymbol' =>  '$', 
                    'currencyNname' =>'US Dollar'
                ];
            }
            
            // Merge currency settings with other settings
            $globalSettings = array_merge($settings, $currencySettings);
            $globalSettings['base_url'] = config('app.url');
            
            // SECURITY FIX: Remove sensitive keys before passing to frontend
            $sensitiveKeys = [
                'chatgptKey', 'chatgptModel',
                'email_password', 'email_host', 'email_port',
                'email_username', 'email_encryption', 'email_driver', 'email_provider',
                'recaptchaSecretKey',
                'aws_access_key_id', 'aws_secret_access_key', 'aws_bucket', 'aws_endpoint', 'aws_url',
                'wasabi_access_key', 'wasabi_secret_key', 'wasabi_bucket', 'wasabi_region', 'wasabi_root', 'wasabi_url',
            ];
            foreach ($sensitiveKeys as $key) {
                unset($globalSettings[$key]);
            }
            
            
            // Get store-specific currency settings for authenticated users
            $storeCurrency = $this->getStoreCurrencySettings($request);
        }
        
        return [
             ...parent::share($request),
            'name'  => config('app.name'),
            'base_url'  => config('app.url'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'csrf_token' => csrf_token(),
            'auth'  => function() use ($request) {
                $user = $request->user() ? $request->user()->load('stores', 'plan') : null;
                
                // Get stores for the current user
                $stores = [];
                if ($user) {
                    if ($user->type === 'company') {
                        // Company users have their own stores
                        $stores = $user->stores;
                    } elseif ($user->type === 'user' && $user->created_by) {
                        // Regular users access their creator's stores
                        $creator = \App\Models\User::find($user->created_by);
                        if ($creator) {
                            $stores = $creator->stores;
                        }
                    }
                }
                
                // Check if demo mode is enabled and there's a demo store cookie
                if ($user && config('app.is_demo') && $request->cookie('demo_store_id')) {
                    $storeId = (int) $request->cookie('demo_store_id');
                    
                    // Verify the store belongs to the user or their creator
                    $storeExists = false;
                    if ($user->type === 'company') {
                        $storeExists = $user->stores->contains('id', $storeId);
                    } elseif ($user->type === 'user' && $user->created_by) {
                        $creator = \App\Models\User::find($user->created_by);
                        if ($creator) {
                            $storeExists = $creator->stores->contains('id', $storeId);
                        }
                    }
                    
                    if ($storeExists) {
                        // In demo mode, override current_store with cookie value for this request only
                        $user->current_store = $storeId;
                    }
                }
                
                // In demo mode, check cookie for temporary language preference
                if (config('app.is_demo', false) && $request->cookie('demo_language')) {
                    $locale = $request->cookie('demo_language');
                } else {
                    $locale = $user ? ($user->lang ?? 'ar') : 'ar';
                }
                
                // Trial data
                $trialData = ['is_trial' => false, 'days_left' => 0, 'expire_date' => null];
                if ($user && in_array($user->is_trial, ['yes', '1'], true) && $user->trial_expire_date) {
                    $daysLeft = now()->diffInDays(\Carbon\Carbon::parse($user->trial_expire_date), false);
                    $trialData = [
                        'is_trial' => true,
                        'days_left' => max(0, (int)$daysLeft),
                        'expire_date' => $user->trial_expire_date,
                        'plan_name' => $user->plan ? $user->plan->name : 'Pro',
                    ];
                }
                
                // Suspension/Grace period data
                $suspensionData = [
                    'store_suspended' => false,
                    'store_archived' => false,
                    'grace_days_left' => 0,
                    'exceeded_limits' => [],
                ];
                if ($user && ($user->store_suspended || $user->store_archived)) {
                    $graceDaysLeft = 3;
                    if ($user->grace_period_start) {
                        $graceDaysLeft = max(0, 3 - (int)now()->diffInDays(\Carbon\Carbon::parse($user->grace_period_start)));
                    }
                    $limitsCheck = function_exists('checkExceedsFreePlanLimits') ? checkExceedsFreePlanLimits($user) : ['exceeds' => false, 'details' => []];
                    $suspensionData = [
                        'store_suspended' => (bool)$user->store_suspended,
                        'store_archived' => (bool)$user->store_archived,
                        'grace_days_left' => $graceDaysLeft,
                        'exceeded_limits' => $limitsCheck['details'] ?? [],
                    ];
                }

                return [
                    'user'        => $user,
                    'roles'       => $request->user()?->roles->pluck('name'),
                    'permissions' => $request->user()?->getAllPermissions()->pluck('name'),
                    'lang' => $locale,
                    'stores' => $stores,
                    'trial' => $trialData,
                    'suspension' => $suspensionData,
                    'email_verified' => $user ? $user->hasVerifiedEmail() : false,
                    'email_verification_enabled' => (bool) getSetting('emailVerification', false),
                ];
            },
            'stores' => function() use ($request) {
                $user = $request->user();
                if (!$user) return [];
                
                $stores = [];
                if ($user->type === 'company') {
                    $stores = $user->stores;
                } elseif ($user->type === 'user' && $user->created_by) {
                    $creator = \App\Models\User::find($user->created_by);
                    $stores = $creator ? $creator->stores : [];
                }
                
                // In demo mode, ensure current_store reflects the cookie value
                if (config('app.is_demo') && $request->cookie('demo_store_id')) {
                    $storeId = (int) $request->cookie('demo_store_id');
                    $storeExists = collect($stores)->contains('id', $storeId);
                    if ($storeExists && $user) {
                        $user->current_store = $storeId;
                    }
                }
                
                return $stores;
            },
            'isImpersonating' => session('impersonated_by') ? true : false,
            'ziggy' => fn(): array=> [
                 ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
                'importErrors' => $request->session()->get('importErrors'),
                'importSuccess' => $request->session()->get('importSuccess'),
            ],
            'globalSettings' => $globalSettings,
            'superadminSettings' => settings(getSuperadminId()),
            'storeCurrency' => $storeCurrency,
            'is_demo' => config('app.is_demo', false),
        ];
    }
    
    /**
     * Get store-specific currency settings for the current user
     */
    private function getStoreCurrencySettings(Request $request): array
    {
        $user = $request->user();
        
        // Default currency settings
        $defaultCurrency = [
            'code' => 'USD',
            'symbol' => '$',
            'name' => 'US Dollar',
            'position' => 'before',
            'decimals' => 2,
            'decimal_separator' => '.',
            'thousands_separator' => ','
        ];
        
        // Return default if no user
        if (!$user) {
            return $defaultCurrency;
        }
        
        // Handle demo mode cookie override first
        if (config('app.is_demo') && $request->cookie('demo_store_id')) {
            $storeId = (int) $request->cookie('demo_store_id');
            
            // Verify the store belongs to the user or their creator
            $storeExists = false;
            if ($user->type === 'company') {
                $storeExists = $user->stores->contains('id', $storeId);
            } elseif ($user->type === 'user' && $user->created_by) {
                $creator = \App\Models\User::find($user->created_by);
                if ($creator) {
                    $storeExists = $creator->stores->contains('id', $storeId);
                }
            }
            
            if ($storeExists) {
                $currentStoreId = $storeId;
            } else {
                $currentStoreId = $user->current_store;
            }
        } else {
            $currentStoreId = $user->current_store;
        }
        
        if (!$currentStoreId) {
            return $defaultCurrency;
        }
        
        try {
            // Get store-specific currency settings
            $storeSettings = Setting::getUserSettings($user->id, $currentStoreId);
            
            // Get currency code from store settings or fall back to global settings
            $currencyCode = $storeSettings['defaultCurrency'] ?? settings($user->id)['defaultCurrency'] ?? 'USD';
            
            // Get currency details from currencies table
            $currency = Currency::where('code', $currencyCode)->first();
            
            if ($currency) {
                return [
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                    'name' => $currency->name,
                    'position' => $storeSettings['currencySymbolPosition'] ?? 'before',
                    'decimals' => (int)($storeSettings['decimalFormat'] ?? 2),
                    'decimal_separator' => $storeSettings['decimalSeparator'] ?? '.',
                    'thousands_separator' => $storeSettings['thousandsSeparator'] ?? ','
                ];
            }
            
            return $defaultCurrency;
        } catch (\Exception $e) {
            // Return default currency if any error occurs
            return $defaultCurrency;
        }
    }
}