<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use App\Security\SensitiveKeys;

class EncryptSensitiveSettings extends Command
{
    protected $signature = 'settings:encrypt {--dry-run : Show what would be encrypted without making changes}';
    protected $description = 'Encrypt all existing plaintext sensitive settings in the database';

    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        $sensitiveKeys = SensitiveKeys::KEYS;

        $settings = DB::table('settings')
            ->whereIn('key', $sensitiveKeys)
            ->whereNotNull('value')
            ->where('value', '!=', '')
            ->get();

        $encrypted = 0;
        $skipped = 0;

        foreach ($settings as $setting) {
            // Check if already encrypted
            try {
                Crypt::decryptString($setting->value);
                $skipped++;
                if ($isDryRun) {
                    $this->line("  SKIP (already encrypted): [{$setting->key}] id={$setting->id}");
                }
                continue;
            } catch (\Exception $e) {
                // Not encrypted, proceed
            }

            if ($isDryRun) {
                $this->line("  WOULD ENCRYPT: [{$setting->key}] id={$setting->id}");
                $encrypted++;
                continue;
            }

            DB::table('settings')
                ->where('id', $setting->id)
                ->update(['value' => Crypt::encryptString($setting->value)]);

            $encrypted++;
            $this->line("  ENCRYPTED: [{$setting->key}] id={$setting->id}");
        }

        $this->info("Done! Encrypted: {$encrypted}, Skipped: {$skipped}");

        if ($isDryRun) {
            $this->warn('This was a dry run. No changes were made.');
        }

        return Command::SUCCESS;
    }
}
