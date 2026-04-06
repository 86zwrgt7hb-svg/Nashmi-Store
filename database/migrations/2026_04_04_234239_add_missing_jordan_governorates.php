<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $countryId = 3; // Jordan
        $regionTypeId = 3; // Governorate

        $governorates = [
            ['name' => 'Tafilah', 'name_ar' => 'الطفيلة', 'code' => 'TA'],
            ['name' => 'Mafraq', 'name_ar' => 'المفرق', 'code' => 'MA_JO'], // Using MA_JO to avoid conflict with Ma'an (MA)
        ];

        foreach ($governorates as $gov) {
            DB::table('states')->updateOrInsert(
                ['name' => $gov['name'], 'country_id' => $countryId],
                [
                    'name_ar' => $gov['name_ar'],
                    'code' => $gov['code'],
                    'region_type_id' => $regionTypeId,
                    'status' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }

    public function down(): void
    {
        DB::table('states')->whereIn('name', ['Tafilah', 'Mafraq'])->where('country_id', 3)->delete();
    }
};
