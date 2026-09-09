<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    public const STATUS_PENDING = "pending";
    public const STATUS_ACCEPTED = "accepted";
    public const STATUS_PREPARING = "preparing";
    public const STATUS_READY = "ready";
    public const STATUS_OUT_FOR_DELIVERY = "out_for_delivery";
    public const STATUS_DELIVERED = "delivered";
    public const STATUS_CANCELLED = "cancelled";

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_ACCEPTED,
        self::STATUS_PREPARING,
        self::STATUS_READY,
        self::STATUS_OUT_FOR_DELIVERY,
        self::STATUS_DELIVERED,
        self::STATUS_CANCELLED,
    ];

    protected $fillable = [
        "order_number",
        "customer_id",
        "delivery_type",
        "delivery_date",
        "delivery_slot",
        "distance_km",
        "delivery_address",
        "subtotal",
        "delivery_fee",
        "total",
        "status",
        "otp_code",
        "notes",
        "whatsapp_message",
        "accepted_at",
        "ready_at",
        "out_for_delivery_at",
        "delivered_at",
    ];

    protected $casts = [
        "delivery_date" => "date",
        "distance_km" => "decimal:2",
        "subtotal" => "decimal:2",
        "delivery_fee" => "decimal:2",
        "total" => "decimal:2",
        "accepted_at" => "datetime",
        "ready_at" => "datetime",
        "out_for_delivery_at" => "datetime",
        "delivered_at" => "datetime",
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
