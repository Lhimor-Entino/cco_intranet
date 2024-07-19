<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Team;
use App\Models\TeamHistory;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $team_leads = User::where('position','like','%lead%')->get();
        foreach($team_leads as $team_lead){
            $team=Team::create([
                'user_id'=>$team_lead->id,
                'name'=>'Team '.$team_lead->first_name
            ]);
            $team_lead->update([
                'team_id'=>$team->id
            ]);
        }

        foreach($team_leads as $team_lead){
            $project_id = $team_lead->project_id;
            $agents = User::where('position','not like','%lead%')
                ->where('position','not like','%manage%')
                ->where('position','not like','%super%')
                ->where('project_id',$project_id)
                ->get();
            foreach($agents as $agent){
                $team_id=Team::where('user_id',$team_lead->id)->first()->id;
                $agent->update([
                    'team_id'=>$team_id
                ]);
                TeamHistory::create([
                    'team_id'=>$team_id,
                    'user_id'=>$agent->id,
                    'start_date'=>now()
                ]);
            }
        }

        
    }
}
