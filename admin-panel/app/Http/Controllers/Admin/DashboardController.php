<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\DeliverySetting;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Contracts\View\View;

class DashboardController extends Controller
{
    public function __invoke(): View
    {
        $recentOrders = Order::query()
            ->with(["customer", "items"])
            ->latest()
            ->take(6)
            ->get();

        return view("admin.dashboard", [
            "categoryCount" => Category::count(),
            "productCount" => Product::count(),
            "pendingOrders" => Order::where("status", Order::STATUS_PENDING)->count(),
            "processingOrders" => Order::whereIn("status", [
                Order::STATUS_ACCEPTED,
                Order::STATUS_PREPARING,
                Order::STATUS_READY,
                Order::STATUS_OUT_FOR_DELIVERY,
            ])->count(),
            "deliverySettings" => DeliverySetting::first(),
            "recentOrders" => $recentOrders,
        ]);
    }
}
