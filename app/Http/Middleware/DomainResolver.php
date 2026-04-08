<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\StoreConfiguration;
use App\Models\Setting;
use App\Models\Currency;
use App\Models\User;
use Inertia\Inertia;

class DomainResolver
{
    /**
     * The base domain for the platform (without www or protocol)
     */
    private function getBaseDomain(): string
    {
        $mainAppDomain = str_replace(['http://', 'https://'], '', config('app.url'));
        $mainAppDomain = rtrim($mainAppDomain, '/');
        // Remove 'www.' prefix if present
        if (str_starts_with($mainAppDomain, 'www.')) {
            $mainAppDomain = substr($mainAppDomain, 4);
        }
        // Remove subdomain prefix (e.g., 'ns.' from 'ns.urdun-tech.com') to get base domain
        $parts = explode('.', $mainAppDomain);
        if (count($parts) > 2) {
            return implode('.', array_slice($parts, -2));
        }
        return $mainAppDomain;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Skip during installation and admin routes
        if ($request->is('install/*') || $request->is('update/*') || !file_exists(storage_path('installed'))) {
            return $next($request);
        }
        
        $isStorePath = $request->is('store/*');
        $isStoresPath = $request->is('stores/*');
        
        // Skip for admin/dashboard routes
        if ($request->is('dashboard*') || $request->is('admin*') || $request->is('login') || $request->is('register') || $request->is('password*') || $isStoresPath) {
            return $next($request);
        }
        
        $host = $request->getHost();
        $cleanHost = str_replace(['http://', 'https://'], '', $host);
        $cleanHost = rtrim($cleanHost, '/');

        // CRITICAL: Prevent main app domain from being used as custom domain
        $mainAppDomain = str_replace(['http://', 'https://'], '', config('app.url'));
        $mainAppDomain = rtrim($mainAppDomain, '/');
        
        $mainAppDomainWithoutWww = str_starts_with($mainAppDomain, 'www.') ? substr($mainAppDomain, 4) : $mainAppDomain;
        $mainAppDomainWithWww = 'www.' . $mainAppDomainWithoutWww;
        
        // If current host matches main app domain, skip domain resolution
        if ($cleanHost === $mainAppDomain || 
            $cleanHost === $mainAppDomainWithoutWww || 
            $cleanHost === $mainAppDomainWithWww) {
            return $next($request);
        }
        
        $store = null;
        $baseDomain = $this->getBaseDomain();
        
        // Check for custom domain first (only for paid plans)
        $store = Store::where('custom_domain', $host)
                    ->where('enable_custom_domain', true)
                    ->first();
        
        // Check store status via configuration
        if ($store) {
            $config = StoreConfiguration::getConfiguration($store->id);
            if (!($config['store_status'] ?? true)) {
                $store = null;
            }
        }
        
        // Check for custom subdomain if no custom domain found
        if (!$store && str_contains($host, '.')) {
            $parts = explode('.', $host);
            $subdomain = $parts[0];
            $isFreeDomain = false;
            
            // Detect if this is a *.free.basedomain pattern
            // e.g. ayman1.free.urdun-tech.com -> parts = [ayman1, free, urdun-tech, com]
            if (count($parts) >= 4 && $parts[1] === 'free') {
                $subdomain = $parts[0];
                $isFreeDomain = true;
            }
            // Detect if this is a *.basedomain pattern (paid subdomain)
            // e.g. ayman1.urdun-tech.com -> parts = [ayman1, urdun-tech, com]
            // But NOT ns.urdun-tech.com (main app domain - already handled above)
            
            $store = Store::where('custom_subdomain', $subdomain)
                        ->where('enable_custom_subdomain', true)
                        ->first();
            
            // Check store status via configuration
            if ($store) {
                $config = StoreConfiguration::getConfiguration($store->id);
                if (!($config['store_status'] ?? true)) {
                    $store = null;
                }
            }
            
            // Enforce plan-based subdomain rules
            if ($store) {
                $owner = User::find($store->user_id);
                $plan = $owner ? $owner->plan : null;
                $planName = is_array($plan) ? ($plan['name'] ?? 'Free') : (is_object($plan) ? ($plan->name ?? 'Free') : 'Free');
                $isFreeUser = (strtolower($planName) === 'free');
                
                if ($isFreeUser && !$isFreeDomain) {
                    // Free user trying to access via paid subdomain pattern (*.urdun-tech.com)
                    // Redirect them to the free subdomain (*.free.urdun-tech.com)
                    $freeUrl = $request->getScheme() . '://' . $subdomain . '.free.' . $baseDomain;
                    $path = trim($request->getPathInfo(), '/');
                    if ($path) {
                        $freeUrl .= '/' . $path;
                    }
                    $queryString = $request->getQueryString();
                    if ($queryString) {
                        $freeUrl .= '?' . $queryString;
                    }
                    return redirect()->to($freeUrl, 301);
                }
                
                if (!$isFreeUser && $isFreeDomain) {
                    // Paid user trying to access via free subdomain pattern (*.free.urdun-tech.com)
                    // Redirect them to the paid subdomain (*.urdun-tech.com)
                    $paidUrl = $request->getScheme() . '://' . $subdomain . '.' . $baseDomain;
                    $path = trim($request->getPathInfo(), '/');
                    if ($path) {
                        $paidUrl .= '/' . $path;
                    }
                    $queryString = $request->getQueryString();
                    if ($queryString) {
                        $paidUrl .= '?' . $queryString;
                    }
                    return redirect()->to($paidUrl, 301);
                }
            }
        }
        
        if ($store) {
            // Set store context for the request
            $request->attributes->set('resolved_store', $store);
            $request->attributes->set('store_theme', $store->theme);
            
            // If it's a "store/{slug}" path but we are on a custom domain, redirect to clean path
            if ($isStorePath && $request->segment(2) === $store->slug && $request->isMethod('get')) {
                $path = $request->path();
                $prefix = 'store/' . $store->slug;
                $cleanPath = trim(str_replace($prefix, '', $path), '/');
                $queryString = $request->getQueryString();
                return redirect()->to('/' . $cleanPath . ($queryString ? '?' . $queryString : ''));
            }
            
            // For API requests, add store_id to request
            if ($request->is('api/*')) {
                $request->merge(['store_id' => $store->id]);
                return $next($request);
            }
            
            // Handle direct domain/subdomain access (clean URLs)
            if (!$isStorePath) {
                // Check if store is active and not in maintenance
                $config = StoreConfiguration::getConfiguration($store->id);
                
                if (!($config['store_status'] ?? true)) {
                    $reason = ($config['plan_disabled'] ?? false) ? 'Plan limit exceeded' : 'Store disabled by owner';
                    return Inertia::render('store/StoreDisabled', [
                        'store' => $store->only(['id', 'name', 'slug']),
                        'reason' => $reason
                    ])->toResponse($request)->setStatusCode(503);
                }
                
                if ($config['maintenance_mode'] ?? false) {
                    return Inertia::render('store/StoreMaintenance', [
                        'store' => $store->only(['id', 'name', 'slug'])
                    ])->toResponse($request)->setStatusCode(503);
                }
                
                // Share Inertia data that HandleInertiaRequests would normally provide
                $this->shareInertiaData($request);
                
                // Route the request to appropriate store controller method
                return $this->handleStoreRequest($request, $store);
            }
        }
        
        return $next($request);
    }
    
    /**
     * Share Inertia data that HandleInertiaRequests middleware would normally provide.
     * This ensures globalSettings, auth, ziggy, etc. are available for subdomain store pages.
     */
    private function shareInertiaData(Request $request): void
    {
        try {
            $superadminId = $this->getSuperadminId();
            $settings = $superadminId ? settings($superadminId) : [];
            
            $currencySettings = [];
            if ($superadminId) {
                $defaultCurrency = $settings['defaultCurrency'] ?? 'USD';
                $currency = Currency::where('code', $defaultCurrency)->first();
                if ($currency) {
                    $currencySettings = [
                        'currencyCode' => $currency->code,
                        'currencySymbol' => $currency->symbol,
                        'currencyName' => $currency->name,
                        'currencySymbolPosition' => $settings['currencySymbolPosition'] ?? 'before',
                        'decimalFormat' => $settings['decimalFormat'] ?? '2',
                        'decimalSeparator' => $settings['decimalSeparator'] ?? '.',
                        'thousandsSeparator' => $settings['thousandsSeparator'] ?? ',',
                    ];
                }
            }
            
            $globalSettings = array_merge($settings, $currencySettings);
            $globalSettings['base_url'] = config('app.url');
            
            $sensitiveKeys = [
                'stripeKey', 'stripeSecret', 'paypalClientId', 'paypalSecret',
                'razorpayKey', 'razorpaySecret', 'paystackPublicKey', 'paystackSecretKey',
                'openaiApiKey', 'resendApiKey', 'smtpPassword',
                'xenditSecretKey', 'toyyibpaySecretKey', 'cashfreeSecretKey',
                'flutterwaveSecretKey', 'flutterwaveEncryptionKey',
                'paytabsServerKey', 'mercadopagoAccessToken',
            ];
            foreach ($sensitiveKeys as $key) {
                unset($globalSettings[$key]);
            }
            
            $storeCurrency = [
                'code' => 'USD', 'symbol' => '$', 'name' => 'US Dollar',
                'position' => 'before', 'decimals' => 2,
                'decimal_separator' => '.', 'thousands_separator' => ','
            ];
            
            Inertia::share([
                'auth' => ['user' => $request->user()],
                'globalSettings' => $globalSettings,
                'superadminSettings' => $superadminId ? settings($superadminId) : [],
                'storeCurrency' => $storeCurrency,
                'is_demo' => config('app.is_demo', false),
                'ziggy' => [
                    'url' => $request->schemeAndHttpHost(),
                    'port' => null, 'defaults' => [], 'routes' => [],
                    'location' => $request->url(),
                ],
                'flash' => [
                    'success' => $request->session()->get('success'),
                    'error' => $request->session()->get('error'),
                    'importErrors' => $request->session()->get('importErrors'),
                    'importSuccess' => $request->session()->get('importSuccess'),
                ],
                'stores' => [],
                'isImpersonating' => false,
            ]);
        } catch (\Exception $e) {
            \Log::warning('DomainResolver: Failed to share Inertia data: ' . $e->getMessage());
            Inertia::share([
                'auth' => ['user' => null],
                'globalSettings' => ['base_url' => config('app.url')],
                'storeCurrency' => [
                    'code' => 'USD', 'symbol' => '$', 'name' => 'US Dollar',
                    'position' => 'before', 'decimals' => 2,
                    'decimal_separator' => '.', 'thousands_separator' => ','
                ],
                'is_demo' => false,
                'ziggy' => [
                    'url' => $request->schemeAndHttpHost(),
                    'port' => null, 'defaults' => [], 'routes' => [],
                    'location' => $request->url(),
                ],
                'flash' => ['success' => null, 'error' => null, 'importErrors' => null, 'importSuccess' => null],
                'stores' => [],
                'isImpersonating' => false,
            ]);
        }
    }
    
    /**
     * Get the superadmin user ID
     */
    private function getSuperadminId(): ?int
    {
        if (function_exists('getSuperadminId')) {
            return getSuperadminId();
        }
        
        $admin = \App\Models\User::where('type', 'company')
            ->orderBy('id')
            ->first();
        
        return $admin ? $admin->id : null;
    }
    
    /**
     * Handle store request based on path
     */
    private function handleStoreRequest(Request $request, Store $store)
    {
        $path = trim($request->getPathInfo(), '/');
        $segments = explode('/', $path);
        
        if (empty($path)) {
            return app(\App\Http\Controllers\ThemeController::class)->home($store->slug, $request);
        }

        if ($segments[0] === 'products') {
            return app(\App\Http\Controllers\ThemeController::class)->products($store->slug, $request);
        } elseif ($segments[0] === 'product' && isset($segments[1])) {
            return app(\App\Http\Controllers\ThemeController::class)->product($store->slug, $segments[1]);
        } elseif ($segments[0] === 'category' && isset($segments[1])) {
            return app(\App\Http\Controllers\ThemeController::class)->category($store->slug, $segments[1]);
        } elseif ($segments[0] === 'cart') {
            $request->merge(['action' => 'cart']);
            return app(\App\Http\Controllers\ThemeController::class)->home($store->slug, $request);
        } elseif ($segments[0] === 'wishlist') {
            $request->merge(['action' => 'wishlist']);
            return app(\App\Http\Controllers\ThemeController::class)->home($store->slug, $request);
        } elseif ($segments[0] === 'checkout') {
            $request->merge(['action' => 'checkout']);
            return app(\App\Http\Controllers\ThemeController::class)->home($store->slug, $request);
        } elseif ($segments[0] === 'manifest.json') {
            return app(\App\Http\Controllers\PWAController::class)->manifest($store->slug);
        } elseif ($segments[0] === 'service-worker') {
            return app(\App\Http\Controllers\PWAController::class)->serviceWorker($store->slug);
        } elseif ($segments[0] === 'login') {
            if ($request->isMethod('get')) {
                $request->merge(['action' => 'login']);
                return app(\App\Http\Controllers\ThemeController::class)->home($store->slug, $request);
            }
            return app(\App\Http\Controllers\Store\AuthController::class)->login($request, $store->slug);
        } elseif ($segments[0] === 'register') {
            if ($request->isMethod('get')) {
                $request->merge(['action' => 'register']);
                return app(\App\Http\Controllers\ThemeController::class)->home($store->slug, $request);
            }
            return app(\App\Http\Controllers\Store\AuthController::class)->register($request, $store->slug);
        } elseif ($segments[0] === 'logout') {
            return app(\App\Http\Controllers\Store\AuthController::class)->logout($request, $store->slug);
        } elseif ($segments[0] === 'forgot-password') {
            if ($request->isMethod('get')) {
                $request->merge(['action' => 'forgot-password']);
                return app(\App\Http\Controllers\ThemeController::class)->home($store->slug, $request);
            }
            return app(\App\Http\Controllers\Store\AuthController::class)->forgotPassword($request, $store->slug);
        } elseif ($segments[0] === 'reset-password') {
            if (isset($segments[1])) {
                return app(\App\Http\Controllers\Store\AuthController::class)->showResetForm($store->slug, $segments[1]);
            } else {
                return app(\App\Http\Controllers\Store\AuthController::class)->resetPassword($request, $store->slug);
            }
        } elseif ($segments[0] === 'profile') {
            if (isset($segments[1]) && $segments[1] === 'update') {
                return app(\App\Http\Controllers\Store\ProfileController::class)->updateProfile($request, $store->slug);
            } elseif (isset($segments[1]) && $segments[1] === 'password') {
                return app(\App\Http\Controllers\Store\ProfileController::class)->updatePassword($request, $store->slug);
            }
            $request->merge(['action' => 'profile']);
            return app(\App\Http\Controllers\ThemeController::class)->home($store->slug, $request);
        } elseif ($segments[0] === 'order') {
            if (isset($segments[1]) && $segments[1] === 'place') {
                return app(\App\Http\Controllers\Store\OrderController::class)->placeOrder($request, $store->slug);
            } elseif (isset($segments[1])) {
                if (isset($segments[2]) && $segments[2] === 'pdf') {
                    return app(\App\Http\Controllers\ThemeController::class)->downloadOrderPdf($store->slug, $segments[1]);
                }
                $request->merge(['action' => 'order', 'order_number' => $segments[1]]);
                return app(\App\Http\Controllers\ThemeController::class)->home($store->slug, $request);
            }
        } elseif ($segments[0] === 'razorpay' && isset($segments[1]) && $segments[1] === 'verify-payment') {
            return app(\App\Http\Controllers\Store\RazorpayController::class)->verifyPayment($request, $store->slug);
        } elseif ($segments[0] === 'my-orders') {
            $request->merge(['action' => 'orders']);
            return app(\App\Http\Controllers\ThemeController::class)->home($store->slug, $request);
        } elseif ($segments[0] === 'my-profile') {
            $request->merge(['action' => 'profile']);
            return app(\App\Http\Controllers\ThemeController::class)->home($store->slug, $request);
        } elseif ($segments[0] === 'order-confirmation') {
            $orderNumber = $segments[1] ?? null;
            return app(\App\Http\Controllers\ThemeController::class)->orderConfirmation($store->slug, $orderNumber);
        } elseif ($segments[0] === 'translations' && isset($segments[1])) {
            return app(\App\Http\Controllers\TranslationController::class)->getTranslations($segments[1]);
        } elseif ($segments[0] === 'stripe' && isset($segments[1]) && $segments[1] === 'success' && isset($segments[2])) {
            return app(\App\Http\Controllers\Store\StripeController::class)->success($request, $store->slug, $segments[2]);
        } elseif ($segments[0] === 'paypal' && isset($segments[1]) && $segments[1] === 'success' && isset($segments[2])) {
            return app(\App\Http\Controllers\Store\PayPalController::class)->success($request, $store->slug, $segments[2]);
        } else {
            return app(\App\Http\Controllers\ThemeController::class)->home($store->slug, $request);
        }
    }
}
