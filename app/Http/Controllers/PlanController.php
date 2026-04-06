<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Company users see only active plans
        if ($user->type !== 'superadmin') {
            return $this->companyPlansView($request);
        }
        
        // Admin view
        $billingCycle = $request->input('billing_cycle', 'monthly');
        
        $dbPlans = Plan::all();
        $hasDefaultPlan = $dbPlans->where('is_default', true)->count() > 0;
        
        $plans = $dbPlans->map(function ($plan) use ($billingCycle) {
            // Determine features based on plan attributes
            $features = [];
            if ($plan->enable_custdomain === 'on') $features[] = 'Custom Domain';
            if ($plan->enable_custsubdomain === 'on') $features[] = 'Subdomain';
            if ($plan->pwa_business === 'on') $features[] = 'PWA';
            if ($plan->enable_chatgpt === 'on') $features[] = 'AI Integration';
            if ($plan->enable_shipping_method === 'on') $features[] = 'Shipping Method';
            if ($plan->enable_pos === 'on') $features[] = 'POS System';
            
            // Get price based on billing cycle
            $price = $billingCycle === 'yearly' ? $plan->yearly_price : $plan->price;
            
            // Format price with currency symbol
            $formattedPrice = $this->formatPlanPrice($price);
            
            // Set duration based on billing cycle
            $duration = $billingCycle === 'yearly' ? 'Yearly' : 'Monthly';
            
            // Calculate savings for yearly plans
            $savings = 0;
            if ($billingCycle === 'yearly' && $plan->yearly_price && $plan->price > 0) {
                $savings = ($plan->price * 12) - $plan->yearly_price;
            }
            
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => $price,
                'monthly_price' => $plan->price,
                'yearly_price' => $plan->yearly_price,
                'formattedPrice' => $formattedPrice,
                'duration' => $duration,
                'description' => $plan->description,
                'trial_days' => $plan->trial_day,
                'savings' => $savings,
                'features' => $features,
                'stats' => [
                    'stores' => ($plan->max_stores ?? $plan->business ?? 0) == 0 ? __('Unlimited') : ($plan->max_stores ?? $plan->business ?? 0),
                    'users_per_store' => ($plan->max_users_per_store ?? $plan->max_users ?? 0) == 0 ? __('Unlimited') : ($plan->max_users_per_store ?? $plan->max_users ?? 0),
                    'products_per_store' => ($plan->max_products_per_store ?? 0) == 0 ? __('Unlimited') : ($plan->max_products_per_store ?? 0),
                    'storage' => ($plan->storage_limit ?? 0) == 0 ? __('Unlimited') : $plan->storage_limit . ' GB',
                    'templates' => $this->getThemeCount($plan->themes)
                ],
                'status' => $plan->is_plan_enable === 'on',
                'is_default' => $plan->is_default,
                'is_free' => $plan->price == 0,
                'recommended' => false // Default to false
            ];
        })->toArray();
        
        // Mark the plan with most subscribers as recommended
        $planSubscriberCounts = Plan::withCount('users')->get()->pluck('users_count', 'id');
        $mostSubscribedPlanId = $planSubscriberCounts->keys()->first();
        if ($planSubscriberCounts->isNotEmpty()) {
            $mostSubscribedPlanId = $planSubscriberCounts->keys()->sortByDesc(function($planId) use ($planSubscriberCounts) {
                return $planSubscriberCounts[$planId];
            })->first();
        }
        
        foreach ($plans as &$plan) {
            if ($plan['id'] == $mostSubscribedPlanId) {
                $plan['recommended'] = true;
                break;
            }
        }

        return Inertia::render('plans/index', [
            'plans' => $plans,
            'billingCycle' => $billingCycle,
            'hasDefaultPlan' => $hasDefaultPlan,
            'isAdmin' => true
        ]);
    }
    
    /**
     * Toggle plan status
     */
    public function toggleStatus(Plan $plan)
    {
        $plan->is_plan_enable = $plan->is_plan_enable === 'on' ? 'off' : 'on';
        $plan->save();
        
        return back();
    }
    
    /**
     * Show the form for creating a new plan
     */
    public function create()
    {
        $hasDefaultPlan = Plan::where('is_default', true)->exists();
        
        return Inertia::render('plans/create', [
            'hasDefaultPlan' => $hasDefaultPlan
        ]);
    }
    
    /**
     * Store a newly created plan
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:plans',
            'price' => 'required|numeric|min:0',
            'yearly_price' => 'nullable|numeric|min:0',
            'duration' => 'required|string',
            'description' => 'nullable|string',
            'max_stores' => 'required|integer|min:0',
            'max_users_per_store' => 'required|integer|min:0',
            'max_products_per_store' => 'required|integer|min:0',
            'storage_limit' => 'required|numeric|min:0',
            'enable_custdomain' => 'nullable|in:on,off',
            'enable_custsubdomain' => 'nullable|in:on,off',
            'pwa_business' => 'nullable|in:on,off',
            'enable_chatgpt' => 'nullable|in:on,off',
            'enable_shipping_method' => 'nullable|in:on,off',
            'enable_pos' => 'nullable|in:on,off',
            'themes' => 'nullable|array',
            'is_trial' => 'nullable|in:on,off',
            'trial_day' => 'nullable|integer|min:0',
            'is_plan_enable' => 'nullable|in:on,off',
            'is_default' => 'nullable|boolean',
        ]);
        
        // Set default values for nullable fields
        $validated['enable_custdomain'] = $validated['enable_custdomain'] ?? 'off';
        $validated['enable_custsubdomain'] = $validated['enable_custsubdomain'] ?? 'off';
        $validated['pwa_business'] = $validated['pwa_business'] ?? 'off';
        $validated['enable_chatgpt'] = $validated['enable_chatgpt'] ?? 'off';
        $validated['enable_shipping_method'] = $validated['enable_shipping_method'] ?? 'off';
        $validated['enable_pos'] = $validated['enable_pos'] ?? 'off';
        $validated['is_trial'] = $validated['is_trial'] ?? null;
        $validated['is_plan_enable'] = $validated['is_plan_enable'] ?? 'on';
        $validated['is_default'] = $validated['is_default'] ?? false;
        
        // If yearly_price is not provided, calculate it as 80% of monthly price * 12
        if (!isset($validated['yearly_price']) || $validated['yearly_price'] === null) {
            $validated['yearly_price'] = $validated['price'] * 12 * 0.8;
        }
        
        // If this plan is set as default, remove default status from other plans
        if ($validated['is_default']) {
            Plan::where('is_default', true)->update(['is_default' => false]);
        }
        
        // Ensure at least default theme is included
        if (!isset($validated['themes']) || !is_array($validated['themes']) || count($validated['themes']) === 0) {
            $validated['themes'] = ['gadgets']; // Default theme
        }
        
        // Create the plan
        Plan::create($validated);
        
        return redirect()->route('plans.index')->with('success', __('Plan created successfully.'));
    }
    
    /**
     * Show the form for editing a plan
     */
    public function edit(Plan $plan)
    {
        $otherDefaultPlanExists = Plan::where('is_default', true)
            ->where('id', '!=', $plan->id)
            ->exists();
            
        return Inertia::render('plans/edit', [
            'plan' => $plan,
            'otherDefaultPlanExists' => $otherDefaultPlanExists
        ]);
    }
    
    /**
     * Update a plan
     */
    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:plans,name,' . $plan->id,
            'price' => 'required|numeric|min:0',
            'yearly_price' => 'nullable|numeric|min:0',
            'duration' => 'required|string',
            'description' => 'nullable|string',
            'max_stores' => 'required|integer|min:0',
            'max_users_per_store' => 'required|integer|min:0',
            'max_products_per_store' => 'required|integer|min:0',
            'storage_limit' => 'required|numeric|min:0',
            'enable_custdomain' => 'nullable|in:on,off',
            'enable_custsubdomain' => 'nullable|in:on,off',
            'pwa_business' => 'nullable|in:on,off',
            'enable_chatgpt' => 'nullable|in:on,off',
            'enable_shipping_method' => 'nullable|in:on,off',
            'enable_pos' => 'nullable|in:on,off',
            'themes' => 'nullable|array',
            'is_trial' => 'nullable|in:on,off',
            'trial_day' => 'nullable|integer|min:0',
            'is_plan_enable' => 'nullable|in:on,off',
            'is_default' => 'nullable|boolean',
        ]);
        
        // Set default values for nullable fields
        $validated['enable_custdomain'] = $validated['enable_custdomain'] ?? 'off';
        $validated['enable_custsubdomain'] = $validated['enable_custsubdomain'] ?? 'off';
        $validated['pwa_business'] = $validated['pwa_business'] ?? 'off';
        $validated['enable_chatgpt'] = $validated['enable_chatgpt'] ?? 'off';
        $validated['enable_shipping_method'] = $validated['enable_shipping_method'] ?? 'off';
        $validated['enable_pos'] = $validated['enable_pos'] ?? 'off';
        $validated['is_trial'] = $validated['is_trial'] ?? null;
        $validated['is_plan_enable'] = $validated['is_plan_enable'] ?? 'on';
        $validated['is_default'] = $validated['is_default'] ?? false;
        
        // If yearly_price is not provided, calculate it as 80% of monthly price * 12
        if (!isset($validated['yearly_price']) || $validated['yearly_price'] === null) {
            $validated['yearly_price'] = $validated['price'] * 12 * 0.8;
        }
        
        // If this plan is set as default, remove default status from other plans
        if ($validated['is_default'] && !$plan->is_default) {
            Plan::where('is_default', true)->update(['is_default' => false]);
        }
        
        // Ensure at least default theme is included
        if (!isset($validated['themes']) || !is_array($validated['themes']) || count($validated['themes']) === 0) {
            $validated['themes'] = ['gadgets']; // Default theme
        }
        
        // Update the plan
        $plan->update($validated);
        
        return redirect()->route('plans.index')->with('success', __('Plan updated successfully.'));
    }
    
    /**
     * Delete a plan
     */
    public function destroy(Plan $plan)
    {
        // Don't allow deleting the default plan
        if ($plan->is_default) {
            return back()->with('error', __('Cannot delete the default plan.'));
        }
        
        $plan->delete();
        
        return redirect()->route('plans.index')->with('success', __('Plan deleted successfully.'));
    }
    
    private function companyPlansView(Request $request)
    {
        $user = auth()->user();
        // Use billing_cycle from request, or default to user's plan_duration
        $billingCycle = $request->input('billing_cycle', $user->plan_duration ?? 'monthly');
        
        $dbPlans = Plan::where('is_plan_enable', 'on')->get();
        
        $plans = $dbPlans->map(function ($plan) use ($billingCycle, $user) {
            $price = $billingCycle === 'yearly' ? $plan->yearly_price : $plan->price;
            
            $features = [];
            if ($plan->enable_custdomain === 'on') $features[] = 'Custom Domain';
            if ($plan->enable_custsubdomain === 'on') $features[] = 'Subdomain';
            if ($plan->pwa_business === 'on') $features[] = 'PWA';
            if ($plan->enable_chatgpt === 'on') $features[] = 'AI Integration';
            if ($plan->enable_shipping_method === 'on') $features[] = 'Shipping Method';
            if ($plan->enable_pos === 'on') $features[] = 'POS System';
            
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => $price,
                'monthly_price' => $plan->price,
                'yearly_price' => $plan->yearly_price,
                'formatted_price' => $this->formatPlanPrice($price),
                'duration' => $billingCycle === 'yearly' ? 'Yearly' : 'Monthly',
                'description' => $plan->description,
                'trial_days' => $plan->trial_day,
                'features' => $features,
                'stats' => [
                    'stores' => ($plan->max_stores ?? $plan->business ?? 0) == 0 ? __('Unlimited') : ($plan->max_stores ?? $plan->business ?? 0),
                    'users_per_store' => ($plan->max_users_per_store ?? $plan->max_users ?? 0) == 0 ? __('Unlimited') : ($plan->max_users_per_store ?? $plan->max_users ?? 0),
                    'products_per_store' => ($plan->max_products_per_store ?? 0) == 0 ? __('Unlimited') : ($plan->max_products_per_store ?? 0),
                    'storage' => ($plan->storage_limit ?? 0) == 0 ? __('Unlimited') : $plan->storage_limit . ' GB',
                    'templates' => $this->getThemeCount($plan->themes)
                ],
                'is_current' => $user->plan_id == $plan->id,
                'is_trial_available' => $plan->is_trial === 'on' && !$user->trial_used,
                'is_default' => $plan->is_default,
                'is_free' => $plan->price == 0,
                'recommended' => false // Default to false
            ];
        });
        
        // Mark the plan with most subscribers as recommended
        $planSubscriberCounts = Plan::withCount('users')->get()->pluck('users_count', 'id');
        if ($planSubscriberCounts->isNotEmpty()) {
            $mostSubscribedPlanId = $planSubscriberCounts->keys()->sortByDesc(function($planId) use ($planSubscriberCounts) {
                return $planSubscriberCounts[$planId];
            })->first();
            
            $plans = $plans->map(function($plan) use ($mostSubscribedPlanId) {
                if ($plan['id'] == $mostSubscribedPlanId) {
                    $plan['recommended'] = true;
                }
                return $plan;
            });
        }
        
        return Inertia::render('plans/index', [
            'plans' => $plans,
            'billingCycle' => $billingCycle,
            'currentPlan' => $user->plan ? [
                ...$user->plan->toArray(),
                'duration' => $user->plan_duration ?? 'monthly'
            ] : null,
            'userTrialUsed' => (bool)$user->trial_used,
            'userOnTrial' => in_array($user->is_trial, ['yes', '1'], true) && $user->trial_expire_date && now()->isBefore(\Carbon\Carbon::parse($user->trial_expire_date)),
            'trialDaysLeft' => (!$user->trial_used && $user->trial_expire_date && now()->isBefore(\Carbon\Carbon::parse($user->trial_expire_date))) ? max(0, (int)now()->diffInDays(\Carbon\Carbon::parse($user->trial_expire_date), false)) : 0,
            'trialPeriodActive' => !$user->trial_used && $user->trial_expire_date && now()->isBefore(\Carbon\Carbon::parse($user->trial_expire_date))
        ]);
    }
    
    public function requestPlan(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly'
        ]);
        
        $user = auth()->user();
        $plan = Plan::findOrFail($request->plan_id);
        
        \App\Models\PlanRequest::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'duration' => $request->billing_cycle,
            'status' => 'pending'
        ]);
        
        return back()->with('success', __('Plan request submitted successfully'));
    }
    
    public function startTrial(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id'
        ]);
        
        $user = auth()->user();
        $plan = Plan::findOrFail($request->plan_id);
        if ($user->trial_used || $plan->is_trial !== 'on') {
            return back()->withErrors(['error' => 'Trial not available']);
        }
        
        // If user already has a valid trial_expire_date in the future, keep it (resuming trial)
        $trialExpireDate = ($user->trial_expire_date && now()->isBefore(\Carbon\Carbon::parse($user->trial_expire_date)))
            ? $user->trial_expire_date
            : now()->addDays($plan->trial_day);
        
        $user->update([
            'plan_id' => $plan->id,
            'is_trial' => 'yes',
            'trial_day' => $plan->trial_day,
            'trial_expire_date' => $trialExpireDate,
            'trial_used' => false,
        ]);
        
        return back()->with('success', __('Trial started successfully'));
    }
    
    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly'
        ]);
        
        $user = auth()->user();
        $plan = Plan::findOrFail($request->plan_id);
        
        // Check if user already has this plan
        if ($user->plan_id == $plan->id && $user->hasActivePlan()) {
            return back()->withErrors(['error' => __('You already have this plan active.')]);
        }
        
        // Check if plan is enabled
        if ($plan->is_plan_enable !== 'on') {
            return back()->withErrors(['error' => __('This plan is not available for subscription.')]);
        }
        
        try {
            // Use helper function to calculate proper pricing
            $pricing = calculatePlanPricing($plan, null, $request->billing_cycle);
            
            $planOrder = \App\Models\PlanOrder::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'billing_cycle' => $request->billing_cycle,
                'original_price' => $pricing['original_price'],
                'final_price' => $pricing['final_price'],
                'status' => 'approved'
            ]);
            
            // Assign plan to user with proper resource management
            assignPlanToUser($user, $plan, $request->billing_cycle);
            
            return back()->with('success', __('Plan assigned successfully'));
            
        } catch (\Exception $e) {
            \Log::error('Plan subscription failed: ' . $e->getMessage(), ['user_id' => $user->id, 'plan_id' => $plan->id]);
            return back()->withErrors(['error' => __('Plan subscription failed. Please try again.')]);
        }
    }
    
    /**
     * Get theme count for display
     */
    private function getThemeCount($themes)
    {
        if (is_array($themes)) {
            return count($themes);
        }
        return 7; // Default theme count
    }
    
    /**
     * Format plan price using superadmin currency settings
     */
    private function formatPlanPrice($price)
    {
        return formatCurrencyAmount($price);
    }

    public function switchTrialPlan(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id'
        ]);
        
        try {
            $user = auth()->user();
            $newPlan = Plan::findOrFail($request->plan_id);
            
            // User must have an active trial period (trial_expire_date in the future)
            if ($user->trial_used || !$user->trial_expire_date || now()->isAfter(\Carbon\Carbon::parse($user->trial_expire_date))) {
                return back()->withErrors(['error' => __('Your trial period has expired')]);
            }
            
            // Keep the same trial expiration date - just change the plan and ensure trial is active
            $user->update([
                'plan_id' => $newPlan->id,
                'is_trial' => 'yes',
            ]);
            
            // Enforce new plan limitations
            if (function_exists('enforcePlanLimitations')) {
                enforcePlanLimitations($user->fresh());
            }
            
            return back()->with('success', __('Plan switched successfully'));
        } catch (\Exception $e) {
            \Log::error('Switch trial plan failed: ' . $e->getMessage());
            return back()->withErrors(['error' => __('Failed to switch plan. Please try again.')]);
        }
    }
    
    public function downgradeToFree(Request $request)
    {
        try {
            $user = auth()->user();
            $freePlan = Plan::where('is_default', true)->first();
            
            if (!$freePlan) {
                $freePlan = Plan::where('price', 0)->first();
            }
            
            if (!$freePlan) {
                return back()->withErrors(['error' => __('Free plan not found')]);
            }
            
            // Keep trial_expire_date so user can resume trial if still within the 7-day window
            $user->update([
                'plan_id' => $freePlan->id,
                'is_trial' => 'no',
                'plan_is_active' => 1,
            ]);
            
            // Enforce free plan limitations
            if (function_exists('enforcePlanLimitations')) {
                enforcePlanLimitations($user->fresh());
            }
            
            return back()->with('success', __('Switched to free plan successfully'));
        } catch (\Exception $e) {
            \Log::error('Downgrade to free failed: ' . $e->getMessage());
            return back()->withErrors(['error' => __('Failed to switch to free plan. Please try again.')]);
        }
    }

}
