<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliverySetting;
use App\Models\Order;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class OrderController extends Controller
{
    public function index(): View
    {
        return view("admin.orders.index", [
            "orders" => Order::query()->with(["customer", "items"])->latest()->get(),
            "statuses" => Order::STATUSES,
        ]);
    }

    public function show(Order $order): View
    {
        $order->load(["customer", "items.product"]);

        return view("admin.orders.show", [
            "order" => $order,
            "statuses" => Order::STATUSES,
        ]);
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $payload = $request->validate([
            "status" => ["required", "in:" . implode(",", Order::STATUSES)],
            "otp_code" => ["nullable", "string", "max:6"],
        ]);

        $attributes = ["status" => $payload["status"]];

        if ($payload["status"] === Order::STATUS_ACCEPTED && !$order->otp_code) {
            $otp = (string) random_int(1000, 9999);
            $settings = DeliverySetting::first();
            $message = $settings?->whatsapp_template
                ? str_replace(
                    ["{{name}}", "{{orderId}}", "{{otp}}"],
                    [$order->customer->name, $order->order_number, $otp],
                    $settings->whatsapp_template
                )
                : "Your order {$order->order_number} is accepted. OTP: {$otp}";

            $attributes["otp_code"] = $otp;
            $attributes["accepted_at"] = Carbon::now();
            $attributes["whatsapp_message"] = $message;
        }

        if ($payload["status"] === Order::STATUS_READY) {
            $attributes["ready_at"] = Carbon::now();
        }

        if ($payload["status"] === Order::STATUS_OUT_FOR_DELIVERY) {
            $attributes["out_for_delivery_at"] = Carbon::now();
        }

        if ($payload["status"] === Order::STATUS_DELIVERED) {
            if (($payload["otp_code"] ?? "") !== $order->otp_code) {
                return back()->with("status", "OTP does not match this order.");
            }

            $attributes["delivered_at"] = Carbon::now();
        }

        $order->update($attributes);

        return back()->with("status", "Order status updated.");
    }
}
