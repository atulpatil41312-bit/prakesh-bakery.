<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("products", function (Blueprint $table): void {
            $table->id();
            $table->foreignId("category_id")->constrained()->cascadeOnDelete();
            $table->string("name");
            $table->string("slug")->unique();
            $table->text("description")->nullable();
            $table->decimal("price", 10, 2);
            $table->string("unit");
            $table->string("badge")->nullable();
            $table->unsignedInteger("prep_time_minutes")->default(0);
            $table->string("image_path")->nullable();
            $table->boolean("is_eggless")->default(false);
            $table->boolean("is_available")->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("products");
    }
};
