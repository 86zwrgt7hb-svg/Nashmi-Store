<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TrialWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userName;
    public $planName;
    public $trialEndDate;
    public $dashboardUrl;

    public function __construct($userName, $planName, $trialEndDate, $dashboardUrl = null)
    {
        $this->userName = $userName;
        $this->planName = $planName;
        $this->trialEndDate = $trialEndDate;
        $this->dashboardUrl = $dashboardUrl ?? url('/dashboard');
    }

    public function build()
    {
        return $this->subject('مرحباً بك في التجربة المجانية! - Welcome to Your Free Trial!')
                    ->view('emails.trial-welcome')
                    ->with([
                        'userName' => $this->userName,
                        'planName' => $this->planName,
                        'trialEndDate' => $this->trialEndDate,
                        'dashboardUrl' => $this->dashboardUrl,
                    ]);
    }
}
