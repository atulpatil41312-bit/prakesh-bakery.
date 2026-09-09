<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\DeliverySetting;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class CatalogController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $settings = DeliverySetting::first();

        return response()->json([
            "bakeryName" => $settings?->bakery_name ?? "Prakash Bakery",
            "settings" => [
                "freeDeliveryKm" => $settings?->free_delivery_radius_km ?? 5,
                "deliveryChargePerKm" => $settings?->charge_per_extra_km ?? 18,
                "minimumPrepNoticeHours" => $settings?->minimum_prep_notice_hours ?? 2,
                "bakeryLocation" => [
                    "label" => $settings?->bakery_name ?? "Prakash Bakery",
                    "address" => $settings?->bakery_address ?? "Dindoli, Surat, Gujarat 394210",
                    "latitude" => (float) ($settings?->bakery_latitude ?? 21.1525),
                    "longitude" => (float) ($settings?->bakery_longitude ?? 72.8752),
                ],
                "timeSlots" => $settings?->time_slots ?? [],
            ],
            "categories" => Category::query()
                ->where("is_active", true)
                ->select(["id", "name", "description"])
                ->orderBy("name")
                ->get(),
            "products" => Product::query()
                ->where("is_available", true)
                ->select([
                    "id",
                    "category_id",
                    "name",
                    "description",
                    "price",
                    "unit",
                    "badge",
                    "prep_time_minutes",
                    "is_available",
                ])
                ->orderBy("name")
                ->get(),
        ]);
    }
}
