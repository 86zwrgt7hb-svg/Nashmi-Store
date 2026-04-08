<?php
require "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Store;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Str;

echo "Starting Real-World Merchant Simulation (Fixed 3)...\n";

// 1. The "Bulk Upload" Merchant (Merchant 1)
$m1 = User::where('email', 'like', 'merchant1_%')->first();
if ($m1) {
    echo "Simulating Merchant 1: Bulk Upload Stress Test...\n";
    $store = Store::where('user_id', $m1->id)->first();
    $category = Category::where('store_id', $store->id)->first();
    
    $products = [];
    for ($i = 0; $i < 50; $i++) {
        $products[] = [
            'name' => "Bulk Product $i",
            'sku' => "SKU-" . strtoupper(Str::random(6)),
            'price' => rand(10, 100),
            'category_id' => $category->id,
            'store_id' => $store->id,
            'description' => "Bulk description for product $i",
            'is_active' => 1,
            'stock' => 100,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
    Product::insert($products);
    echo "Merchant 1: 50 products uploaded via bulk simulation.\n";
}

// 2. The "Popular" Merchant (Merchant 4 - Bakery)
$m4 = User::where('email', 'like', 'merchant4_%')->first();
if ($m4) {
    echo "Simulating Merchant 4: High Traffic Order Stress Test...\n";
    $store = Store::where('user_id', $m4->id)->first();
    $product = Product::where('store_id', $store->id)->first();
    
    for ($i = 0; $i < 20; $i++) {
        $order = Order::create([
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'store_id' => $store->id,
            'customer_first_name' => "Customer $i",
            'customer_last_name' => "Test",
            'customer_email' => "customer$i@example.com",
            'shipping_address' => "Address $i",
            'subtotal' => $product->price,
            'total_amount' => $product->price,
            'payment_method' => 'cod',
            'status' => 'pending',
            'order_type' => 'store',
        ]);
        
        $item = new OrderItem();
        $item->order_id = $order->id;
        $item->product_id = $product->id;
        $item->product_name = $product->name;
        $item->product_sku = $product->sku;
        $item->product_price = $product->price;
        $item->unit_price = $product->price;
        $item->total_price = $product->price;
        $item->quantity = 1;
        $item->save();
    }
    echo "Merchant 4: 20 rapid orders simulated.\n";
}

// 3. The "Global" Merchant (Merchant 10 - Home Decor)
$m10 = User::where('email', 'like', 'merchant10_%')->first();
if ($m10) {
    echo "Simulating Merchant 10: Configuration Changes...\n";
    $store = Store::where('user_id', $m10->id)->first();
    
    // Change theme multiple times
    $themes = ['fashion', 'gadgets', 'supermarket', 'bakery'];
    foreach ($themes as $theme) {
        $store->update(['theme' => $theme]);
    }
    echo "Merchant 10: Theme switching simulation completed.\n";
}

echo "Simulation Finished.\n";
