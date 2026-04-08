<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

/**
 * PERF-02: Cached settings service to avoid repeated database queries.
 * 
 * Replaces direct Setting::where() calls with a cached layer.
 * Cache is invalidated when settings are updated.
 */
class CachedSettingsService
{
    /**
     * Cache TTL in seconds (1 hour).
     */
    private const CACHE_TTL = 3600;

    /**
     * Get all settings for a user/store combination, cached.
     */
    public static function get(int $userId, ?int $storeId = null): array
    {
        $key = self::cacheKey($userId, $storeId);

        return Cache::remember($key, self::CACHE_TTL, function () use ($userId, $storeId) {
            return Setting::where('user_id', $userId)
                ->where('store_id', $storeId)
                ->pluck('value', 'key')
                ->toArray();
        });
    }

    /**
     * Get a single setting value, using the cached collection.
     */
    public static function getSingle(string $key, int $userId, ?int $storeId = null, $default = null)
    {
        $settings = self::get($userId, $storeId);
        return $settings[$key] ?? $default;
    }

    /**
     * Invalidate the cache for a user/store combination.
     * Call this whenever settings are updated.
     */
    public static function forget(int $userId, ?int $storeId = null): void
    {
        Cache::forget(self::cacheKey($userId, $storeId));
    }

    /**
     * Invalidate all settings cache for a user (all stores).
     */
    public static function forgetAll(int $userId): void
    {
        // Forget the global settings (store_id = null)
        Cache::forget(self::cacheKey($userId, null));

        // Forget store-specific settings
        $storeIds = \App\Models\Store::where('user_id', $userId)->pluck('id');
        foreach ($storeIds as $storeId) {
            Cache::forget(self::cacheKey($userId, $storeId));
        }
    }

    /**
     * Generate a consistent cache key.
     */
    private static function cacheKey(int $userId, ?int $storeId): string
    {
        return "settings:{$userId}:" . ($storeId ?? 'global');
    }
}
