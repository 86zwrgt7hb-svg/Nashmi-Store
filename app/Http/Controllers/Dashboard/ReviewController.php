<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $storeId = $this->getStoreId($request);

        $query = Review::forStore($storeId)
            ->with('product:id,name')
            ->latest();

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%")
                  ->orWhere('comment', 'like', "%{$search}%");
            });
        }

        $reviews = $query->paginate(20);

        $stats = [
            'total' => Review::forStore($storeId)->count(),
            'pending' => Review::forStore($storeId)->where('status', 'pending')->count(),
            'approved' => Review::forStore($storeId)->where('status', 'approved')->count(),
            'rejected' => Review::forStore($storeId)->where('status', 'rejected')->count(),
            'average_rating' => round(Review::forStore($storeId)->approved()->avg('rating') ?? 0, 1),
        ];

        return Inertia::render('reviews/index', [
            'reviews' => $reviews,
            'stats' => $stats,
            'filters' => $request->only(['status', 'rating', 'search']),
        ]);
    }

    public function approve(Review $review)
    {
        $review->update(['status' => 'approved']);
        return back()->with('success', 'Review approved successfully');
    }

    public function reject(Review $review)
    {
        $review->update(['status' => 'rejected']);
        return back()->with('success', 'Review rejected successfully');
    }

    public function reply(Request $request, Review $review)
    {
        $request->validate(['reply' => 'required|string|max:1000']);

        $review->update([
            'reply' => $request->reply,
            'replied_at' => now(),
        ]);

        return back()->with('success', 'Reply submitted successfully');
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return back()->with('success', 'Review deleted successfully');
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:approve,reject,delete',
            'ids' => 'required|array',
            'ids.*' => 'integer',
        ]);

        $storeId = $this->getStoreId($request);
        $query = Review::forStore($storeId)->whereIn('id', $request->ids);

        switch ($request->action) {
            case 'approve':
                $query->update(['status' => 'approved']);
                break;
            case 'reject':
                $query->update(['status' => 'rejected']);
                break;
            case 'delete':
                $query->delete();
                break;
        }

        return back()->with('success', 'Bulk action completed successfully');
    }

    // API endpoint for storefront (customers submitting reviews)
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:2000',
        ]);

        $storeId = $this->getStoreId($request);

        $review = Review::create([
            'store_id' => $storeId,
            'product_id' => $request->product_id,
            'customer_id' => auth()->id(),
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'status' => 'pending',
            'is_verified_purchase' => $this->checkVerifiedPurchase($storeId, $request->product_id, auth()->id()),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully. It will be visible after approval.',
            'review' => $review,
        ]);
    }

    // API endpoint for storefront (get approved reviews for a product)
    public function getProductReviews(Request $request, $productId)
    {
        $storeId = $this->getStoreId($request);

        $reviews = Review::forStore($storeId)
            ->where('product_id', $productId)
            ->approved()
            ->latest()
            ->paginate(10);

        $stats = [
            'average_rating' => round(Review::forStore($storeId)->where('product_id', $productId)->approved()->avg('rating') ?? 0, 1),
            'total_reviews' => Review::forStore($storeId)->where('product_id', $productId)->approved()->count(),
            'rating_distribution' => [
                5 => Review::forStore($storeId)->where('product_id', $productId)->approved()->where('rating', 5)->count(),
                4 => Review::forStore($storeId)->where('product_id', $productId)->approved()->where('rating', 4)->count(),
                3 => Review::forStore($storeId)->where('product_id', $productId)->approved()->where('rating', 3)->count(),
                2 => Review::forStore($storeId)->where('product_id', $productId)->approved()->where('rating', 2)->count(),
                1 => Review::forStore($storeId)->where('product_id', $productId)->approved()->where('rating', 1)->count(),
            ],
        ];

        return response()->json([
            'reviews' => $reviews,
            'stats' => $stats,
        ]);
    }

    private function getStoreId(Request $request)
    {
        // Try to get store_id from session, auth user, or request
        if (session()->has('current_store_id')) {
            return session('current_store_id');
        }
        if (auth()->check() && method_exists(auth()->user(), 'currentStore')) {
            return auth()->user()->currentStore()?->id ?? 1;
        }
        return $request->input('store_id', 1);
    }

    private function checkVerifiedPurchase($storeId, $productId, $customerId)
    {
        if (!$customerId) return false;
        // Check if customer has ordered this product
        // This is a simplified check - adjust based on your Order model
        try {
            return \DB::table('orders')
                ->join('order_items', 'orders.id', '=', 'order_items.order_id')
                ->where('orders.customer_id', $customerId)
                ->where('order_items.product_id', $productId)
                ->where('orders.status', 'completed')
                ->exists();
        } catch (\Exception $e) {
            return false;
        }
    }
}
