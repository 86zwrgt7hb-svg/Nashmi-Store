<?php

namespace App\Console\Commands;

use App\Mail\TrialWelcomeMail;
use App\Mail\TrialExpiringMail;
use App\Mail\TrialEndedMail;
use App\Mail\StoreSuspendedMail;
use App\Services\MailConfigService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestBilingualEmails extends Command
{
    protected $signature = 'email:test-bilingual {email?}';
    protected $description = 'Send test bilingual emails to verify all templates';

    public function handle()
    {
        $testEmail = $this->argument('email') ?? 'moh.laham51@gmail.com';

        // Configure mail
        $mailConfigured = MailConfigService::setDynamicConfig();
        if (!$mailConfigured) {
            $this->error('Mail not configured!');
            return;
        }

        $this->info("Sending test emails to: {$testEmail}");
        $this->newLine();

        // 1. Trial Welcome
        try {
            Mail::to($testEmail)->send(new TrialWelcomeMail(
                'محمد',
                'Pro',
                now()->addDays(7)->format('M d, Y'),
                'https://ns.urdun-tech.com/dashboard'
            ));
            $this->info('1. Trial Welcome email sent');
        } catch (\Exception $e) {
            $this->error('1. Trial Welcome FAILED: ' . $e->getMessage());
        }

        sleep(2);

        // 2. Trial Expiring
        try {
            Mail::to($testEmail)->send(new TrialExpiringMail(
                'محمد',
                'Pro',
                'https://ns.urdun-tech.com/plans'
            ));
            $this->info('2. Trial Expiring email sent');
        } catch (\Exception $e) {
            $this->error('2. Trial Expiring FAILED: ' . $e->getMessage());
        }

        sleep(2);

        // 3. Trial Ended
        try {
            Mail::to($testEmail)->send(new TrialEndedMail(
                'محمد',
                'Pro',
                'https://ns.urdun-tech.com/plans'
            ));
            $this->info('3. Trial Ended email sent');
        } catch (\Exception $e) {
            $this->error('3. Trial Ended FAILED: ' . $e->getMessage());
        }

        sleep(2);

        // 4. Store Suspended
        try {
            Mail::to($testEmail)->send(new StoreSuspendedMail(
                'محمد',
                'متجر نشمي التجريبي',
                'https://ns.urdun-tech.com/plans'
            ));
            $this->info('4. Store Suspended email sent');
        } catch (\Exception $e) {
            $this->error('4. Store Suspended FAILED: ' . $e->getMessage());
        }

        $this->newLine();
        $this->info('All test emails complete! Check inbox: ' . $testEmail);
    }
}
