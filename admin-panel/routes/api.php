<?php

use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\OrderCheckoutController;
use App\Http\Controllers\Api\OrderTrackingController;
use Illuminate\Support\Facades\Route;

Route::get("/catalog", CatalogController::class);
Route::post("/orders", [OrderCheckoutController::class, "store"]);
Route::get("/orders/track/{phone}", [OrderTrackingController::class, "show"]);
