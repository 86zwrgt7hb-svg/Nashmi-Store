<?php
use Illuminate\Support\Facades\Route;
// All API routes are automatically rate-limited via the api middleware group
// Custom rate limiters are defined in AppServiceProvider

// Review API routes (public - store frontend)
Route::prefix("reviews")->group(function () {
    Route::get("/product/{productId}", [\App\Http\Controllers\Api\ReviewController::class, "getProductReviews"]);
    Route::post("/", [\App\Http\Controllers\Api\ReviewController::class, "store"]);
    Route::get("/store/{storeSlug}", [\App\Http\Controllers\Api\ReviewController::class, "getStoreRating"]);
});
