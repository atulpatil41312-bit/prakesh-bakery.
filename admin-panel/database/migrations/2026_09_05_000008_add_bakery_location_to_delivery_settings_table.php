<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table("delivery_settings", function (Blueprint $table): void {
            $table->text("bakery_address")->nullable()->after("bakery_name");
            $table->decimal("bakery_latitude", 10, 7)->nullable()->after("bakery_address");
            $table->decimal("bakery_longitude", 10, 7)->nullable()->after("bakery_latitude");
        });
    }

    public function down(): void
    {
        Schema::table("delivery_settings", function (Blueprint $table): void {
            $table->dropColumn(["bakery_address", "bakery_latitude", "bakery_longitude"]);
        });
    }
};
