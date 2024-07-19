<?php

namespace Database\Seeders;

use App\Models\TrainingAssessment;
use App\Models\TrainingAssessmentEnumItem;
use App\Models\TrainingAssessmentQuestion;
use App\Models\TrainingAssessmentQuestionChoice;
use App\Models\TrainingSubFolder;
use App\Models\User;
use Illuminate\Database\Seeder;

class AssessmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /*        
            export const questionTypes = [
                {id:1,description:'Multiple Choice'},
                {id:2,description:'Multiple Answers'},
                {id:3,description:'Type the Answer'},
                {id:4,description:'Enumeration'},
                {id:5,description:'Essay'},
            ]
        */
        /*
            Create 10 assessments, each with 10 questions, 2 of each type
            Points:
            Multiple Choice - 1
            Multiple Answers - 2
            Type the Answer - 1
            Enumeration - 1 per item
            Essay - 10
        */
        for($i=0;$i<10;$i++){
            $assessment = TrainingAssessment::create([
                //random user and sub folder
                'user_id'=>User::all()->random()->id,
                'training_sub_folder_id'=>TrainingSubFolder::all()->random()->id,
                'title'=>'Assessment '.($i+1),
                'max_score'=>0,
                'pass_score'=>0,
            ]);
            $max_score = 0;
            for($j=0;$j<5;$j++){
                $questionType = $j+1;
                if($questionType==1){
                    $points1 = 1;
                    $question1=['question'=>'What is the capital of France?','choices'=>['Paris','London','Berlin','Madrid']];
                    $answer1 = 'Paris';
                    $new_question = TrainingAssessmentQuestion::create([
                        'training_assessment_id'=>$assessment->id,
                        'question'=>$question1['question'],
                        'points'=>$points1,
                        'answer'=>$answer1,
                        'question_type'=>$questionType,
                    ]);
                    foreach($question1['choices'] as $choice){
                        TrainingAssessmentQuestionChoice::create([
                            'training_assessment_question_id'=>$new_question->id,
                            'choice'=>$choice,
                        ]);
                    }
                    $max_score += $points1;
                    $points2 = 1;
                    $question2=['question'=>'What is the capital of Germany?','choices'=>['Paris','London','Berlin','Madrid']];
                    $answer2 = 'Berlin';
                    $new_question = TrainingAssessmentQuestion::create([
                        'training_assessment_id'=>$assessment->id,
                        'question'=>$question2['question'],
                        'points'=>$points2,
                        'answer'=>$answer2,
                        'question_type'=>$questionType,
                    ]);
                    foreach($question2['choices'] as $choice){
                        TrainingAssessmentQuestionChoice::create([
                            'training_assessment_question_id'=>$new_question->id,
                            'choice'=>$choice,
                        ]);
                    }
                    $max_score += $points2;
                }
                if($questionType==2){
                    $points1 = 2;
                    $question1=['question'=>'Which of the following are European countries?','choices'=>['France','Japan','Germany','China']];
                    $answer1 = ['France','Germany'];
                    $new_question = TrainingAssessmentQuestion::create([
                        'training_assessment_id'=>$assessment->id,
                        'question'=>$question1['question'],
                        'points'=>$points1,
                        'answer'=>implode('|',$answer1),
                        'question_type'=>$questionType,
                    ]);
                    foreach($question1['choices'] as $choice){
                        TrainingAssessmentQuestionChoice::create([
                            'training_assessment_question_id'=>$new_question->id,
                            'choice'=>$choice,
                        ]);
                    }
                    $max_score += $points1;                    
                    $points2 = 2;
                    $question2=['question'=>'Which of the following are Asian countries?','choices'=>['France','Japan','Germany','China']];
                    $answer2 = ['Japan','China'];
                    $new_question = TrainingAssessmentQuestion::create([
                        'training_assessment_id'=>$assessment->id,
                        'question'=>$question2['question'],
                        'points'=>$points2,
                        'answer'=>implode('|',$answer2),
                        'question_type'=>$questionType,
                    ]);
                    foreach($question2['choices'] as $choice){
                        TrainingAssessmentQuestionChoice::create([
                            'training_assessment_question_id'=>$new_question->id,
                            'choice'=>$choice,
                        ]);
                    }
                    $max_score += $points2;                    
                }
                if($questionType==3){
                    $points1 = 1;
                    $question1=['question'=>'What is the capital of Spain?','answer'=>'Madrid'];
                    $new_question = TrainingAssessmentQuestion::create([
                        'training_assessment_id'=>$assessment->id,
                        'question'=>$question1['question'],
                        'points'=>$points1,
                        'answer'=>$question1['answer'],
                        'question_type'=>$questionType,
                    ]);
                    $max_score += $points1;
                    $points2 = 1;
                    $question2=['question'=>'What is the capital of Italy?','answer'=>'Rome'];
                    $new_question = TrainingAssessmentQuestion::create([
                        'training_assessment_id'=>$assessment->id,
                        'question'=>$question2['question'],
                        'points'=>$points2,
                        'answer'=>$question2['answer'],
                        'question_type'=>$questionType,
                    ]);
                    $max_score += $points2;
                }
                if($questionType==4){
                    $points1 = 3;
                    $question1 ='What are the 3 primary colors?';
                    $items1 = ['Red','Green','Blue'];
                    $new_question = TrainingAssessmentQuestion::create([
                        'training_assessment_id'=>$assessment->id,
                        'question'=>$question1,
                        'points'=>$points1,
                        'answer'=>'',
                        'question_type'=>$questionType,
                    ]);
                    foreach($items1 as $item){
                        TrainingAssessmentEnumItem::create([
                            'training_assessment_question_id'=>$new_question->id,
                            'item'=>$item,
                        ]);
                    }
                    $max_score += $points1;
                    $points2 = 7;
                    $question2 ='What are the 7 continents?';
                    $items2 = ['Africa','Antarctica','Asia','Australia','Europe','North America','South America'];
                    $new_question = TrainingAssessmentQuestion::create([
                        'training_assessment_id'=>$assessment->id,
                        'question'=>$question2,
                        'points'=>$points2,
                        'answer'=>'',
                        'question_type'=>$questionType,
                    ]);
                    foreach($items2 as $item){
                        TrainingAssessmentEnumItem::create([
                            'training_assessment_question_id'=>$new_question->id,
                            'item'=>$item,
                        ]);
                    }
                    $max_score += $points2;
                }
                if($questionType==5){
                    $points1 = 10;
                    $question1 = 'Write a short essay on the importance of education';
                    $new_question = TrainingAssessmentQuestion::create([
                        'training_assessment_id'=>$assessment->id,
                        'question'=>$question1,
                        'points'=>$points1,
                        'answer'=>'',
                        'question_type'=>$questionType,
                    ]);
                    $max_score += $points1;
                    $points2 = 10;
                    $question2 = 'Write a short essay on the importance of technology';
                    $new_question = TrainingAssessmentQuestion::create([
                        'training_assessment_id'=>$assessment->id,
                        'question'=>$question2,
                        'points'=>$points2,
                        'answer'=>'',
                        'question_type'=>$questionType,
                    ]);
                    $max_score += $points2;
                }
            }
            //passings score = 70% of max score
            $assessment->update([
                'max_score'=>$max_score,
                'pass_score'=>round($max_score*0.7),
            ]);
            $all_questions = TrainingAssessmentQuestion::where('training_assessment_id',$assessment->id)->get();
            foreach($all_questions as $question){
                $question->update([
                    'question'=>'{"c119729b-a0d1-47c9-9c54-fe6e5697e66c":{"id":"c119729b-a0d1-47c9-9c54-fe6e5697e66c","value":[{"id":"4648310b-e01c-4ec4-8589-12e1c1aa2749","type":"paragraph","children":[{"text":"'.$question->question.'"}],"props":{"nodeType":"block"}}],"type":"Paragraph","meta":{"order":0,"depth":0}}}',
                ]);
            }
        }
        
    }
}
