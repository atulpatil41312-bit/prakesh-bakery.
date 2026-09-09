<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("orders", function (Blueprint $table): void {
            $table->id();
            $table->string("order_number")->unique();
            $table->foreignId("customer_id")->constrained()->cascadeOnDelete();
            $table->string("delivery_type")->default("delivery");
            $table->date("delivery_date");
            $table->string("delivery_slot");
            $table->decimal("distance_km", 5, 2)->default(0);
            $table->text("delivery_address");
            $table->decimal("subtotal", 10, 2);
            $table->decimal("delivery_fee", 10, 2)->default(0);
            $table->decimal("total", 10, 2);
            $table->string("status")->default("pending");
            $table->string("otp_code", 6)->nullable();
            $table->text("notes")->nullable();
            $table->text("whatsapp_message")->nullable();
            $table->timestamp("accepted_at")->nullable();
            $table->timestamp("ready_at")->nullable();
            $table->timestamp("out_for_delivery_at")->nullable();
            $table->timestamp("delivered_at")->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("orders");
    }
};
