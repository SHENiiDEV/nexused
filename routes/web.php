<?php

use App\Http\Controllers\AdminCourseController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\CorporateController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LearnController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

// Public catalog and courses
Route::get('/', fn () => redirect()->route('courses.index'));
Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
Route::get('/courses/{slug}', [CourseController::class, 'show'])->name('courses.show');

// Public certificate verification
Route::get('/certificates/{code}', [LearnController::class, 'certificate'])->name('certificates.show');

// Authentication & Demo quick-switch
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/demo-login/{role}', [AuthController::class, 'demoLogin'])->name('demo.login');

// Authenticated Routes
Route::middleware('auth')->group(function () {
    // SPA Course Player & Interactive Learning
    Route::get('/learn/{courseSlug}/{lessonSlug?}', [LearnController::class, 'player'])->name('learn.player');
    Route::post('/learn/lessons/{lesson}/complete', [LearnController::class, 'completeLesson'])->name('learn.completeLesson');
    Route::post('/learn/quizzes/{quiz}/submit', [LearnController::class, 'submitQuiz'])->name('learn.submitQuiz');

    // Billing & Checkout
    Route::post('/checkout', [BillingController::class, 'checkout'])->name('checkout.initiate');
    Route::get('/checkout/{gateway}/{ref}', [BillingController::class, 'process'])->name('checkout.process');
    Route::post('/checkout/transactions/{transaction}/complete-mock', [BillingController::class, 'completeMockPayment'])->name('checkout.completeMock');

    // Corporate (B2B) Portal
    Route::prefix('corporate')->name('corporate.')->group(function () {
        Route::get('/dashboard', [CorporateController::class, 'dashboard'])->name('dashboard');
        Route::post('/invite', [CorporateController::class, 'inviteEmployee'])->name('invite');
        Route::get('/invoices/{invoice}/download', [CorporateController::class, 'downloadInvoice'])->name('downloadInvoice');
        Route::get('/invoices/{invoice}/ubl', [CorporateController::class, 'exportUbl'])->name('exportUbl');
    });

    // Admin & Creator AI Studio
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/generator', [AdminCourseController::class, 'generator'])->name('generator');
        Route::post('/courses/generate', [AdminCourseController::class, 'generate'])->name('courses.generate');
        Route::get('/courses/{course}/status', [AdminCourseController::class, 'status'])->name('courses.status');
        Route::get('/transactions', [AdminCourseController::class, 'transactions'])->name('transactions');
    });
});

// Webhook Ingress (Excluded from CSRF in bootstrap/app.php)
Route::post('/webhooks/{gateway}', [WebhookController::class, 'handle'])->name('webhooks.gateway');
