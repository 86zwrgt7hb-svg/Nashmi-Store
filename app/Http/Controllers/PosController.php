<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PosController extends Controller
{
    /**
     * Display the POS terminal page.
     */
    public function index()
    {
        $user = Auth::user();
        $store = Store::where('user_id', $user->id)->first();

        if (!$store) {
            return redirect()->route('dashboard')->with('error', 'No store found.');
        }

        // Check if user plan allows POS access
        $planCheck = \App\Http\Middleware\CheckPlanAccess::checkFeatureAccess($user, 'pos');
        if (!$planCheck['allowed']) {
            return Inertia::render('pos/upgrade', [
                'message' => $planCheck['message'],
            ]);
        }

        // Get all active products for the store with categories
        $products = Product::where('store_id', $store->id)
            ->where('is_active', true)
            ->with('category', 'tax')
            ->orderBy('name')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'name_ar' => $product->name_ar,
                    'sku' => $product->sku,
                    'price' => (float) $product->price,
                    'sale_price' => $product->sale_price ? (float) $product->sale_price : null,
                    'stock' => (int) $product->stock,
                    'cover_image' => $product->cover_image,
                    'category' => $product->category ? $product->category->name : null,
                    'category_ar' => $product->category ? $product->category->name_ar : null,
                    'tax_percentage' => $product->tax ? (float) $product->tax->percentage : 0,
                    'tax_name' => $product->tax ? $product->tax->name : null,
                ];
            });

        // Get today's POS sales summary
        $todaySales = Order::where('store_id', $store->id)
            ->where('order_type', 'pos')
            ->whereDate('created_at', today())
            ->selectRaw('COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total')
            ->first();

        return Inertia::render('pos/index', [
            'products' => $products,
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'currency' => $store->currency ?? '$',
            ],
            'todaySales' => [
                'count' => (int) $todaySales->count,
                'total' => (float) $todaySales->total,
            ],
        ]);
    }

    /**
     * Search products by SKU/barcode or name.
     */
    public function searchProduct(Request $request)
    {
        $user = Auth::user();
        $store = Store::where('user_id', $user->id)->first();

        if (!$store) {
            return response()->json(['error' => 'No store found'], 404);
        }

        $query = $request->input('query', '');
        $searchType = $request->input('type', 'all'); // 'barcode', 'name', 'all'

        $productsQuery = Product::where('store_id', $store->id)
            ->where('is_active', true);

        if ($searchType === 'barcode') {
            // Exact match for barcode/SKU (scanner input)
            $productsQuery->where('sku', $query);
        } elseif ($searchType === 'name') {
            $productsQuery->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('name_ar', 'like', "%{$query}%");
            });
        } else {
            // Search by SKU (exact) or name (partial)
            $productsQuery->where(function ($q) use ($query) {
                $q->where('sku', $query)
                  ->orWhere('name', 'like', "%{$query}%")
                  ->orWhere('name_ar', 'like', "%{$query}%");
            });
        }

        $products = $productsQuery->with('category', 'tax')
            ->limit(20)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'name_ar' => $product->name_ar,
                    'sku' => $product->sku,
                    'price' => (float) $product->price,
                    'sale_price' => $product->sale_price ? (float) $product->sale_price : null,
                    'stock' => (int) $product->stock,
                    'cover_image' => $product->cover_image,
                    'category' => $product->category ? $product->category->name : null,
                    'tax_percentage' => $product->tax ? (float) $product->tax->percentage : 0,
                    'tax_name' => $product->tax ? $product->tax->name : null,
                ];
            });

        return response()->json($products);
    }

    /**
     * Complete a POS sale - create order and deduct stock.
     */
    public function completeSale(Request $request)
    {
        $user = Auth::user();
        $store = Store::where('user_id', $user->id)->first();

        if (!$store) {
            return response()->json(['error' => 'No store found'], 404);
        }

        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:pos_cash,pos_card,pos_other',
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'discount_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            $order = DB::transaction(function () use ($request, $store) {
                $items = $request->input('items');
                $subtotal = 0;
                $totalTax = 0;
                $orderItems = [];

                // Validate stock and calculate totals
                foreach ($items as $item) {
                    $product = Product::where('id', $item['product_id'])
                        ->where('store_id', $store->id)
                        ->lockForUpdate()
                        ->first();

                    if (!$product) {
                        throw new \Exception("Product not found: ID {$item['product_id']}");
                    }

                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Insufficient stock for: {$product->name} (Available: {$product->stock}, Requested: {$item['quantity']})");
                    }

                    $unitPrice = $product->sale_price ?? $product->price;
                    $itemTotal = $unitPrice * $item['quantity'];
                    
                    // Calculate tax
                    $taxPercentage = 0;
                    $taxName = null;
                    $taxAmount = 0;
                    if ($product->tax) {
                        $taxPercentage = (float) $product->tax->percentage;
                        $taxName = $product->tax->name;
                        $taxAmount = ($itemTotal * $taxPercentage) / 100;
                    }

                    $subtotal += $itemTotal;
                    $totalTax += $taxAmount;

                    $orderItems[] = [
                        'product' => $product,
                        'quantity' => $item['quantity'],
                        'unit_price' => $unitPrice,
                        'item_total' => $itemTotal,
                        'tax_name' => $taxName,
                        'tax_percentage' => $taxPercentage,
                        'tax_amount' => $taxAmount,
                    ];
                }

                $discountAmount = (float) ($request->input('discount_amount', 0));
                $totalAmount = $subtotal + $totalTax - $discountAmount;

                // Create the order
                $order = Order::create([
                    'order_number' => Order::generateOrderNumber(),
                    'store_id' => $store->id,
                    'order_type' => 'pos',
                    'status' => 'completed',
                    'payment_status' => 'paid',
                    'payment_method' => $request->input('payment_method'),
                    'customer_first_name' => $request->input('customer_name', 'Walk-in Customer'),
                    'customer_last_name' => '',
                    'customer_phone' => $request->input('customer_phone', ''),
                    'customer_email' => 'pos@store.local',
                    'shipping_address' => 'In-Store',
                    'shipping_city' => 'In-Store',
                    'shipping_state' => 'In-Store',
                    'shipping_postal_code' => '00000',
                    'shipping_country' => 'In-Store',
                    'billing_address' => 'In-Store',
                    'billing_city' => 'In-Store',
                    'billing_state' => 'In-Store',
                    'billing_postal_code' => '00000',
                    'billing_country' => 'In-Store',
                    'coupon_discount' => 0,
                    'subtotal' => $subtotal,
                    'tax_amount' => $totalTax,
                    'shipping_amount' => 0,
                    'discount_amount' => $discountAmount,
                    'total_amount' => max(0, $totalAmount),
                    'notes' => $request->input('notes', ''),
                ]);

                // Create order items and deduct stock
                foreach ($orderItems as $oi) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $oi['product']->id,
                        'product_name' => $oi['product']->name,
                        'product_sku' => $oi['product']->sku,
                        'product_price' => $oi['product']->price,
                        'quantity' => $oi['quantity'],
                        'unit_price' => $oi['unit_price'],
                        'total_price' => $oi['item_total'],
                        'tax_details' => json_encode([
                            'tax_name' => $oi['tax_name'],
                            'tax_percentage' => $oi['tax_percentage'],
                            'tax_amount' => $oi['tax_amount'],
                        ]),
                    ]);

                    // Deduct stock
                    $oi['product']->decrement('stock', $oi['quantity']);
                }

                return $order;
            });

            // Load items for receipt
            $order->load('items');

            return response()->json([
                'success' => true,
                'message' => 'Sale completed successfully',
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'subtotal' => (float) $order->subtotal,
                    'tax_amount' => (float) $order->tax_amount,
                    'discount_amount' => (float) $order->discount_amount,
                    'total_amount' => (float) $order->total_amount,
                    'payment_method' => $order->payment_method,
                    'customer_name' => $order->customer_first_name,
                    'items' => $order->items->map(function ($item) {
                        return [
                            'name' => $item->product_name,
                            'sku' => $item->product_sku,
                            'quantity' => $item->quantity,
                            'unit_price' => (float) $item->unit_price,
                            'total_price' => (float) $item->total_price,
                        ];
                    }),
                    'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('POS sale failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get POS sales history for today.
     */
    public function salesHistory(Request $request)
    {
        $user = Auth::user();
        $store = Store::where('user_id', $user->id)->first();

        if (!$store) {
            return response()->json(['error' => 'No store found'], 404);
        }

        $date = $request->input('date', today()->toDateString());

        $orders = Order::where('store_id', $store->id)
            ->where('order_type', 'pos')
            ->whereDate('created_at', $date)
            ->with('items')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => (float) $order->total_amount,
                    'payment_method' => $order->payment_method,
                    'customer_name' => $order->customer_first_name,
                    'items_count' => $order->items->sum('quantity'),
                    'created_at' => $order->created_at->format('H:i:s'),
                ];
            });

        $summary = [
            'count' => $orders->count(),
            'total' => $orders->sum('total_amount'),
        ];

        return response()->json([
            'orders' => $orders,
            'summary' => $summary,
        ]);
    }
}
