<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\TrainingFolder;
use App\Models\TrainingFolderProject;
use App\Models\TrainingSubFolder;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Seeder;

class FolderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $project_count = Project::count();

        if($project_count == 0){
            for($i=0; $i<30; $i++){
                Project::create([
                    'name' => 'Project ' . $i
                ]);
            }
        }

        $users = User::all();  
        $faker = Factory::create();
        for($i=0; $i<35; $i++){
            $training_folder = TrainingFolder::create([
                'name' => 'Project '.$faker->firstName(),
                'user_id' => $users->random()->id
            ]);
            //get random number of projects for the TrainingFolderProject pivot model
            $projects = Project::get()->random(rand(1, 5));
            foreach($projects as $project){
                TrainingFolderProject::create([
                    'training_folder_id' => $training_folder->id,
                    'project_id' => $project->id
                ]);
            }
            //create sub folder/s
            $sub_folder_count = rand(1, 5);
            for($j=0; $j<$sub_folder_count; $j++){
                $sub_folder = TrainingSubFolder::create([
                    'name' => 'Week '.strval($j+1),
                    'user_id' => $users->random()->id,
                    'training_folder_id' => $training_folder->id
                ]);
                $children_folder_count = rand(1, 5);
                for($k=0; $k<$children_folder_count; $k++){
                    $child=TrainingSubFolder::create([
                        'name' => 'Day '.strval($k+1),
                        'user_id' => $users->random()->id,
                        'training_sub_folder_id' => $sub_folder->id,
                        'training_folder_id' => null
                    ]);
                    $child_can_have_children = $faker->boolean();
                    if($child_can_have_children){
                        $grand_children_folder_count = rand(1, 5);
                        for($l=0; $l<$grand_children_folder_count; $l++){
                            $grand_child=TrainingSubFolder::create([
                                'name' => $faker->firstName(),
                                'user_id' => $users->random()->id,
                                'training_sub_folder_id' => $child->id,
                                'training_folder_id' => null
                            ]);                            
                            $grand_child_can_have_children = $faker->boolean();
                            if($grand_child_can_have_children){
                                $great_grand_children_folder_count = rand(1, 5);
                                for($m=0; $m<$great_grand_children_folder_count; $m++){
                                    $great_grand_child=TrainingSubFolder::create([
                                        'name' => $faker->firstName(),
                                        'user_id' => $users->random()->id,
                                        'training_sub_folder_id' => $grand_child->id,
                                        'training_folder_id' => null
                                    ]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
