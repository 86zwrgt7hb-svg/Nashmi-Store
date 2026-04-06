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
        Schema::create('region_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('country_id')->constrained('countries')->onDelete('cascade');
            $table->string('name'); // e.g., 'State', 'Governorate', 'Province'
            $table->string('label_singular'); // e.g., 'State', 'محافظة'
            $table->string('label_plural'); // e.g., 'States', 'محافظات'
            $table->string('label_singular_en')->nullable(); // English singular
            $table->string('label_plural_en')->nullable(); // English plural
            $table->string('label_singular_ar')->nullable(); // Arabic singular
            $table->string('label_plural_ar')->nullable(); // Arabic plural
            $table->boolean('status')->default(true);
            $table->timestamps();
            $table->unique(['country_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('region_types');
    }
};
