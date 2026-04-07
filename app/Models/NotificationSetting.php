<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationSetting extends Model
{
    use HasFactory;

    protected $fillable = [
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

    public static function getForStore($storeId)
    {
        return static::firstOrCreate(
            ['store_id' => $storeId],
            [
                'email_new_order' => true,
                'email_order_status' => true,
                'email_low_stock' => true,
                'email_new_review' => true,
                'push_new_order' => false,
                'push_order_status' => false,
                'push_low_stock' => false,
                'push_new_review' => false,
                'low_stock_threshold' => 5,
            ]
        );
    }
}
