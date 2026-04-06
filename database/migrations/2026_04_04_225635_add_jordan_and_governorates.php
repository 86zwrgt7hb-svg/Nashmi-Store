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
        // Add Jordan to countries if not exists
        $jordan = DB::table('countries')->where('code', 'JO')->first();
        if (!$jordan) {
            DB::table('countries')->insert([
                'name' => 'Jordan',
                'code' => 'JO',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        
        $jordanId = DB::table('countries')->where('code', 'JO')->value('id');
        
        // Add region types for existing countries
        $countries = DB::table('countries')->get();
        
        foreach ($countries as $country) {
            $regionType = null;
            
            if ($country->code === 'JO') {
                // Jordan uses Governorates
                $regionType = [
                    'country_id' => $country->id,
                    'name' => 'Governorate',
                    'label_singular' => 'محافظة',
                    'label_plural' => 'محافظات',
                    'label_singular_en' => 'Governorate',
                    'label_plural_en' => 'Governorates',
                    'label_singular_ar' => 'محافظة',
                    'label_plural_ar' => 'محافظات',
                    'status' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            } elseif ($country->code === 'US') {
                // USA uses States
                $regionType = [
                    'country_id' => $country->id,
                    'name' => 'State',
                    'label_singular' => 'State',
                    'label_plural' => 'States',
                    'label_singular_en' => 'State',
                    'label_plural_en' => 'States',
                    'label_singular_ar' => 'ولاية',
                    'label_plural_ar' => 'ولايات',
                    'status' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            } elseif ($country->code === 'IN') {
                // India uses States
                $regionType = [
                    'country_id' => $country->id,
                    'name' => 'State',
                    'label_singular' => 'State',
                    'label_plural' => 'States',
                    'label_singular_en' => 'State',
                    'label_plural_en' => 'States',
                    'label_singular_ar' => 'ولاية',
                    'label_plural_ar' => 'ولايات',
                    'status' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            } elseif ($country->code === 'SA') {
                // Saudi Arabia uses Regions
                $regionType = [
                    'country_id' => $country->id,
                    'name' => 'Region',
                    'label_singular' => 'منطقة',
                    'label_plural' => 'مناطق',
                    'label_singular_en' => 'Region',
                    'label_plural_en' => 'Regions',
                    'label_singular_ar' => 'منطقة',
                    'label_plural_ar' => 'مناطق',
                    'status' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            
            if ($regionType && !DB::table('region_types')->where('country_id', $country->id)->exists()) {
                DB::table('region_types')->insert($regionType);
            }
        }
        
        // Add Jordan Governorates
        $jordanRegionTypeId = DB::table('region_types')
            ->where('country_id', $jordanId)
            ->where('name', 'Governorate')
            ->value('id');
        
        if ($jordanRegionTypeId) {
            $governorates = [
                ['name' => 'Amman', 'code' => 'AM', 'country_id' => $jordanId, 'region_type_id' => $jordanRegionTypeId],
                ['name' => 'Zarqa', 'code' => 'ZA', 'country_id' => $jordanId, 'region_type_id' => $jordanRegionTypeId],
                ['name' => 'Irbid', 'code' => 'IR', 'country_id' => $jordanId, 'region_type_id' => $jordanRegionTypeId],
                ['name' => 'Karak', 'code' => 'KA', 'country_id' => $jordanId, 'region_type_id' => $jordanRegionTypeId],
                ['name' => 'Ma\'an', 'code' => 'MA', 'country_id' => $jordanId, 'region_type_id' => $jordanRegionTypeId],
                ['name' => 'Jerash', 'code' => 'JE', 'country_id' => $jordanId, 'region_type_id' => $jordanRegionTypeId],
                ['name' => 'Ajloun', 'code' => 'AJ', 'country_id' => $jordanId, 'region_type_id' => $jordanRegionTypeId],
                ['name' => 'Madaba', 'code' => 'MD', 'country_id' => $jordanId, 'region_type_id' => $jordanRegionTypeId],
                ['name' => 'Balqa', 'code' => 'BA', 'country_id' => $jordanId, 'region_type_id' => $jordanRegionTypeId],
                ['name' => 'Aqaba', 'code' => 'AQ', 'country_id' => $jordanId, 'region_type_id' => $jordanRegionTypeId],
            ];
            
            foreach ($governorates as $gov) {
                if (!DB::table('states')->where('country_id', $jordanId)->where('code', $gov['code'])->exists()) {
                    DB::table('states')->insert(array_merge($gov, [
                        'status' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]));
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Delete Jordan governorates
        $jordanId = DB::table('countries')->where('code', 'JO')->value('id');
        if ($jordanId) {
            DB::table('states')->where('country_id', $jordanId)->delete();
        }
        
        // Delete region types
        DB::table('region_types')->delete();
        
        // Delete Jordan country
        DB::table('countries')->where('code', 'JO')->delete();
    }
};
