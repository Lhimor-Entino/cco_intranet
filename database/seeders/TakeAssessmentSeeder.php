<?php

namespace Database\Seeders;

use App\Models\TrainingAssessment;
use App\Models\TrainingAssessmentResult;
use App\Models\TrainingAssessmentResultAnswer;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Seeder;

class TakeAssessmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //random 50 users
        $users = User::inRandomOrder()->limit(50)->get();
        $faker = Factory::create();
        foreach($users as $user){
            $assessment = TrainingAssessment::inRandomOrder()->first();            
            $max_score = $assessment->questions->sum('points');
            $result = TrainingAssessmentResult::create([
                'training_assessment_id'=>$assessment->id,
                'user_id'=>$user->id,
                'max_score'=>$max_score,
                'user_score'=>0,
                'passing_score'=>$assessment->pass_score,
            ]);
            
            $total_score=0;
            $questions = $assessment->questions;
            foreach ($questions as $question){
                $score=0;
                $answer = '';
                $correct_answer=$question->question_type==5?'':$question->answer;
                if($question->question_type==1){
                    $choices = $question->choices->pluck('choice')->toArray();
                    $answer = $faker->randomElement($choices);
                    $score = $question->answer === $answer?$question->points:0;
                }

                if($question->question_type==2){
                    $correctAnswers = explode('|',$question->answer);
                    $userAnswers = $faker->randomElements($correctAnswers,2);
                    $score = count(array_intersect($userAnswers,$correctAnswers));
                    $answer = implode('|',$userAnswers);
                }

                if($question->question_type==3){
                    $correct_answer = $question->answer;
                    $answer = $faker->randomElement([$correct_answer,$faker->word()]);
                    $score = $correct_answer == $answer?$question->points:0;
                }

                if($question->question_type==4){      
                    $items = $question->enum_items->pluck('item')->toArray();
                    
                    $userAnswers = $faker->randomElements($items,2);
                    
                    $score = count(array_intersect($userAnswers,$items));
                    $correct_answer = implode('|',$items);
                    $answer = implode('|',$userAnswers);
                }

                TrainingAssessmentResultAnswer::create([
                    'training_assessment_result_id'=>$result->id,
                    'question_type'=>$question->question_type,
                    'question'=>$question->question,
                    'correct_answer'=>$correct_answer,
                    'user_answer'=>$question->question_type==5?'':$answer,
                    'score'=>$question->question_type==5?0:$score,
                    'points'=>$question->points,
                    'needs_manual_check'=>$question->question_type==5?1:0,
                ]);
                $total_score+=$score;
            }
            $result->update([
                'user_score'=>$total_score,
            ]);
        }
    }
}
