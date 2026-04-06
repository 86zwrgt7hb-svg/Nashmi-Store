<?php
namespace App\Jobs;

use App\Models\User;
use App\Models\Notification;
use App\Mail\TrialWelcomeMail;
use App\Services\MailConfigService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendTrialWelcomeMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $userId;

    public function __construct($userId)
    {
        $this->userId = $userId;
    }

    public function handle(): void
    {
        $user = User::find($this->userId);
        
        if (!$user || !in_array($user->is_trial, ["yes", "1"], true)) {
            return;
        }

        // Prepare message based on user language
        if ($user->lang === "ar") {
            $title = "مبروك! 🎉";
            $message = "حصلت على هدية 7 أيام تجربة مجانية لخطة Pro. استمتع بجميع الميزات المتقدمة!";
        } else {
            $title = "Congratulations! 🎉";
            $message = "You received a gift of 7 days free trial for Pro plan. Enjoy all advanced features!";
        }

        // Create in-app notification
        Notification::create([
            "user_id" => $user->id,
            "title" => $title,
            "message" => $message,
            "type" => "trial_welcome",
            "read_at" => null,
        ]);

        // Send bilingual email
        try {
            $mailConfigured = MailConfigService::setDynamicConfig();
            if ($mailConfigured) {
                $planName = $user->plan ? $user->plan->name : 'Pro';
                $trialEndDate = $user->trial_expire_date 
                    ? \Carbon\Carbon::parse($user->trial_expire_date)->format('M d, Y')
                    : now()->addDays(7)->format('M d, Y');

                Mail::to($user->email)
                    ->send(new TrialWelcomeMail(
                        $user->name,
                        $planName,
                        $trialEndDate
                    ));

                Log::info('Trial welcome email sent', ['user_id' => $user->id, 'email' => $user->email]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to send trial welcome email', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}
