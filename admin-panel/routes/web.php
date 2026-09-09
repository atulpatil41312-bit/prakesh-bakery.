<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SettingsController;
use Illuminate\Support\Facades\Route;

Route::redirect("/", "/admin");

Route::prefix("admin")->name("admin.")->group(function (): void {
    Route::get("/", DashboardController::class)->name("dashboard");

    Route::get("/categories", [CategoryController::class, "index"])->name("categories.index");
    Route::post("/categories", [CategoryController::class, "store"])->name("categories.store");
    Route::put("/categories/{category}", [CategoryController::class, "update"])->name("categories.update");
    Route::delete("/categories/{category}", [CategoryController::class, "destroy"])->name("categories.destroy");

    Route::get("/products", [ProductController::class, "index"])->name("products.index");
    Route::post("/products", [ProductController::class, "store"])->name("products.store");
    Route::put("/products/{product}", [ProductController::class, "update"])->name("products.update");
    Route::delete("/products/{product}", [ProductController::class, "destroy"])->name("products.destroy");

    Route::get("/orders", [OrderController::class, "index"])->name("orders.index");
    Route::get("/orders/{order}", [OrderController::class, "show"])->name("orders.show");
    Route::put("/orders/{order}/status", [OrderController::class, "updateStatus"])->name("orders.update-status");

    Route::get("/settings", [SettingsController::class, "index"])->name("settings.index");
    Route::put("/settings", [SettingsController::class, "update"])->name("settings.update");
});
