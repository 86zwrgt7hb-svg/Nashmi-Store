<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StoreSuspendedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $userName;
    public $storeName;
    public $upgradeUrl;

    public function __construct($userName, $storeName, $upgradeUrl = null)
    {
        $this->userName = $userName;
        $this->storeName = $storeName;
        $this->upgradeUrl = $upgradeUrl ?? url('/plans');
    }

    public function build()
    {
        return $this->subject('تم تعليق المتجر - Store Suspended')
                    ->view('emails.store-suspended')
                    ->with([
                        'userName' => $this->userName,
                        'storeName' => $this->storeName,
                        'upgradeUrl' => $this->upgradeUrl,
                    ]);
    }
}
