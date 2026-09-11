<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('surname')->nullable()->after('name');
            $table->string('phone')->nullable()->after('email');
            $table->date('date_of_birth')->nullable()->after('phone');
            $table->string('address_street')->nullable()->after('date_of_birth');
            $table->string('address_city')->nullable()->after('address_street');
            $table->string('address_country')->nullable()->after('address_city');
            $table->string('address_postcode')->nullable()->after('address_country');
            $table->boolean('terms_accepted')->default(false)->after('address_postcode');
            $table->timestamp('terms_accepted_at')->nullable()->after('terms_accepted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'surname',
                'phone',
                'date_of_birth',
                'address_street',
                'address_city',
                'address_country',
                'address_postcode',
                'terms_accepted',
                'terms_accepted_at',
            ]);
        });
    }
};
