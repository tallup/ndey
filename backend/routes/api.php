<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\DeliveryLocationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);
    Route::get('/delivery-locations', [DeliveryLocationController::class, 'index']);
    Route::get('/delivery-locations/{id}/fee', [DeliveryLocationController::class, 'calculateFee']);

    // Order routes
    Route::post('/orders', [\App\Http\Controllers\Api\OrderController::class, 'store']);
    Route::get('/orders/{id}', [\App\Http\Controllers\Api\OrderController::class, 'show']);

    // Protected routes (add authentication middleware later)
    // Route::middleware('auth:sanctum')->group(function () {
    //     // User-specific routes
    // });
});

