<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\DeliverySetting;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderCheckoutController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $payload = $request->validate([
            "customer_name" => ["required", "string", "max:255"],
            "phone" => ["required", "string", "max:20"],
            "delivery_date" => ["required", "date"],
            "delivery_slot" => ["required", "string", "max:255"],
            "distance_km" => ["required", "numeric", "min:0"],
            "delivery_address" => ["required", "string"],
            "notes" => ["nullable", "string"],
            "items" => ["required", "array", "min:1"],
            "items.*.product_id" => ["required", "exists:products,id"],
            "items.*.product_name" => ["required", "string"],
            "items.*.unit_price" => ["required", "numeric", "min:0"],
            "items.*.quantity" => ["required", "integer", "min:1"],
        ]);

        $settings = DeliverySetting::first();
        $freeRadius = (float) ($settings?->free_delivery_radius_km ?? 5);
        $chargePerKm = (float) ($settings?->charge_per_extra_km ?? 18);
        $subtotal = collect($payload["items"])->sum(fn ($item) => $item["unit_price"] * $item["quantity"]);
        $extraDistance = max(0, (float) $payload["distance_km"] - $freeRadius);
        $deliveryFee = ceil($extraDistance) * $chargePerKm;

        $order = DB::transaction(function () use ($payload, $subtotal, $deliveryFee) {
            $customer = Customer::query()->updateOrCreate(
                ["phone" => $payload["phone"]],
                [
                    "name" => $payload["customer_name"],
                    "whatsapp_number" => $payload["phone"],
                    "default_address" => $payload["delivery_address"],
                ]
            );

            $order = Order::query()->create([
                "order_number" => "PB-" . strtoupper(Str::random(6)),
                "customer_id" => $customer->id,
                "delivery_type" => "delivery",
                "delivery_date" => $payload["delivery_date"],
                "delivery_slot" => $payload["delivery_slot"],
                "distance_km" => $payload["distance_km"],
                "delivery_address" => $payload["delivery_address"],
                "subtotal" => $subtotal,
                "delivery_fee" => $deliveryFee,
                "total" => $subtotal + $deliveryFee,
                "status" => Order::STATUS_PENDING,
                "notes" => $payload["notes"] ?? null,
            ]);

            $order->items()->createMany(
                collect($payload["items"])->map(fn ($item) => [
                    "product_id" => $item["product_id"],
                    "product_name" => $item["product_name"],
                    "unit_price" => $item["unit_price"],
                    "quantity" => $item["quantity"],
                    "line_total" => $item["unit_price"] * $item["quantity"],
                ])->all()
            );

            return $order->load(["customer", "items"]);
        });

        return response()->json([
            "message" => "Order placed successfully.",
            "order" => $order,
        ], 201);
    }
}
