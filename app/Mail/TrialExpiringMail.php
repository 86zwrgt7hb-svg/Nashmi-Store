<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TrialExpiringMail extends Mailable
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
        return $this->subject('تجربتك تنتهي غداً - Your Trial Expires Tomorrow')
                    ->view('emails.trial-expiring')
                    ->with([
                        'userName' => $this->userName,
                        'planName' => $this->planName,
                        'upgradeUrl' => $this->upgradeUrl,
                    ]);
    }
}
