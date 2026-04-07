<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use App\Models\Store;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    /**
     * Get reviews for a product (public - store frontend)
     */
    public function getProductReviews(Request $request, $productId)
    {
        $storeSlug = $request->header('X-Store-Slug') ?? $request->route('storeSlug');
        $store = Store::where('slug', $storeSlug)->first();

        if (!$store) {
            return response()->json(['reviews' => [], 'stats' => null]);
        }

        $reviews = Review::where('store_id', $store->id)
            ->where('product_id', $productId)
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $stats = [
            'average' => round(Review::where('store_id', $store->id)
                ->where('product_id', $productId)
                ->where('status', 'approved')
                ->avg('rating') ?? 0, 1),
            'total' => Review::where('store_id', $store->id)
                ->where('product_id', $productId)
                ->where('status', 'approved')
                ->count(),
            'distribution' => $this->getRatingDistribution($store->id, $productId),
        ];

        return response()->json([
            'reviews' => $reviews,
            'stats' => $stats,
        ]);
    }

    /**
     * Submit a new review (store frontend)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_slug' => 'required|string',
            'product_id' => 'required|integer',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:2000',
        ]);

        $store = Store::where('slug', $validated['store_slug'])->first();
        if (!$store) {
            return response()->json(['error' => 'Store not found'], 404);
        }

        $product = Product::where('id', $validated['product_id'])
            ->where('store_id', $store->id)
            ->first();
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        // Check if this is a verified purchase
        $isVerifiedPurchase = false;
        $customerId = null;

        if ($validated['customer_email']) {
            $customer = \App\Models\Customer::where('email', $validated['customer_email'])
                ->where('store_id', $store->id)
                ->first();

            if ($customer) {
                $customerId = $customer->id;
                // Check if customer has ordered this product
                $hasOrdered = OrderItem::whereHas('order', function ($q) use ($store, $customer) {
                    $q->where('store_id', $store->id)
                      ->where('customer_id', $customer->id)
                      ->whereIn('status', ['delivered', 'completed']);
                })->where('product_id', $product->id)->exists();

                $isVerifiedPurchase = $hasOrdered;
            }
        }

        // Check for duplicate review
        $existingReview = Review::where('store_id', $store->id)
            ->where('product_id', $product->id)
            ->where('customer_email', $validated['customer_email'])
            ->first();

        if ($existingReview) {
            return response()->json(['error' => __('You have already reviewed this product')], 422);
        }

        // Get auto-approve setting from store
        $autoApprove = false; // Default: require approval

        $review = Review::create([
            'store_id' => $store->id,
            'product_id' => $product->id,
            'customer_id' => $customerId,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'status' => $autoApprove ? 'approved' : 'pending',
            'is_verified_purchase' => $isVerifiedPurchase,
        ]);

        // Send notification to store owner about new review
        try {
            $emailService = app(\App\Services\EmailTemplateService::class);
            // Notify store owner if they have email_new_review enabled
            $notifPref = \App\Models\NotificationPreference::where('user_id', $store->user_id)
                ->where('store_id', $store->id)
                ->first();

            if (!$notifPref || $notifPref->email_new_review) {
                // Use the store owner's email
                $owner = \App\Models\User::find($store->user_id);
                if ($owner) {
                    Log::info("New review submitted for product {$product->name} in store {$store->name}");
                }
            }
        } catch (\Exception $e) {
            Log::error('Failed to send new review notification: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => $autoApprove
                ? __('Review submitted successfully')
                : __('Review submitted and awaiting approval'),
            'review' => $review,
        ]);
    }

    /**
     * Get rating distribution for a product
     */
    private function getRatingDistribution($storeId, $productId)
    {
        $distribution = [];
        for ($i = 5; $i >= 1; $i--) {
            $distribution[$i] = Review::where('store_id', $storeId)
                ->where('product_id', $productId)
                ->where('status', 'approved')
                ->where('rating', $i)
                ->count();
        }
        return $distribution;
    }

    /**
     * Get store average rating (public)
     */
    public function getStoreRating(Request $request, $storeSlug)
    {
        $store = Store::where('slug', $storeSlug)->first();
        if (!$store) {
            return response()->json(['average' => 0, 'total' => 0]);
        }

        return response()->json([
            'average' => round(Review::where('store_id', $store->id)
                ->where('status', 'approved')
                ->avg('rating') ?? 0, 1),
            'total' => Review::where('store_id', $store->id)
                ->where('status', 'approved')
                ->count(),
        ]);
    }
}
