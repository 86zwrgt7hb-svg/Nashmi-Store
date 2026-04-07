<?php

namespace App\Http\Controllers;

use App\Models\NotificationPreference;
use App\Models\PushToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Show notification settings page
     */
    public function index()
    {
        $user = Auth::user();
        $store = $user->currentStore;

        if (!$store) {
            return redirect()->route('dashboard');
        }

        $preferences = NotificationPreference::firstOrCreate(
            ['user_id' => $user->id, 'store_id' => $store->id],
            [
                'email_new_order' => true,
                'email_order_status' => true,
                'email_low_stock' => true,
                'email_new_review' => true,
                'push_new_order' => true,
                'push_order_status' => true,
                'push_low_stock' => true,
                'push_new_review' => true,
                'low_stock_threshold' => 5,
            ]
        );

        return Inertia::render('Notifications/Settings', [
            'preferences' => $preferences,
        ]);
    }

    /**
     * Update notification preferences
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $store = $user->currentStore;

        $validated = $request->validate([
            'email_new_order' => 'boolean',
            'email_order_status' => 'boolean',
            'email_low_stock' => 'boolean',
            'email_new_review' => 'boolean',
            'push_new_order' => 'boolean',
            'push_order_status' => 'boolean',
            'push_low_stock' => 'boolean',
            'push_new_review' => 'boolean',
            'low_stock_threshold' => 'integer|min:1|max:100',
        ]);

        NotificationPreference::updateOrCreate(
            ['user_id' => $user->id, 'store_id' => $store->id],
            $validated
        );

        return back()->with('success', __('Notification settings updated successfully'));
    }

    /**
     * Register push token
     */
    public function registerPushToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'device_type' => 'string|in:web,ios,android',
        ]);

        $user = Auth::user();

        PushToken::updateOrCreate(
            ['user_id' => $user->id, 'token' => $request->token],
            ['device_type' => $request->device_type ?? 'web']
        );

        return response()->json(['success' => true]);
    }

    /**
     * Remove push token
     */
    public function removePushToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        PushToken::where('user_id', Auth::id())
            ->where('token', $request->token)
            ->delete();

        return response()->json(['success' => true]);
    }
}
