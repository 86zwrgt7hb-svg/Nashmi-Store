<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Convert the entire plan system from monthly/yearly subscriptions
     * to a single "Lifetime Store" plan with 7-day trial.
     */
    public function up(): void
    {
        // Step 1: Add is_lifetime column to plans table
        Schema::table('plans', function (Blueprint $table) {
            $table->boolean('is_lifetime')->default(false)->after('is_default');
        });

        // Step 2: Add is_lifetime to users table for quick checks
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_lifetime')->default(false)->after('plan_is_active');
        });

        // Step 3: Delete all existing plans
        DB::table('plans')->delete();

        // Step 4: Create the single Lifetime plan
        DB::table('plans')->insert([
            'name' => 'Lifetime Store',
            'price' => 499,
            'yearly_price' => 499,
            'duration' => 'lifetime',
            'description' => 'Own your online store forever. One-time payment, lifetime hosting, support & updates.',
            'max_stores' => 1, // 1 store per license
            'max_users_per_store' => 0, // 0 = unlimited
            'max_products_per_store' => 0, // 0 = unlimited
            'themes' => json_encode(['home-decor', 'gadgets', 'fashion', 'car-accessories', 'supermarket', 'toy-store', 'bakery']),
            'enable_custdomain' => 'on',
            'enable_custsubdomain' => 'on',
            'enable_branding' => 'off',
            'pwa_business' => 'on',
            'enable_chatgpt' => 'on',
            'enable_shipping_method' => 'on',
            'enable_pos' => 'on',
            'enable_staff_management' => 'on',
            'enable_express_checkout' => 'on',
            'enable_analytics' => 'on',
            'storage_limit' => 0, // 0 = unlimited
            'is_trial' => 'on',
            'trial_day' => 7,
            'is_plan_enable' => 'on',
            'is_default' => true,
            'is_lifetime' => true,
            'module' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Step 5: Get the new lifetime plan ID
        $lifetimePlanId = DB::table('plans')->where('is_lifetime', true)->value('id');

        // Step 6: Update all existing company users to use the lifetime plan
        // Users who had active paid plans get lifetime status
        // Users who were on free/trial get trial status
        if ($lifetimePlanId) {
            // All company users get assigned to the lifetime plan
            DB::table('users')
                ->where('type', 'company')
                ->update([
                    'plan_id' => $lifetimePlanId,
                    'plan_is_active' => 1,
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn('is_lifetime');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_lifetime');
        });
    }
};
