<?php

namespace Database\Seeders;

use App\Models\DeliveryLocation;
use Illuminate\Database\Seeder;

class DeliveryLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Store location is in Lamin, so prices are relative to distance from Lamin
        $villages = [
            ['name' => 'Lamin', 'fee' => 150], // Store location - minimum price
            ['name' => 'Brikama', 'fee' => 160], // Close to Lamin
            ['name' => 'Busumbala', 'fee' => 160], // Close to Lamin
            ['name' => 'Yundum', 'fee' => 165], // Near Lamin
            ['name' => 'Abuko', 'fee' => 170], // Near Lamin
            ['name' => 'Serekunda', 'fee' => 170], // Medium distance
            ['name' => 'Kanifing', 'fee' => 170], // Medium distance
            ['name' => 'Bakoteh', 'fee' => 170], // Medium distance
            ['name' => 'Manjai', 'fee' => 170], // Medium distance
            ['name' => 'Latrikunda', 'fee' => 170], // Medium distance
            ['name' => 'Tallinding', 'fee' => 170], // Medium distance
            ['name' => 'Bundung', 'fee' => 170], // Medium distance
            ['name' => 'Ebo Town', 'fee' => 170], // Medium distance
            ['name' => 'Kombo North', 'fee' => 175], // Medium distance
            ['name' => 'Kombo Central', 'fee' => 175], // Medium distance
            ['name' => 'Bakau', 'fee' => 180], // Further from Lamin
            ['name' => 'Fajara', 'fee' => 180], // Further from Lamin
            ['name' => 'Kololi', 'fee' => 180], // Further from Lamin
            ['name' => 'Kotu', 'fee' => 180], // Further from Lamin
            ['name' => 'Brusubi', 'fee' => 185], // Further from Lamin
            ['name' => 'Bijilo', 'fee' => 185], // Further from Lamin
            ['name' => 'Sukuta', 'fee' => 190], // Further from Lamin
            ['name' => 'Kerr Serign', 'fee' => 190], // Further from Lamin
            ['name' => 'Kombo South', 'fee' => 195], // Further from Lamin
            ['name' => 'Brufut', 'fee' => 200], // Far from Lamin
            ['name' => 'Tanji', 'fee' => 210], // Far from Lamin
            ['name' => 'Tujereng', 'fee' => 210], // Far from Lamin
            ['name' => 'Gunjur', 'fee' => 220], // Very far from Lamin
            ['name' => 'Kartong', 'fee' => 230], // Furthest from Lamin
        ];

        foreach ($villages as $village) {
            DeliveryLocation::updateOrCreate(
                ['name' => $village['name']],
                [
                    'region' => 'West Coast',
                    'delivery_fee' => $village['fee'],
                    'is_active' => true,
                ]
            );
        }
    }
}
