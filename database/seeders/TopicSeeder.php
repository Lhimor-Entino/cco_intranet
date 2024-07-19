<?php

namespace Database\Seeders;

use App\Models\TrainingSubFolder;
use App\Models\TrainingTopic;
use App\Models\TrainingTopicVersion;
use App\Models\User;
use Illuminate\Database\Seeder;

class TopicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /** !!IMPORTANT: MAKE SURE FolderSeeder is ran first **/

        for($i=0; $i<88;$i++){
            $sub_folder = TrainingSubFolder::all()->random();
            $user = User::all()->random();
            $topic = TrainingTopic::create([
                'title' => 'Topic ' . $sub_folder->name,
                'user_id' => $user->id,
                'training_sub_folder_id' => $sub_folder->id
            ]);
            TrainingTopicVersion::create([
                'training_topic_id'=>$topic->id,
                'user_id'=> $user->id,
                'content'=>null,
                'version'=>'0.1',
                'is_active'=>1,
            ]);
        }
    }
}
