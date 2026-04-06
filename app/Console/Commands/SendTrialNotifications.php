<?php

namespace App\Console\Commands;

use App\Mail\TrialExpiringMail;
use App\Mail\TrialEndedMail;
use App\Models\User;
use App\Services\MailConfigService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendTrialNotifications extends Command
{
    protected $signature = 'trial:send-notifications';
    protected $description = 'Send trial expiring (24h warning) and trial ended email notifications';

    public function handle()
    {
        $this->info('Checking for trial notifications to send...');

        // Configure mail
        $mailConfigured = MailConfigService::setDynamicConfig();
        if (!$mailConfigured) {
            $this->error('Mail not configured. Skipping trial notifications.');
            return;
        }

        $now = now();

        // 1. Send "Trial Expiring Tomorrow" emails
        $expiringUsers = User::where('type', 'company')
            ->whereIn('is_trial', ['yes', '1'])
            ->whereNotNull('trial_expire_date')
            ->whereDate('trial_expire_date', $now->copy()->addDay()->toDateString())
            ->get();

        foreach ($expiringUsers as $user) {
            try {
                // Check if we already sent this notification (use cache to prevent duplicates)
                $cacheKey = 'trial_expiring_email_' . $user->id;
                if (\Cache::has($cacheKey)) {
                    continue;
                }

                $planName = $user->plan ? $user->plan->name : 'Pro';

                Mail::to($user->email)
                    ->send(new TrialExpiringMail(
                        $user->name,
                        $planName
                    ));

                // Mark as sent for 48 hours
                \Cache::put($cacheKey, true, 48 * 60 * 60);

                $this->info("Trial expiring email sent to: {$user->email}");
                Log::info('Trial expiring email sent', ['user_id' => $user->id, 'email' => $user->email]);
            } catch (\Exception $e) {
                $this->error("Failed to send trial expiring email to {$user->email}: {$e->getMessage()}");
                Log::error('Failed to send trial expiring email', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        // 2. Send "Trial Ended" emails (users whose trial just ended today)
        $endedUsers = User::where('type', 'company')
            ->where('trial_used', true)
            ->whereIn('is_trial', ['no', '0'])
            ->whereNotNull('trial_expire_date')
            ->whereDate('trial_expire_date', $now->copy()->subDay()->toDateString())
            ->get();

        foreach ($endedUsers as $user) {
            try {
                $cacheKey = 'trial_ended_email_' . $user->id;
                if (\Cache::has($cacheKey)) {
                    continue;
                }

                $planName = 'Pro'; // The plan they were on during trial

                Mail::to($user->email)
                    ->send(new TrialEndedMail(
                        $user->name,
                        $planName
                    ));

                // Mark as sent for 7 days
                \Cache::put($cacheKey, true, 7 * 24 * 60 * 60);

                $this->info("Trial ended email sent to: {$user->email}");
                Log::info('Trial ended email sent', ['user_id' => $user->id, 'email' => $user->email]);
            } catch (\Exception $e) {
                $this->error("Failed to send trial ended email to {$user->email}: {$e->getMessage()}");
                Log::error('Failed to send trial ended email', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        $this->info("Trial notifications check complete. Expiring: {$expiringUsers->count()}, Ended: {$endedUsers->count()}");
    }
}
