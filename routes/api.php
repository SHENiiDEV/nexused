<?php

use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

// Wallet & Checkout APIs
Route::post('/wallet/topup', [PaymentController::class, 'topup'])->name('api.wallet.topup');
Route::post('/checkout', [PaymentController::class, 'checkout'])->name('api.checkout');

// Payment polling status and invoice download
Route::get('/payments/orders/{ref}/status', [PaymentController::class, 'status'])->name('api.payments.orders.status');
Route::get('/payments/orders/{ref}/invoice', [PaymentController::class, 'invoice'])->name('api.payments.orders.invoice');
