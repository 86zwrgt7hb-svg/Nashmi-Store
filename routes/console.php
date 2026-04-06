<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use Illuminate\Support\Facades\Schedule;

// Check for expired grace periods and archive stores daily
Schedule::command('stores:archive-expired')->daily();
// Send trial expiring and trial ended email notifications daily at 9 AM
Schedule::command("trial:send-notifications")->dailyAt("09:00");
