<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\NotificationSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationSettingController extends Controller
{
    public function index(Request $request)
    {
        $storeId = $this->getStoreId($request);
        $preferences = NotificationSetting::getForStore($storeId);

        return Inertia::render('notification-settings/index', [
            'preferences' => $preferences,
        ]);
    }

    public function update(Request $request)
    {
        $storeId = $this->getStoreId($request);

        $validated = $request->validate([
            'email_new_order' => 'boolean',
            'email_order_status' => 'boolean',
            'email_low_stock' => 'boolean',
            'email_new_review' => 'boolean',
            'push_new_order' => 'boolean',
            'push_order_status' => 'boolean',
            'push_low_stock' => 'boolean',
            'push_new_review' => 'boolean',
            'low_stock_threshold' => 'integer|min:1|max:1000',
        ]);

        NotificationSetting::updateOrCreate(
            ['store_id' => $storeId],
            $validated
        );

        return back()->with('success', 'Notification settings updated successfully');
    }

    private function getStoreId(Request $request)
    {
        if (session()->has('current_store_id')) {
            return session('current_store_id');
        }
        if (auth()->check() && method_exists(auth()->user(), 'currentStore')) {
            return auth()->user()->currentStore()?->id ?? 1;
        }
        return $request->input('store_id', 1);
    }
}
