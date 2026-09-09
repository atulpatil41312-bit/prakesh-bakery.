<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        "category_id",
        "name",
        "slug",
        "description",
        "price",
        "unit",
        "badge",
        "prep_time_minutes",
        "image_path",
        "is_eggless",
        "is_available",
    ];

    protected $casts = [
        "price" => "decimal:2",
        "is_eggless" => "boolean",
        "is_available" => "boolean",
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
