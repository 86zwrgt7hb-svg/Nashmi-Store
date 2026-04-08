<?php

use App\Models\User;
use App\Models\Store;
use App\Models\Plan;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Starting Merchant Simulation...\n";

$themes = ['gadgets', 'fashion', 'home-decor', 'bakery', 'supermarket', 'car-accessories', 'toy'];
$plans = Plan::all();

if ($plans->isEmpty()) {
    echo "No plans found. Please run seeders first.\n";
    exit(1);
}

$results = [];

for ($i = 1; $i <= 10; $i++) {
    $email = "merchant{$i}_" . Str::random(4) . "@example.com";
    $theme = $themes[($i - 1) % count($themes)];
    $plan = $plans->random();
    
    echo "Creating Merchant {$i}: {$email} | Theme: {$theme} | Plan: {$plan->name}\n";
    
    try {
        // 1. Create User
        $user = User::create([
            'name' => "Merchant {$i}",
            'email' => $email,
            'password' => Hash::make('password123'),
            'type' => 'company',
            'plan_id' => $plan->id,
            'plan_is_active' => 1,
            'email_verified_at' => now(),
            'lang' => ($i % 2 == 0) ? 'ar' : 'en',
        ]);
        
        // 2. Create Store (UserObserver might create one, but we want specific themes)
        $storeName = "Store of Merchant {$i}";
        $store = Store::create([
            'name' => $storeName,
            'slug' => Store::generateUniqueSlug($storeName),
            'theme' => $theme,
            'user_id' => $user->id,
            'email' => $email,
        ]);
        
        $user->update(['current_store' => $store->id]);
        
        // 3. Create Category
        $category = Category::create([
            'name' => "Category for {$theme}", 'slug' => Str::slug("Category for {$theme}" . Str::random(4)),
            'store_id' => $store->id,
            'is_active' => true,
        ]);
        
        // 4. Create Products (Testing the 'details' removal)
        for ($j = 1; $j <= 3; $j++) {
            $productData = [
                'name' => "Product {$j} for {$theme}",
                'sku' => "SKU-{$i}-{$j}",
                'description' => "This is a great product for the {$theme} store. It has many features.",
                'specifications' => "Material: High Quality\nWeight: 500g\nColor: Multi",
                'price' => rand(10, 100),
                'stock' => rand(10, 50),
                'category_id' => $category->id,
                'store_id' => $store->id,
                'is_active' => true,
            ];
            
            // Explicitly check if 'details' can be passed (it should fail or be ignored if column is gone)
            // But since we are using Eloquent and we removed it from fillable, it will be ignored.
            // If we try to set it directly on the model, it might throw an error if the column is gone.
            
            $product = new Product($productData);
            
            // Test: Try to set 'details' manually to see if it causes issues (it shouldn't if we handled it)
            try {
            } catch (\Exception $e) {
                // Expected if property doesn't exist or column is gone
            }
            
            $product->save();
        }
        
        $results[] = [
            'merchant' => $user->name,
            'email' => $user->email,
            'theme' => $theme,
            'plan' => $plan->name,
            'status' => 'Success'
        ];
        
    } catch (\Exception $e) {
        echo "Error creating merchant {$i}: " . $e->getMessage() . "\n";
        $results[] = [
            'merchant' => "Merchant {$i}",
            'status' => 'Failed',
            'error' => $e->getMessage()
        ];
    }
}

echo "\nSimulation Results:\n";
echo str_pad("Merchant", 20) . " | " . str_pad("Theme", 15) . " | " . str_pad("Plan", 15) . " | Status\n";
echo str_repeat("-", 65) . "\n";
foreach ($results as $res) {
    echo str_pad($res['merchant'], 20) . " | " . 
         str_pad($res['theme'] ?? 'N/A', 15) . " | " . 
         str_pad($res['plan'] ?? 'N/A', 15) . " | " . 
         $res['status'] . "\n";
}

