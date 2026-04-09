<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trial_emails', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->timestamp('trial_started_at')->nullable();
            $table->timestamp('trial_expired_at')->nullable();
            $table->timestamps();
        });

        // Seed existing company users who already used trial
        $users = \App\Models\User::where('type', 'company')
            ->whereNotNull('is_trial')
            ->get();

        foreach ($users as $user) {
            \Illuminate\Support\Facades\DB::table('trial_emails')->insertOrIgnore([
                'email' => $user->email,
                'trial_started_at' => $user->created_at,
                'trial_expired_at' => $user->trial_expire_date,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('trial_emails');
    }
};
