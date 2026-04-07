<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    protected $fillable = [
        'user_id',
        'store_id',
        'email_new_order',
        'email_order_status',
        'email_low_stock',
        'email_new_review',
        'push_new_order',
        'push_order_status',
        'push_low_stock',
        'push_new_review',
        'low_stock_threshold',
    ];

    protected $casts = [
        'email_new_order' => 'boolean',
        'email_order_status' => 'boolean',
        'email_low_stock' => 'boolean',
        'email_new_review' => 'boolean',
        'push_new_order' => 'boolean',
        'push_order_status' => 'boolean',
        'push_low_stock' => 'boolean',
        'push_new_review' => 'boolean',
        'low_stock_threshold' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
