<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Product;
use App\Models\Store;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display reviews list for merchant dashboard
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $store = $user->currentStore;

        if (!$store) {
            return redirect()->route('dashboard');
        }

        $query = Review::where('store_id', $store->id)
            ->with('product:id,name,image')
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by rating
        if ($request->has('rating') && $request->rating) {
            $query->where('rating', $request->rating);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('comment', 'like', "%{$search}%")
                  ->orWhereHas('product', function ($pq) use ($search) {
                      $pq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $reviews = $query->paginate(15)->withQueryString();

        // Stats
        $stats = [
            'total' => Review::where('store_id', $store->id)->count(),
            'pending' => Review::where('store_id', $store->id)->where('status', 'pending')->count(),
            'approved' => Review::where('store_id', $store->id)->where('status', 'approved')->count(),
            'rejected' => Review::where('store_id', $store->id)->where('status', 'rejected')->count(),
            'average_rating' => round(Review::where('store_id', $store->id)->where('status', 'approved')->avg('rating') ?? 0, 1),
        ];

        return Inertia::render('Reviews/Index', [
            'reviews' => $reviews,
            'stats' => $stats,
            'filters' => $request->only(['status', 'rating', 'search']),
        ]);
    }

    /**
     * Approve a review
     */
    public function approve(Review $review)
    {
        $user = Auth::user();
        $store = $user->currentStore;

        if ($review->store_id !== $store->id) {
            abort(403);
        }

        $review->update(['status' => 'approved']);

        return back()->with('success', __('Review approved successfully'));
    }

    /**
     * Reject a review
     */
    public function reject(Review $review)
    {
        $user = Auth::user();
        $store = $user->currentStore;

        if ($review->store_id !== $store->id) {
            abort(403);
        }

        $review->update(['status' => 'rejected']);

        return back()->with('success', __('Review rejected successfully'));
    }

    /**
     * Reply to a review
     */
    public function reply(Request $request, Review $review)
    {
        $user = Auth::user();
        $store = $user->currentStore;

        if ($review->store_id !== $store->id) {
            abort(403);
        }

        $request->validate([
            'reply' => 'required|string|max:1000',
        ]);

        $review->update([
            'reply' => $request->reply,
            'replied_at' => now(),
        ]);

        return back()->with('success', __('Reply added successfully'));
    }

    /**
     * Delete a review
     */
    public function destroy(Review $review)
    {
        $user = Auth::user();
        $store = $user->currentStore;

        if ($review->store_id !== $store->id) {
            abort(403);
        }

        $review->delete();

        return back()->with('success', __('Review deleted successfully'));
    }

    /**
     * Bulk actions on reviews
     */
    public function bulkAction(Request $request)
    {
        $user = Auth::user();
        $store = $user->currentStore;

        $request->validate([
            'action' => 'required|in:approve,reject,delete',
            'ids' => 'required|array',
            'ids.*' => 'integer',
        ]);

        $reviews = Review::where('store_id', $store->id)
            ->whereIn('id', $request->ids);

        switch ($request->action) {
            case 'approve':
                $reviews->update(['status' => 'approved']);
                break;
            case 'reject':
                $reviews->update(['status' => 'rejected']);
                break;
            case 'delete':
                $reviews->delete();
                break;
        }

        return back()->with('success', __('Bulk action completed successfully'));
    }
}
