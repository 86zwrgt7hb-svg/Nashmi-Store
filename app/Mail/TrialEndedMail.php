<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TrialEndedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userName;
    public $planName;
    public $upgradeUrl;

    public function __construct($userName, $planName, $upgradeUrl = null)
    {
        $this->userName = $userName;
        $this->planName = $planName;
        $this->upgradeUrl = $upgradeUrl ?? url('/plans');
    }

    public function build()
    {
        return $this->subject('انتهت تجربتك المجانية - Your Free Trial Has Ended')
                    ->view('emails.trial-ended')
                    ->with([
                        'userName' => $this->userName,
                        'planName' => $this->planName,
                        'upgradeUrl' => $this->upgradeUrl,
                    ]);
    }
}
