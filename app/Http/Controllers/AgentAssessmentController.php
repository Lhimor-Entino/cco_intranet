<?php

namespace App\Http\Controllers;

use App\Models\TrainingAssessment;
use App\Models\TrainingAssessmentLink;
use App\Models\TrainingAssessmentQuestion;
use App\Models\TrainingAssessmentResult;
use App\Models\TrainingAssessmentResultAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AgentAssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $assessment = TrainingAssessment::findOrFail($request->training_assessment_id);
        $max_score = $assessment->questions->sum('points');
        $result = TrainingAssessmentResult::create([
            'training_assessment_id'=>$assessment->id,
            'user_id'=>Auth::user()->id,
            'max_score'=>$max_score,
            'user_score'=>0,
            'passing_score'=>$assessment->pass_score,
        ]);
        $total_score=0;
        foreach($request->userAnswers as $userAnswer){
            
            $score=0;
            $question = TrainingAssessmentQuestion::find($userAnswer['question_id']);
            
            $correct_answer=$question->question_type==5?'':$question->answer;
            if($question->question_type==1){
                $score = $question->answer === $userAnswer['answer']?$question->points:0;
            }

            if($question->question_type==2){
                $userAnswers = explode('|',$userAnswer['answer']);
                $correctAnswers = explode('|',$question->answer);
                //intersect userAnswers and correctAnswers - the number of elements in the resulting array is the score
                $score = count(array_intersect($userAnswers,$correctAnswers));
            }

            if($question->question_type==3){
                //match the user answer with the correct answer, turn both into lowercase, remove spaces and remove return carriage
                $score = strtolower(str_replace(' ','',str_replace("\n",'',$question->answer))) == strtolower(str_replace(' ','',str_replace("\n",'',$userAnswer['answer'])))?$question->points:0;
            }

            if($question->question_type==4){                
                $userAnswers = explode('|',$userAnswer['answer']);
                $items = $question->enum_items->pluck('item')->toArray();
                // turn items of $userAnswers and $items into lowercase, remove spaces and remove return carriage
                $userAnswers = array_map(function($item){
                    return strtolower(str_replace(' ','',str_replace("\n",'',$item)));
                },$userAnswers);
                $items = array_map(function($item){
                    return strtolower(str_replace(' ','',str_replace("\n",'',$item)));
                },$items);                
                //intersect userAnswers and correctAnswers - the number of elements in the resulting array is the score
                $score = count(array_intersect($userAnswers,$items));
                //turn $items into pipe separated string
                $correct_answer = implode('|',$items);
            }


            TrainingAssessmentResultAnswer::create([
                'training_assessment_result_id'=>$result->id,
                'question_type'=>$question->question_type,
                'question'=>$question->question,
                'correct_answer'=>$correct_answer,
                'user_answer'=>$userAnswer['answer'],
                'score'=>$question->question_type==5?0:$score,
                'points'=>$question->points,
                'needs_manual_check'=>$question->question_type==5?1:0,
            ]);
            $total_score+=$score;
        }
        $result->update([
            'user_score'=>$total_score,
        ]);

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($uuid)
    {
        //get link from TrainingAssessmentLink where uuid is equal to $uuid, valid_until is greater than now and archived is 0
        $link = TrainingAssessmentLink::where('uuid',$uuid)->where('valid_until','>',now())->where('archived',0)->first();
        $assessment = $link->assessment??null;
        if (!$assessment) return Inertia::render('TrainingInformationSystem/Agent/TrainingAssessmentNotFoundPage');

        //check if logged in user has already taken the assessment
        $result = TrainingAssessmentResult::where('user_id',auth()->user()->id)->where('training_assessment_id',$assessment->id)->first();
        if($result) return Inertia::render('TrainingInformationSystem/Agent/TrainingAssessmentCompletedPage',['assessment_title'=>$assessment->title]);
        //remove answer from $assessment->questions
        foreach($assessment->questions as $question){
            $question->answer = "";
        }
        //also remove enum_items from $assessment->questions
        foreach($assessment->questions as $question){
            $question->enum_items = [];
        }
        return Inertia::render('TrainingInformationSystem/Agent/TrainingAssessmentPage',['assessment'=>$link->assessment,'uuid'=>$uuid]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
