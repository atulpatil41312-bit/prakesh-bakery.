<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("delivery_settings", function (Blueprint $table): void {
            $table->id();
            $table->string("bakery_name")->default("Prakash Bakery");
            $table->decimal("free_delivery_radius_km", 5, 2)->default(5);
            $table->decimal("charge_per_extra_km", 10, 2)->default(18);
            $table->decimal("minimum_prep_notice_hours", 5, 2)->default(2);
            $table->json("time_slots");
            $table->text("whatsapp_template");
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("delivery_settings");
    }
};
