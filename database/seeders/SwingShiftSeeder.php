<?php

namespace Database\Seeders;

use App\Models\Shift;
use Illuminate\Database\Seeder;

class SwingShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Shift::create([
            'is_swing' => 1,
            'start_time' => '00:00:00',
            'end_time' => '00:00:00',
        ]);
    }
}
