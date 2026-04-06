<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('store_suspended')->default(false)->after('trial_used');
            $table->timestamp('grace_period_start')->nullable()->after('store_suspended');
            $table->boolean('store_archived')->default(false)->after('grace_period_start');
            $table->timestamp('archived_at')->nullable()->after('store_archived');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['store_suspended', 'grace_period_start', 'store_archived', 'archived_at']);
        });
    }
};
