<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;
use App\Security\SensitiveKeys;

class Setting extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'store_id',
        'key',
        'value',
    ];

    /**
     * Check if a key is sensitive and should be encrypted.
     */
    private static function isSensitiveKey(string $key): bool
    {
        return in_array($key, SensitiveKeys::KEYS);
    }

    /**
     * Automatically decrypt the value when reading a sensitive setting.
     */
    public function getValueAttribute($value)
    {
        if ($value && self::isSensitiveKey($this->attributes['key'] ?? '')) {
            try {
                return Crypt::decryptString($value);
            } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                // Value is not encrypted yet (legacy data), return as-is
                return $value;
            }
        }
        return $value;
    }

    /**
     * Automatically encrypt the value when storing a sensitive setting.
     */
    public function setValueAttribute($value)
    {
        if ($value && self::isSensitiveKey($this->attributes['key'] ?? $this->key ?? '')) {
            try {
                // Check if already encrypted to avoid double encryption
                Crypt::decryptString($value);
                $this->attributes['value'] = $value;
            } catch (\Exception $e) {
                // Not encrypted yet, encrypt it
                $this->attributes['value'] = Crypt::encryptString($value);
            }
        } else {
            $this->attributes['value'] = $value;
        }
    }

    /**
     * Get the user that owns the setting.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the store that owns the setting.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get settings for user (global if store_id is null, store-specific if provided)
     */
    public static function getUserSettings($userId, $storeId = null)
    {
        return self::where('user_id', $userId)
                  ->where('store_id', $storeId)
                  ->pluck('value', 'key')
                  ->toArray();
    }

    /**
     * Get a specific setting value
     */
    public static function getSetting($key, $userId, $storeId = null, $default = null)
    {
        $setting = self::where('user_id', $userId)
                      ->where('store_id', $storeId)
                      ->where('key', $key)
                      ->first();
        
        return $setting ? $setting->value : $default;
    }

    /**
     * Set a setting value
     */
    public static function setSetting($key, $value, $userId, $storeId = null)
    {
        return self::updateOrCreate(
            ['user_id' => $userId, 'store_id' => $storeId, 'key' => $key],
            ['value' => $value]
        );
    }
}