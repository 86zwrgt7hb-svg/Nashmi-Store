<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Plan;
use App\Models\Contact;
use App\Models\Newsletter;
use App\Models\LandingPageSetting;
use App\Models\LandingPageCustomPage;
use App\Models\Store;

class LandingPageController extends Controller
{
    public function show(Request $request)
    {
        $host = $request->getHost();
        $store = null;
        
        // Check if it's a subdomain request for stores
        $hostParts = explode('.', $host);
        if (count($hostParts) > 2) {
            $subdomain = $hostParts[0];
            $store = Store::where('slug', $subdomain)
                ->whereHas('configurations', function($q) {
                    $q->where('key', 'store_status')->where('value', 'true');
                })
                ->first();
        }
        
        // Check for store custom domain
        if (!$store) {
            $store = Store::where('custom_domain', rtrim(preg_replace('/^https?:\/\//', '', $host), '/'))
                ->whereHas('configurations', function($q) {
                    $q->where('key', 'store_status')->where('value', 'true');
                })
                ->first();
        }

        if ($store) {
            // Redirect to store frontend
            return redirect()->route('store.home', ['storeSlug' => $store->slug]);
        }
        
        // Check if landing page is enabled in settings
        if (!isLandingPageEnabled()) {
            return redirect()->route('login');
        }
        
        $landingSettings = LandingPageSetting::getSettings();
        
        // Get the single lifetime plan
        $lifetimePlan = Plan::getLifetimePlan() ?? Plan::where('is_plan_enable', 'on')->first();
        
        $plans = collect();
        if ($lifetimePlan) {
            $allFeatures = [
                ['name' => __('Custom Domain'), 'enabled' => $lifetimePlan->enable_custdomain === 'on'],
                ['name' => __('Subdomain'), 'enabled' => $lifetimePlan->enable_custsubdomain === 'on'],
                ['name' => __('PWA'), 'enabled' => $lifetimePlan->pwa_business === 'on'],
                ['name' => __('AI Integration'), 'enabled' => $lifetimePlan->enable_chatgpt === 'on'],
                ['name' => __('Shipping Method'), 'enabled' => $lifetimePlan->enable_shipping_method === 'on'],
                ['name' => __('POS System'), 'enabled' => $lifetimePlan->enable_pos === 'on'],
                ['name' => __('Remove Branding'), 'enabled' => $lifetimePlan->enable_branding === 'off'],
            ];
            
            $features = array_values(array_map(fn($f) => $f['name'], array_filter($allFeatures, fn($f) => $f['enabled'])));
            
            $plans = collect([[
                'id' => $lifetimePlan->id,
                'name' => $lifetimePlan->name,
                'price' => $lifetimePlan->price,
                'yearly_price' => $lifetimePlan->price,
                'duration' => 'lifetime',
                'description' => $lifetimePlan->description,
                'features' => $features,
                'allFeatures' => $allFeatures,
                'stats' => [
                    'businesses' => __('Unlimited'),
                    'users' => __('Unlimited'),
                    'products_per_store' => __('Unlimited'),
                    'storage' => __('Unlimited'),
                    'templates' => is_array($lifetimePlan->themes) ? count($lifetimePlan->themes) : 7,
                    'bio_links' => 'Unlimited',
                    'bio_links_templates' => '14',
                ],
                'is_plan_enable' => $lifetimePlan->is_plan_enable,
                'is_popular' => true
            ]]);
        }
        
        // Get featured stores instead of campaigns
        $featuredStores = Store::whereHas('configurations', function($q) {
                $q->where('key', 'store_status')->where('value', 'true');
            })
            ->where('is_featured', true)
            ->limit(6)
            ->get()
            ->map(function ($store) {
                return [
                    'id' => $store->id,
                    'name' => $store->name,
                    'description' => $store->description,
                    'slug' => $store->slug,
                    'logo' => $store->logo,
                ];
            });
        
        return Inertia::render('landing-page/index', [
            'plans' => $plans,
            'testimonials' => [],
            'faqs' => [],
            'customPages' => LandingPageCustomPage::active()->ordered()->get() ?? [],
            'settings' => $landingSettings,
            'featuredStores' => $featuredStores,
            'superadminLogoDark' => \App\Models\Setting::getSetting('logoDark', getSuperadminId(), null),
            'superadminLogoLight' => \App\Models\Setting::getSetting('logoLight', getSuperadminId(), null)
        ]);
    }

    public function submitContact(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
            'is_landing_page' => true,
            'business_id' => null
        ]);

        return back()->with('success', __('Thank you for your message. We will get back to you soon!'));
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255|unique:newsletters,email'
        ]);

        Newsletter::create([
            'email' => $request->email,
            'status' => 'active',
            'subscribed_at' => now()
        ]);

        return back()->with('success', __('Thank you for subscribing to our newsletter!'));
    }

    public function settings()
    {
        $landingSettings = LandingPageSetting::getSettings();
        
        return Inertia::render('landing-page/settings', [
            'settings' => $landingSettings
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'required|string|max:255',
            'contact_address' => 'required|string|max:255',
            'config_sections' => 'required|array'
        ]);
        $landingSettings = LandingPageSetting::getSettings();
        $landingSettings->update($request->all());

        return back()->with('success', __('Landing page settings updated successfully!'));
    }
}