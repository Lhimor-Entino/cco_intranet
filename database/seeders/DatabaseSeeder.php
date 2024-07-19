<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $shifts=[
            [
                'start_time' => '19:00',
                'end_time' => '04:00'
            ],
            [
                'start_time' => '20:00',
                'end_time' => '05:00'                
            ],
            [
                'start_time' => '21:00',
                'end_time' => '06:00'
            ],
            [
                'start_time' => '22:00',
                'end_time' => '07:00'
            ],
            [
                'start_time' => '23:00',
                'end_time' => '08:00'
            ],
            [
                'start_time' => '00:00',
                'end_time' => '09:00'
            ],
            [
                'start_time' => '01:00',
                'end_time' => '10:00'
            ],
            [
                'start_time' => '02:00',
                'end_time' => '11:00'
            ]
        ];
        DB::table('shifts')->insert($shifts);
    }
}
