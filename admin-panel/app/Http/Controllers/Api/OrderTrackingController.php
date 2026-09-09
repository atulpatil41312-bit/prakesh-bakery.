<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderTrackingController extends Controller
{
    public function show(string $phone): JsonResponse
    {
        $orders = Order::query()
            ->whereHas("customer", fn ($query) => $query->where("phone", "like", "%" . $phone . "%"))
            ->with("items")
            ->latest()
            ->get()
            ->map(function (Order $order): array {
                return [
                    "id" => $order->id,
                    "order_number" => $order->order_number,
                    "delivery_date" => optional($order->delivery_date)->format("Y-m-d"),
                    "delivery_slot" => $order->delivery_slot,
                    "status" => $order->status,
                    "otp_code" => $order->otp_code,
                    "total" => $order->total,
                    "items" => $order->items,
                ];
            });

        return response()->json([
            "data" => $orders,
        ]);
    }
}
