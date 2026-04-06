<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;

class ArchiveExpiredGracePeriodStores extends Command
{
    protected $signature = 'stores:archive-expired';
    protected $description = 'Archive stores where grace period has expired (3 days after suspension)';

    public function handle()
    {
        $this->info('Checking for expired grace periods...');

        // Find users who are suspended but not yet archived, and grace period has expired (3 days)
        $users = User::where('store_suspended', true)
            ->where('store_archived', false)
            ->whereNotNull('grace_period_start')
            ->where('grace_period_start', '<=', now()->subDays(3))
            ->where('type', 'company')
            ->get();

        $archivedCount = 0;

        foreach ($users as $user) {
            // Double-check they still exceed limits
            $limitsCheck = function_exists('checkExceedsFreePlanLimits') 
                ? checkExceedsFreePlanLimits($user) 
                : ['exceeds' => true];

            if ($limitsCheck['exceeds']) {
                // Archive the stores
                if (function_exists('archiveUserStores')) {
                    archiveUserStores($user);
                }
                $archivedCount++;
                $this->info("Archived stores for user #{$user->id} ({$user->name})");
            } else {
                // User fixed their limits - unsuspend instead
                if (function_exists('unsuspendUserStores')) {
                    unsuspendUserStores($user);
                }
                $this->info("User #{$user->id} ({$user->name}) fixed limits - unsuspended");
            }
        }

        // Also check users who are suspended and check if they fixed limits
        $suspendedUsers = User::where('store_suspended', true)
            ->where('store_archived', false)
            ->where('type', 'company')
            ->get();

        foreach ($suspendedUsers as $user) {
            $limitsCheck = function_exists('checkExceedsFreePlanLimits') 
                ? checkExceedsFreePlanLimits($user) 
                : ['exceeds' => true];

            if (!$limitsCheck['exceeds']) {
                if (function_exists('unsuspendUserStores')) {
                    unsuspendUserStores($user);
                }
                $this->info("User #{$user->id} ({$user->name}) is within limits - auto-unsuspended");
            }
        }

        $this->info("Done. Archived {$archivedCount} user(s).");
        return Command::SUCCESS;
    }
}
