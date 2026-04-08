<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Store;
use App\Models\User;
use App\Models\CartItem;
use App\Models\Shipping;
use App\Models\Order;
use App\Models\StoreSetting;
use App\Models\StoreConfiguration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\CartCalculationService;
use Barryvdh\DomPDF\Facade\Pdf;

class ThemeController extends Controller
{
    /**
     * Get the store based on slug or resolved from domain
     */
    protected function getStore($storeSlug, ?Request $request = null)
    {
        // Priority 1: Check if store was resolved by domain middleware
        if ($request && $request->attributes->has('resolved_store')) {
            $store = $request->attributes->get('resolved_store');
            return $this->formatStoreData($store);
        }
        
        // Priority 2: Try to find the store in the database by slug
        $store = Store::where('slug', $storeSlug)->first();
        
        if ($store) {
            return $this->formatStoreData($store);
        }
        
        // Priority 3: Fallback for demo - return a default store with the actual slug
        return [
            'id' => 1, // Default store ID
            'name' => 'Demo Store',
            'email' => 'demo@example.com',
            'logo' => '/storage/media/logo.png',
            'description' => 'Demo store description',
            'theme' => 'gadgets',
            'slug' => $storeSlug
        ];
    }
    

    
    /**
     * Format store data consistently
     */
    private function formatStoreData($store)
    {
        if (!$store) return null;
        
        $configuration = StoreConfiguration::getConfiguration($store->id);
        
        // Get favicon from store config or company store settings
        $favicon = $configuration['favicon'] ?: '';
        if (empty($favicon) && $store->user) {
            $userSettings = \App\Models\Setting::getUserSettings($store->user->id, $store->id);
            $favicon = $userSettings['favicon'] ?? '';
        }
        
        // Get PWA data
        $pwaData = null;
        if ($store->enable_pwa && $store->user && $store->user->plan && $store->user->plan->pwa_business === 'on') {
            $cacheVersion = time(); // Cache busting
            $pwaData = [
                'enabled' => true,
                'name' => $store->pwa_name ?: $store->name,
                'short_name' => $store->pwa_short_name ?: substr($store->name, 0, 12),
                'description' => $store->pwa_description ?: $store->description,
                'theme_color' => $store->pwa_theme_color ?: '#3B82F6',
                'background_color' => $store->pwa_background_color ?: '#ffffff',
                'manifest_url' => route('store.pwa.manifest', $store->slug) . '?v=' . $cacheVersion,
                'sw_url' => route('store.pwa.sw', $store->slug) . '?v=' . $cacheVersion,
            ];
        }
        
        // Get favicon for PWA popup with proper fallback chain
        $faviconForPWA = getPWAIconUrl($store);
        
        return [
            'id' => $store->id,
            'name' => $store->name,
            'name_ar' => $store->name_ar,
            'email' => $store->email,
            'logo' => $configuration['logo'] ?: '/storage/media/logo.png',
            'favicon' => $faviconForPWA,
            'description' => $store->description,
            'description_ar' => $store->description_ar,
            'theme' => $store->theme,
            'slug' => $store->slug,
            'custom_domain' => $store->custom_domain,
            'custom_subdomain' => $store->custom_subdomain,
            'enable_custom_domain' => $store->enable_custom_domain,
            'enable_custom_subdomain' => $store->enable_custom_subdomain,
            'custom_css' => $configuration['custom_css'] ?: '',
            'custom_javascript' => $configuration['custom_javascript'] ?: '',
            'primary_color' => $configuration['primary_color'] ?: '',
            'secondary_color' => $configuration['secondary_color'] ?: '',
            'accent_color' => $configuration['accent_color'] ?: '',
            'font_family' => $configuration['font_family'] ?: '',
            'heading_font_family' => $configuration['heading_font_family'] ?: '',
            'pwa' => $pwaData,
        ];
    }

    /**
     * Get common data for all store pages
     */
    protected function getCommonData()
    {
        $customer = Auth::guard('customer')->user();
        
        $customerAddresses = [];
        if ($customer) {
            $addresses = \App\Models\CustomerAddress::where('customer_id', $customer->id)->get();
            
            $customerAddresses = $addresses->map(function ($address) {
                return [
                    'id' => $address->id,
                    'type' => $address->type,
                    'address' => $address->address,
                    'city' => $address->city,
                    'state' => $address->state,
                    'country' => $address->country,
                    'postal_code' => $address->postal_code,
                    'is_default' => (bool) $address->is_default,
                ];
            })->toArray();
        }
        
        $commonData = [
            'isLoggedIn' => Auth::guard('customer')->check(),
            'customer' => $customer,
            'customer_address' => $customerAddresses,
        ];
        
        return $commonData;
    }

    /**
     * Get store configuration with settings and currencies
     */
    protected function getStoreConfig($store)
    {
        $storeModel = Store::find($store['id']);
        $storeSettings = [];
        
        if ($storeModel && $storeModel->user) {
            $storeSettings = \App\Models\Setting::getUserSettings($storeModel->user->id, $store['id']);
            $configuration = StoreConfiguration::getConfiguration($store['id']);
            $paymentSettings = \App\Models\PaymentSetting::where("store_id", $store["id"])->pluck("value", "key")->toArray();
        }
        
        return [
            'config' => [
                'storeName' => $store['name'] ?? 'gadgets',
                'logo' => $configuration['logo'] ?? '',
                'favicon' => $configuration['favicon'] ?? '',
                'phoneNumber' => $storeSettings['phone'] ?? '+1-555-123-4567',
                'currency' => $storeSettings['currency_symbol'] ?? '$',
                'address' => $configuration['address'] ?? '',
                'city' => $configuration['city'] ?? '',
                'state' => $configuration['state'] ?? '',
                'country' => $configuration['country'] ?? '',
                'postalCode' => $configuration['postal_code'] ?? '',
                'email' => $store['email'] ?? '',
                'description' => $configuration['store_description'] ? $configuration['store_description'] : ($store['description'] ?? ''),
                'welcomeMessage' => $configuration['welcome_message'] ?? null,
                'copyrightText' => $configuration['copyright_text'] ?? null,
                'socialMedia' => [
                    'facebook' => $configuration['facebook_url'] ?? null,
                    'instagram' => $configuration['instagram_url'] ?? null,
                    'twitter' => $configuration['twitter_url'] ?? null,
                    'youtube' => $configuration['youtube_url'] ?? null,
                    'whatsapp' => $configuration['whatsapp_url'] ?? null,
                    'email' => $configuration['email'] ?? null,
                ],
                // WhatsApp Widget Configuration
                'whatsapp_widget_enabled' => $configuration['whatsapp_widget_enabled'] ?? false,
                'whatsapp_widget_phone' => $configuration['whatsapp_widget_phone'] ?? '',
                'whatsapp_widget_message' => $configuration['whatsapp_widget_message'] ?? 'Hello! I need help with...',
                'whatsapp_widget_position' => $configuration['whatsapp_widget_position'] ?? 'right',
                'whatsapp_widget_show_on_mobile' => $configuration['whatsapp_widget_show_on_mobile'] ?? true,
                'whatsapp_widget_show_on_desktop' => $configuration['whatsapp_widget_show_on_desktop'] ?? true,
                'whatsapp_payment_number' => $paymentSettings['whatsapp_number'] ?? '',
            ],
            'storeSettings' => $storeSettings,
        ];
    }

    /**
     * Display the store homepage.
     */
    public function home($storeSlug, ?Request $request = null)
    {
        $store = $this->getStore($storeSlug, $request);
        // Get store configuration with settings and currencies
        $storeData = $this->getStoreConfig($store);
        
        // Get categories for the store
        $categories = Category::where('store_id', $store['id'])
            ->where('is_active', true)
            ->whereNull('parent_id')
            ->withCount(['products' => function ($query) {
                $query->where('is_active', true);
            }])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => (string) $category->id,
                    'name' => $category->name,
                    'name_ar' => $category->name_ar,
                    'description' => $category->description,
                    'description_ar' => $category->description_ar,
                    'product_count' => $category->products_count,
                ];
            });
        
        // Get products for the store
        $products = Product::where('store_id', $store['id'])
            ->where('is_active', true)
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => (string) $product->id,
                    'name' => $product->name,
                    'name_ar' => $product->name_ar,
                    'price' => $product->sale_price ? (float) $product->sale_price : (float) $product->price,
                    'originalPrice' => $product->sale_price ? (float) $product->price : null,
                    'image' => $product->cover_image ? $product->cover_image : asset('public/images/avatar/avatar.png'),
                    'images' => $product->images ? (is_array($product->images) ? $product->images : (strpos($product->images, ',') !== false ? explode(',', $product->images) : json_decode($product->images, true))) : null,
                    'categoryId' => (string) $product->category_id,
                    'category' => $product->category ? $product->category->name : 'Uncategorized',
                    'availability' => $product->stock > 0 ? 'in_stock' : 'out_of_stock',
                    'sku' => $product->sku ?: 'SKU-' . $product->id,
                    'stockQuantity' => (int) $product->stock,
                    'description' => $product->description,
                    'description_ar' => $product->description_ar,
                    'specifications_ar' => $product->specifications_ar,
                    'details_ar' => $product->details_ar,
                    'variants' => $product->variants ? (is_array($product->variants) ? $product->variants : json_decode($product->variants, true)) : null,
                    'customFields' => $product->custom_fields ? (is_array($product->custom_fields) ? $product->custom_fields : json_decode($product->custom_fields, true)) : null,
                    'taxName' => $product->tax_name ?? null,
                    'taxPercentage' => $product->tax_percentage ?? null,
                ];
            });

        // Get currencies
        $storeModel = Store::find($store['id']);
        $currencies = [];
        if ($storeModel && $storeModel->user) {
            $currencies = \App\Models\Currency::all()->map(function ($currency) {
                return [
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                    'name' => $currency->name
                ];
            })->toArray();
        }

        $theme = $store['theme'] ?? 'gadgets';

        // Get countries for checkout modal
        $countries = \App\Models\Country::active()->orderBy('name')->get()->map(function ($country) {
            return [
                'id' => $country->id,
                'name' => $country->name,
                'code' => $country->code
            ];
        })->toArray();
        
        return Inertia::render('store/' . $theme, array_merge($this->getSharedInertiaData($request), [
            'config' => $storeData['config'],
            'categories' => $categories,
            'products' => $products,
            'store' => $store,
            'theme' => $theme,
            'storeSettings' => $storeData['storeSettings'],
            'currencies' => $currencies,
            'countries' => $countries,
            'storeCurrency' => [
                'code' => $storeData['storeSettings']['currency_code'] ?? 'USD',
                'symbol' => $storeData['storeSettings']['currency_symbol'] ?? '$',
                'name' => $storeData['storeSettings']['currency_name'] ?? 'US Dollar',
                'position' => $storeData['storeSettings']['currency_position'] ?? 'before',
                'decimals' => (int) ($storeData['storeSettings']['currency_decimals'] ?? 2),
                'decimal_separator' => $storeData['storeSettings']['decimal_separator'] ?? '.',
                'thousands_separator' => $storeData['storeSettings']['thousands_separator'] ?? ',',
            ],
            'showResetModal' => $request ? $request->get('showResetModal', false) : false,
            'resetToken' => $request ? $request->get('resetToken') : null,
            'action' => request()->get('action'),
            'payment_status' => session()->pull('payment_status'),
            'order_number' => session()->pull('order_number'),
        ], $this->getCommonData()));
    }

    /**
     * Display the cart page.
     */
    public function cart($storeSlug)
    {
        return redirect()->route('store.home', ['storeSlug' => $storeSlug, 'action' => 'cart']);
    }

    /**
     * Display the my profile page.
     */
    public function myProfile($storeSlug)
    {
        if (Auth::guard('customer')->check()) {
            return redirect()->route('store.home', ['storeSlug' => $storeSlug, 'action' => 'profile']);
        }
        return redirect()->route('store.home', $storeSlug);
    }

    /**
     * Display the my orders page.
     */
    public function myOrders($storeSlug)
    {
        if (Auth::guard('customer')->check()) {
            return redirect()->route('store.home', ['storeSlug' => $storeSlug, 'action' => 'orders']);
        }
        return redirect()->route('store.home', $storeSlug);
    }

    /**
     * Display the product detail page.
     */
    public function product($storeSlug, $id)
    {
        return redirect()->route('store.home', ['storeSlug' => $storeSlug, 'action' => 'product', 'product_id' => $id]);
    }

    /**
     * Display the wishlist page.
     */
    public function wishlist($storeSlug)
    {
        return redirect()->route('store.home', ['storeSlug' => $storeSlug, 'action' => 'wishlist']);
    }



    /**
     * Display all products with filtering, sorting, and pagination.
     */
    public function products($storeSlug, Request $request)
    {
        $store = $this->getStore($storeSlug);
        
        // Get all categories for filters
        $categories = Category::where('store_id', $store['id'])
            ->where('is_active', true)
            ->withCount('products')
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'name_ar' => $category->name_ar,
                    'products_count' => $category->products_count,
                ];
            });
        
        // Build query for products
        $query = Product::where('store_id', $store['id'])
            ->where('is_active', true)
            ->with('category');
        
        // Apply filters
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }
        
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        
        if ($request->filled('availability')) {
            if ($request->availability === 'in_stock') {
                $query->where('stock', '>', 0);
            } elseif ($request->availability === 'out_of_stock') {
                $query->where('stock', '<=', 0);
            }
        }
        
        // Apply sorting
        switch ($request->get('sort', 'popularity')) {
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'price_low_high':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high_low':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                // For now, order by created_at desc as we don't have ratings aggregated
                $query->orderBy('created_at', 'desc');
                break;
            default: // popularity
                $query->orderBy('created_at', 'desc');
                break;
        }
        
        // Pagination
        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);
        
        // Transform products data
        $productsData = $products->getCollection()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                    'name_ar' => $product->name_ar,
                'price' => $product->price,
                'sale_price' => $product->sale_price,
                'cover_image' => $product->cover_image,
                'stock' => $product->stock,
                'is_active' => $product->is_active,
                'variants' => $product->variants,
                'category' => [
                    'id' => $product->category->id ?? null,
                    'name' => $product->category->name ?? 'Uncategorized',
                ],
                'average_rating' => 4.0, // Mock rating for now
                'total_reviews' => rand(5, 50), // Mock review count
            ];
        });
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Get store-specific currency settings
        $storeModel = Store::find($store['id']);
        $storeSettings = [];
        $currencies = [];
        
        if ($storeModel && $storeModel->user) {
            $storeSettings = \App\Models\Setting::getUserSettings($storeModel->user->id, $store['id']);
            $currencies = \App\Models\Currency::all()->map(function ($currency) {
                return [
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                    'name' => $currency->name
                ];
            })->toArray();
        }
        
        return Inertia::render('store/products', array_merge([
            'products' => $productsData,
            'categories' => $categories,
            'brands' => [], // Add brands if needed
            'store' => $store,
            'storeContent' => $storeContent,
            'storeSettings' => $storeSettings,
            'currencies' => $currencies,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'min_price' => $request->min_price,
                'max_price' => $request->max_price,
                'rating' => $request->rating,
                'availability' => $request->availability,
                'sort' => $request->sort,
                'per_page' => $perPage,
            ],
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem() ?: 0,
                'to' => $products->lastItem() ?: 0,
            ],
            'cartCount' => 3,
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }

    /**
     * Display products for a specific category.
     */
    public function category($storeSlug, $slug)
    {
        $store = $this->getStore($storeSlug);
        
        $category = Category::where('store_id', $store['id'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();
            
        $products = Product::where('store_id', $store['id'])
            ->where('category_id', $category->id)
            ->where('is_active', true)
            ->with('category')
            ->latest()
            ->take(12)
            ->get();
            
        
        return Inertia::render('store/category', array_merge([
            'store' => $store,
            'theme' => $store['theme'],
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                    'name_ar' => $category->name_ar,
                'slug' => $category->slug,
                'description' => $category->description,
                    'description_ar' => $category->description_ar,
            ],
            'products' => $products,
            'cartCount' => 3,
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }



    /**
     * Display the order detail page.
     */
    public function orderDetail($storeSlug, $orderNumber)
    {
        if (Auth::guard('customer')->check()) {
            return redirect()->route('store.home', ['storeSlug' => $storeSlug, 'action' => 'order', 'order_number' => $orderNumber]);
        }
        return redirect()->route('store.home', $storeSlug);
    }

    /**
     * Display the order confirmation page.
     */
    public function orderConfirmation($storeSlug, $orderNumber = null)
    {
        $store = $this->getStore($storeSlug);
        
        $order = null;
        if ($orderNumber) {
            $orderData = Order::where('order_number', $orderNumber)
                ->with(['items.product', 'shippingMethod'])
                ->first();
                
            if ($orderData) {
                $order = [
                    'id' => $orderData->order_number,
                    'date' => $orderData->created_at->toISOString(),
                    'status' => ucfirst($orderData->status),
                    'total' => $orderData->total_amount,
                    'subtotal' => $orderData->subtotal,
                    'discount' => $orderData->discount_amount,
                    'shipping' => $orderData->shipping_amount,
                    'tax' => $orderData->tax_amount,
                    'items' => $orderData->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->product_name,
                            'price' => $item->unit_price,
                            'quantity' => $item->quantity,
                            'image' => $item->product->cover_image ?? '/placeholder.jpg',
                        ];
                    })->toArray(),
                    'shipping_address' => [
                        'name' => $orderData->customer_first_name . ' ' . $orderData->customer_last_name,
                        'street' => $orderData->shipping_address,
                        'city' => \App\Models\City::find($orderData->shipping_city)->name ?? $orderData->shipping_city,
                        'state' => \App\Models\State::find($orderData->shipping_state)->name ?? $orderData->shipping_state,
                        'zip' => $orderData->shipping_postal_code,
                        'country' => \App\Models\Country::find($orderData->shipping_country)->name ?? $orderData->shipping_country,
                    ],
                    'billing_address' => [
                        'name' => $orderData->customer_first_name . ' ' . $orderData->customer_last_name,
                        'street' => $orderData->billing_address,
                        'city' => \App\Models\City::find($orderData->billing_city)->name ?? $orderData->billing_city,
                        'state' => \App\Models\State::find($orderData->billing_state)->name ?? $orderData->billing_state,
                        'zip' => $orderData->billing_postal_code,
                        'country' => \App\Models\Country::find($orderData->billing_country)->name ?? $orderData->billing_country,
                    ],
                    'payment_method' => $orderData->payment_method === 'cod' ? 'Cash on Delivery' : ucfirst(str_replace('_', ' ', $orderData->payment_method)),
                    'shipping_method' => $orderData->shippingMethod->name ?? '',
                    'coupon_code' => $orderData->coupon_code,
                ];
            }
        }
        
        // Debug: Always show order data if available
        if (!$order && $orderNumber) {
            $orderData = Order::where('order_number', $orderNumber)->first();
            if ($orderData) {
                $order = [
                    'id' => $orderData->order_number,
                    'date' => $orderData->created_at->toISOString(),
                    'status' => ucfirst($orderData->status),
                    'total' => $orderData->total_amount,
                    'payment_method' => $orderData->payment_method === 'cod' ? 'Cash on Delivery' : ucfirst(str_replace('_', ' ', $orderData->payment_method)),
                    'shipping_address' => [
                        'name' => $orderData->customer_first_name . ' ' . $orderData->customer_last_name,
                        'street' => $orderData->shipping_address,
                        'city' => \App\Models\City::find($orderData->shipping_city)->name ?? $orderData->shipping_city,
                        'state' => \App\Models\State::find($orderData->shipping_state)->name ?? $orderData->shipping_state,
                        'zip' => $orderData->shipping_postal_code,
                        'country' => \App\Models\Country::find($orderData->shipping_country)->name ?? $orderData->shipping_country,
                    ],
                ];
            }
        }
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        // Get store-specific currency settings
        $storeModel = Store::find($store['id']);
        $storeSettings = [];
        $currencies = [];
        
        if ($storeModel && $storeModel->user) {
            $storeSettings = \App\Models\Setting::getUserSettings($storeModel->user->id, $store['id']);
            $currencies = \App\Models\Currency::all()->map(function ($currency) {
                return [
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                    'name' => $currency->name
                ];
            })->toArray();
        }
        
        return Inertia::render('store/order-invoice', array_merge([
            'store' => $store,
            'theme' => $store['theme'],
            'storeContent' => $storeContent,
            'storeSettings' => $storeSettings,
            'currencies' => $currencies,
            'orderNumber' => $orderNumber,
            'order' => $order,
            'cartCount' => 0,
            'wishlistCount' => 5,
        ], $this->getCommonData()));
    }

    public function checkout($storeSlug)
    {
        return redirect()->route('store.home', ['storeSlug' => $storeSlug, 'action' => 'checkout']);
    }

    /**
     * Display the forgot password page.
     */
    public function forgotPassword($storeSlug)
    {
        $store = $this->getStore($storeSlug);
        
        // Get dynamic content from database
        $storeContent = StoreSetting::getSettings($store['id'], $store['theme']);
        
        return Inertia::render('store/auth/forgot-password', array_merge([
            'store' => $store,
            'theme' => $store['theme'],
            'storeContent' => $storeContent,
            'cartCount' => 0,
            'wishlistCount' => 0,
        ], $this->getCommonData()));
    }

    /**
     * Display the reset password page.
     */
    public function resetPassword($storeSlug, $token)
    {
        $store = $this->getStore($storeSlug);
        
        return Inertia::render('store/auth/reset-password', array_merge([
            'store' => $store,
            'theme' => $store['theme'],
            'token' => $token,
            'cartCount' => 0,
            'wishlistCount' => 0,
        ], $this->getCommonData()));
    }

    /**
     * Download order PDF
     */
    public function downloadOrderPdf($storeSlug, $orderNumber)
    {
        $store = $this->getStore($storeSlug);
        
        // Get order data
        $orderData = Order::where('order_number', $orderNumber)
            ->where('store_id', $store['id'])
            ->with(['items.product', 'shippingMethod'])
            ->first();
            
        if (!$orderData) {
            abort(404, 'Order not found');
        }
        
        // Get store configuration
        $storeModel = Store::find($store['id']);
        $storeSettings = [];
        $currencies = [];
        
        if ($storeModel && $storeModel->user) {
            $storeSettings = \App\Models\Setting::getUserSettings($storeModel->user->id, $store['id']);
            $currencies = \App\Models\Currency::all()->map(function ($currency) {
                return [
                    'code' => $currency->code,
                    'symbol' => $currency->symbol,
                    'name' => $currency->name
                ];
            })->toArray();
        }
        
        $order = [
            'id' => $orderData->order_number,
            'date' => $orderData->created_at->toISOString(),
            'status' => ucfirst($orderData->status),
            'total' => (float) $orderData->total_amount,
            'subtotal' => (float) $orderData->subtotal,
            'discount' => (float) $orderData->discount_amount,
            'shipping' => (float) $orderData->shipping_amount,
            'tax' => (float) $orderData->tax_amount,
            'currency' => $storeSettings['currency_symbol'] ?? '$',
            'coupon' => $orderData->coupon_code,
            'payment_method' => $orderData->payment_method === 'cod' ? 'Cash on Delivery' : ucfirst(str_replace('_', ' ', $orderData->payment_method)),
            'customer' => [
                'name' => $orderData->customer_first_name . ' ' . $orderData->customer_last_name,
                'email' => $orderData->customer_email,
                'phone' => $orderData->customer_phone,
            ],
            'shipping_address' => [
                'name' => $orderData->customer_first_name . ' ' . $orderData->customer_last_name,
                'address' => $orderData->shipping_address,
                'city' => is_numeric($orderData->shipping_city) ? (\App\Models\City::find($orderData->shipping_city)->name ?? $orderData->shipping_city) : $orderData->shipping_city,
                'state' => is_numeric($orderData->shipping_state) ? (\App\Models\State::find($orderData->shipping_state)->name ?? $orderData->shipping_state) : $orderData->shipping_state,
                'postal_code' => $orderData->shipping_postal_code,
                'country' => is_numeric($orderData->shipping_country) ? (\App\Models\Country::find($orderData->shipping_country)->name ?? $orderData->shipping_country) : $orderData->shipping_country,
            ],
            'items' => $orderData->items->map(function ($item) {
                $taxDetails = json_decode($item->tax_details, true) ?? [];
                return [
                    'name' => $item->product_name,
                    'price' => (float) $item->unit_price,
                    'quantity' => $item->quantity,
                    'variants' => $item->product_variants,
                    'tax_name' => $taxDetails['tax_name'] ?? null,
                    'tax_percentage' => $taxDetails['tax_percentage'] ?? null,
                    'tax_amount' => (float) ($taxDetails['tax_amount'] ?? 0),
                ];
            })->toArray(),
        ];
        
        $storeData = $this->getStoreConfig($store);
        
        $data = [
            'orderNumber' => $orderNumber,
            'order' => $order,
            'config' => $storeData['config'],
            'storeSettings' => $storeSettings,
            'currencies' => $currencies,
        ];
        
        $pdf = Pdf::loadView('pdf.invoice', $data);
        return $pdf->download("invoice-{$orderNumber}.pdf");
    }

    /**
     * Get shared Inertia data for subdomain/custom domain store pages
     */
    private function getSharedInertiaData($request): array
    {
        $superadminId = getSuperadminId();
        $settings = $superadminId ? settings($superadminId) : [];
        $globalSettings = $settings;
        $globalSettings["base_url"] = config("app.url");
        
        // Remove sensitive keys
        $sensitiveKeys = ["stripeKey","stripeSecret","paypalClientId","paypalSecret","razorpayKey","razorpaySecret","openaiApiKey","resendApiKey","smtpPassword"];
        foreach ($sensitiveKeys as $key) { unset($globalSettings[$key]); }
        
        return [
            "globalSettings" => $globalSettings,
            "auth" => ["user" => $request->user()],
            "ziggy" => ["url" => $request->schemeAndHttpHost(), "port" => null, "defaults" => [], "routes" => [], "location" => $request->url()],
            "flash" => ["success" => null, "error" => null],
            "stores" => [],
            "isImpersonating" => false,
            "is_demo" => config("app.is_demo", false),
        ];
    }
}