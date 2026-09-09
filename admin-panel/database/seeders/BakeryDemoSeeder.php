<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Category;
use App\Models\DeliverySetting;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class BakeryDemoSeeder extends Seeder
{
    public function run(): void
    {
        Admin::query()->updateOrCreate(
            ["email" => "owner@prakashbakery.test"],
            [
                "name" => "Prakash Bakery Owner",
                "phone" => "9876543210",
                "password" => Hash::make("password"),
                "is_active" => true,
            ]
        );

        DeliverySetting::query()->updateOrCreate(
            ["id" => 1],
            [
                "bakery_name" => "Prakash Bakery",
                "bakery_address" => "Civil Lines, Prayagraj, Uttar Pradesh",
                "bakery_latitude" => 25.4358,
                "bakery_longitude" => 81.8463,
                "free_delivery_radius_km" => 5,
                "charge_per_extra_km" => 18,
                "minimum_prep_notice_hours" => 2,
                "time_slots" => [
                    "08:00 AM - 10:00 AM",
                    "10:00 AM - 12:00 PM",
                    "12:00 PM - 02:00 PM",
                    "04:00 PM - 06:00 PM",
                    "06:00 PM - 08:00 PM",
                ],
                "whatsapp_template" => "Hello {{name}}, your order {{orderId}} from Prakash Bakery is accepted. Share OTP {{otp}} with the delivery partner on handover.",
            ]
        );

        $catalog = [
            "Cakes" => [
                ["Red Velvet Celebration Cake", 799, "1 kg", "Best Seller", 180],
                ["Black Forest Cake", 699, "1 kg", "Party Pick", 150],
            ],
            "Snacks" => [
                ["Veg Puff", 35, "piece", "Hot & Fresh", 25],
                ["Paneer Roll", 85, "piece", "New Arrival", 30],
            ],
            "Biscuits" => [
                ["Cashew Butter Cookies", 220, "250 g", "Gift Box", 0],
                ["Jeera Biscuit", 140, "250 g", "Tea Time", 0],
            ],
            "Breads" => [
                ["Milk Bread Loaf", 55, "loaf", "Daily Fresh", 60],
                ["Garlic Herb Bun Pack", 120, "pack of 4", "Evening Favorite", 50],
            ],
        ];

        foreach ($catalog as $categoryName => $products) {
            $category = Category::query()->updateOrCreate(
                ["slug" => Str::slug($categoryName)],
                [
                    "name" => $categoryName,
                    "description" => "Fresh " . strtolower($categoryName) . " prepared by Prakash Bakery.",
                    "is_active" => true,
                ]
            );

            foreach ($products as [$name, $price, $unit, $badge, $prepTime]) {
                Product::query()->updateOrCreate(
                    ["slug" => Str::slug($name)],
                    [
                        "category_id" => $category->id,
                        "name" => $name,
                        "description" => $name . " prepared by Prakash Bakery.",
                        "price" => $price,
                        "unit" => $unit,
                        "badge" => $badge,
                        "prep_time_minutes" => $prepTime,
                        "is_available" => true,
                    ]
                );
            }
        }
    }
}
