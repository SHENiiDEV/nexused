<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'balance')) {
            Schema::table('users', function (Blueprint $table) {
                $table->decimal('balance', 12, 2)->default(0.00)->after('email');
            });
        }

        if (! Schema::hasTable('orders')) {
            Schema::create('orders', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->string('reference')->unique()->index();
                $table->string('status')->default('pending'); // pending, paid, process_failed, cancelled
                $table->decimal('amount', 10, 2)->default(0.00);
                $table->string('currency', 3)->default('EUR');
                $table->string('payment_method')->default('card');
                $table->json('cart')->nullable();
                $table->text('hpp_url')->nullable();
                $table->string('trade_offer_id')->nullable();
                $table->string('trade_offer_status')->nullable();
                $table->timestamp('paid_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');

        if (Schema::hasColumn('users', 'balance')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('balance');
            });
        }
    }
};
