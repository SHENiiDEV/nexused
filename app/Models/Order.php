<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reference',
        'status',
        'amount',
        'currency',
        'payment_method',
        'cart',
        'hpp_url',
        'trade_offer_id',
        'trade_offer_status',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'cart' => 'array',
            'paid_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transaction(): HasOne
    {
        return $this->hasOne(Transaction::class, 'transaction_ref', 'reference');
    }

    public function isPaid(): bool
    {
        return in_array($this->status, ['paid', 'processed', 'completed']);
    }
}
