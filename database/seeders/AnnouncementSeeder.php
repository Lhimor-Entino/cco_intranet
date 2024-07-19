<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $images = [
            'https://mdbcdn.b-cdn.net/img/new/standard/city/018.jpg',
            'https://mdbcdn.b-cdn.net/img/new/standard/city/032.jpg',
            'https://mdbcdn.b-cdn.net/img/new/standard/city/059.jpg',
            null
        ];
        $faker = Factory::create();
        for($i=0; $i<28; $i++){
            Announcement::create([
                'title' => $faker->sentence(),
                'content' => $faker->paragraph(),
                'user_id' => User::all()->random()->id,
                'image' => $faker->randomElement($images),
                'status'=>1
            ]);
        }
    }
}
