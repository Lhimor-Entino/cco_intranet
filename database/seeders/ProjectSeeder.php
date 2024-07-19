<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Factory::create();
        for($i=0; $i < 10; $i++){
            Project::create([
                "name" => $faker->name(),
            ]);
        }

        $users = User::all();
        
        foreach ($users as $user){
            $user->update([
                "project_id" => Project::all()->random()->id,
            ]);
        }
    }
}
