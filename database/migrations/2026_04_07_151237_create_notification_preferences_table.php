<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('store_id')->nullable();
            $table->boolean('email_new_order')->default(true);
            $table->boolean('email_order_status')->default(true);
            $table->boolean('email_low_stock')->default(true);
            $table->boolean('email_new_review')->default(true);
            $table->boolean('push_new_order')->default(true);
            $table->boolean('push_order_status')->default(true);
            $table->boolean('push_low_stock')->default(true);
            $table->boolean('push_new_review')->default(true);
            $table->integer('low_stock_threshold')->default(5);
            $table->timestamps();

            $table->index(['user_id', 'store_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_preferences');
    }
};
