<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliverySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        "bakery_name",
        "bakery_address",
        "bakery_latitude",
        "bakery_longitude",
        "free_delivery_radius_km",
        "charge_per_extra_km",
        "minimum_prep_notice_hours",
        "time_slots",
        "whatsapp_template",
    ];

    protected $casts = [
        "bakery_latitude" => "decimal:7",
        "bakery_longitude" => "decimal:7",
        "free_delivery_radius_km" => "decimal:2",
        "charge_per_extra_km" => "decimal:2",
        "minimum_prep_notice_hours" => "decimal:2",
        "time_slots" => "array",
    ];
}
