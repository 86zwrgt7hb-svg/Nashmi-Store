<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, add a name_ar column to states table if it doesn't exist
        if (!Schema::hasColumn('states', 'name_ar')) {
            Schema::table('states', function (Blueprint $table) {
                $table->string('name_ar')->nullable()->after('name');
            });
        }

        // Get Jordan ID
        $jordanId = DB::table('countries')->where('code', 'JO')->value('id');

        if ($jordanId) {
            // Update Jordan governorates with proper English and Arabic names
            $governorates = [
                ['code' => 'AM', 'name_en' => 'Amman', 'name_ar' => 'عمّان'],
                ['code' => 'ZA', 'name_en' => 'Zarqa', 'name_ar' => 'الزرقاء'],
                ['code' => 'IR', 'name_en' => 'Irbid', 'name_ar' => 'إربد'],
                ['code' => 'KA', 'name_en' => 'Karak', 'name_ar' => 'الكرك'],
                ['code' => 'MA', 'name_en' => "Ma'an", 'name_ar' => 'معان'],
                ['code' => 'JE', 'name_en' => 'Jerash', 'name_ar' => 'جرش'],
                ['code' => 'AJ', 'name_en' => 'Ajloun', 'name_ar' => 'عجلون'],
                ['code' => 'MD', 'name_en' => 'Madaba', 'name_ar' => 'مادبا'],
                ['code' => 'BA', 'name_en' => 'Balqa', 'name_ar' => 'البلقاء'],
                ['code' => 'AQ', 'name_en' => 'Aqaba', 'name_ar' => 'العقبة'],
            ];

            foreach ($governorates as $gov) {
                DB::table('states')
                    ->where('country_id', $jordanId)
                    ->where('code', $gov['code'])
                    ->update([
                        'name' => $gov['name_en'],
                        'name_ar' => $gov['name_ar'],
                    ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the name_ar column if it exists
        if (Schema::hasColumn('states', 'name_ar')) {
            Schema::table('states', function (Blueprint $table) {
                $table->dropColumn('name_ar');
            });
        }
    }
};
