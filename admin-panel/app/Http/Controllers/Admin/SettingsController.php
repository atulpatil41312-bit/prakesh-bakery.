<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliverySetting;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(): View
    {
        return view("admin.settings.index", [
            "settings" => DeliverySetting::first(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $payload = $request->validate([
            "bakery_name" => ["required", "string", "max:255"],
            "bakery_address" => ["nullable", "string"],
            "bakery_latitude" => ["nullable", "numeric", "between:-90,90"],
            "bakery_longitude" => ["nullable", "numeric", "between:-180,180"],
            "free_delivery_radius_km" => ["required", "numeric", "min:0"],
            "charge_per_extra_km" => ["required", "numeric", "min:0"],
            "minimum_prep_notice_hours" => ["required", "numeric", "min:0"],
            "time_slots" => ["required", "string"],
            "whatsapp_template" => ["required", "string"],
        ]);

        DeliverySetting::query()->updateOrCreate(
            ["id" => 1],
            [
                "bakery_name" => $payload["bakery_name"],
                "bakery_address" => $payload["bakery_address"] ?: null,
                "bakery_latitude" => $payload["bakery_latitude"] ?? null,
                "bakery_longitude" => $payload["bakery_longitude"] ?? null,
                "free_delivery_radius_km" => $payload["free_delivery_radius_km"],
                "charge_per_extra_km" => $payload["charge_per_extra_km"],
                "minimum_prep_notice_hours" => $payload["minimum_prep_notice_hours"],
                "time_slots" => collect(explode("\n", $payload["time_slots"]))
                    ->map(fn ($slot) => trim($slot))
                    ->filter()
                    ->values()
                    ->all(),
                "whatsapp_template" => $payload["whatsapp_template"],
            ]
        );

        return back()->with("status", "Settings updated.");
    }
}
