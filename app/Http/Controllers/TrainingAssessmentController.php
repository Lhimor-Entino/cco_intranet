<?php

namespace App\Http\Controllers;

use App\Models\TrainingAssessment;
use App\Models\TrainingAssessmentEnumItem;
use App\Models\TrainingAssessmentLink;
use App\Models\TrainingAssessmentQuestion;
use App\Models\TrainingAssessmentQuestionChoice;
use App\Models\TrainingAssessmentResult;
use App\Models\TrainingAssessmentResultAnswer;
use App\Models\TrainingFolder;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Illuminate\Support\Str;

class TrainingAssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        
        $per_page=$request->per_page;
        if(!isset($per_page)) $per_page=10;
        if($per_page=='No Limit') $per_page=TrainingAssessmentResult::count();
        if($per_page!='No Limit' && isset($per_page)) $per_page=intval($per_page);

        $remarks=$request->remarks;
        /*
            remarks:
            needs_manual_check = checked_by_id is null
            passed = user_score >= pass_score
            failed = user_score < pass_score
        */
        $user_ids = User::where(function($q) use($request){
            $q->orWhere('first_name','like','%'.$request->params.'%')
            ->orWhere('last_name','like','%'.$request->params.'%')
            ->orWhere('company_id','like','%'.$request->params.'%');
        })
        ->where('department','CCO')
        ->get()
        ->pluck('id');

        $results = TrainingAssessmentResult::when($user_ids,function($query) use($user_ids){
            $query->whereIn('user_id',$user_ids->toArray());
        })
        ->when(isset($request->dateRange['from']),function($query) use($request){
            $from=Carbon::parse($request->dateRange['from'])->format('Y-m-d');
            $to=isset($request->dateRange['to'])?Carbon::parse($request->dateRange['to'])->addDay()->format('Y-m-d'):$from;
            $query->whereBetween('created_at',[$from,$to]);
        })
        ->when($remarks || $remarks!='all',function($query) use($remarks){
            if($remarks=='needs_manual_check'){
                $query->whereNull('checked_by_id');
            }else if($remarks=='passed'){
                $query->whereColumn('user_score','>=','passing_score')->whereNotNull('checked_by_id');
            }else if($remarks=='failed'){
                $query->whereColumn('user_score','<','passing_score')->whereNotNull('checked_by_id');
            }
        })->orderBy('created_at','desc')->paginate($per_page)->withQueryString();
        
        return Inertia::render('TrainingInformationSystem/Admin/AssessmentIndex',[
            'results'=>$results,
            'remarks'=>$remarks,
            'per_page'=>$request->per_page=='No Limit'?'No Limit':strval($per_page),
            'user_filter'=>$request->params,
            'dateRange'=>$request->dateRange,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $count = (TrainingAssessment::where('training_sub_folder_id',$request->training_sub_folder_id)->count())+1;
        TrainingAssessment::create([
            'training_sub_folder_id'=>$request->training_sub_folder_id,
            'user_id'=>Auth::id(),
            'title'=>'Untitled Assessment '.strval($count),
        ]);
        return redirect()->back();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($main_folder_id,$id)
    {
        $assessment = TrainingAssessment::find($id);
        $main_folder=TrainingFolder::findOrFail($main_folder_id);
        if(!$assessment) return redirect()->route('training_info_system.admin');
        return Inertia::render('TrainingInformationSystemAdmin',['assessment'=>$assessment,'main_folder'=>$main_folder]);
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
        $assessment = TrainingAssessment::findOrFail($id);
        $assessment->update([
            'title'=>$request->title,
            'pass_score'=>$request->passing_score,
        ]);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $assessment=TrainingAssessment::findOrFail($id);
        $assessment->delete();
        return redirect()->back();
    }

    public function question_store (Request $request){
        $question_count = TrainingAssessmentQuestion::where('training_assessment_id',$request->training_assessment_id)->count();
        TrainingAssessmentQuestion::create([
            'training_assessment_id'=>$request->training_assessment_id ,
            'question'=> '{"c119729b-a0d1-47c9-9c54-fe6e5697e66c":{"id":"c119729b-a0d1-47c9-9c54-fe6e5697e66c","value":[{"id":"4648310b-e01c-4ec4-8589-12e1c1aa2749","type":"paragraph","children":[{"text":"Untitled Question '.strval($question_count+1).'"}],"props":{"nodeType":"block"}}],"type":"Paragraph","meta":{"order":"0","depth":"0"}}}',
            'answer'=>"",
            'points'=>0,
        ]);
        return redirect()->back();
    }

    public function question_update(Request $request,$id){
        $question = TrainingAssessmentQuestion::findOrFail($id);
        $correct_answer = trim($request->answer);
        //remove consecutive spaces
        $correct_answer = preg_replace('/\s+/', ' ', $correct_answer);
        
        $question->update([
            //'question'=>$question_Str,
            'answer'=>($request->questionType==4 || $request->questionType==5)?'':$correct_answer,
            'question_type'=>$request->questionType,
            'points'=>$request->points,
        ]);

        if($request->hasEditedQuestion){
            $question_Str = json_encode($request->question);
            //replace all instances of null with empty string
            $question_Str = str_replace('null', '""', $question_Str);
            $question->update([
                'question'=>$question_Str,
            ]);
        }

        
        $assessment = TrainingAssessment::findOrFail($question->training_assessment_id);
        $assessment->update([
            'pass_score'=>0,
        ]);

        //delete all choices
        $choices = TrainingAssessmentQuestionChoice::where('training_assessment_question_id',$id)->get();
        foreach($choices as $choice){
            $choice->delete();
        }
        //create new choices if question type is 1 or 2
        if($request->questionType==1 || $request->questionType==2){
            foreach($request->choices as $choice){
                TrainingAssessmentQuestionChoice::create([
                    'training_assessment_question_id'=>$id,
                    'choice'=>$choice,
                ]);
            }
        }

        //delete all enum items
        $enum_items = TrainingAssessmentEnumItem::where('training_assessment_question_id',$id)->get();
        foreach($enum_items as $enum_item){
            $enum_item->delete();
        }
        //create new enum items if question type is 4
        if($request->questionType==4){
            foreach($request->enumItems as $enum_item){
                //trim
                $item = trim($enum_item);
                //remove consecutive spaces
                $item = preg_replace('/\s+/', ' ', $item);
                //remove new lines
                $item = str_replace("\n", "", $item);
                TrainingAssessmentEnumItem::create([
                    'training_assessment_question_id'=>$id,
                    'item'=>$item,
                ]);
            }
        }


        return redirect()->back();
    }

    public function question_destroy($id){
        $question = TrainingAssessmentQuestion::findOrFail($id);
        $question->delete();
        return redirect()->back();
    }


    public function question_upload_video(Request $request,$id):string
    {
        
        $request->validate([
            'video'=>'required|mimes:mp4',
        ]);

        $video = $request->file('video') ;
        $video_name=strval($id).'_'.$this->removeSpecialChars($video->getClientOriginalName()).'.'.$video->getClientOriginalExtension();        
        $location='uploads/topic/topic_'.strval($id).'/';
        $path=public_path($location);
        if (!file_exists($path)) {
            File::makeDirectory($path,0777,true);
        }
        $new_video = $location.$video_name;
        $request->file('video')->move($path, $new_video);
        return url('/').'/public/'.$new_video;
    }

    public function question_upload_image(Request $request,$id):string
    {
        
        $request->validate([
            'image'=>'required|mimes:jpeg,png,jpg',
        ]);

        $image = $request->file('image') ;
        $image_name=strval($id).'_'.$this->removeSpecialChars($image->getClientOriginalName()).'.'.$image->getClientOriginalExtension();        
        $location='uploads/topic/topic_'.strval($id).'/';
        $path=public_path($location);
        if (!file_exists($path)) {
            File::makeDirectory($path,0777,true);
        }
        $new_image = $location.$image_name;
        $request->file('image')->move($path, $new_image);
        return url('/').'/public/'.$new_image;

    }

    public function link_store(Request $request)
    {
        $link=TrainingAssessmentLink::create([
            'user_id'=>Auth::id(),
            'training_assessment_id'=>$request->training_assessment_id,
            'uuid'=>Str::orderedUuid(),
            'valid_until'=>Carbon::parse($request->date. ' ' . $request->time),
        ]);

        return redirect()->back()->with('newLink',route('assessment.agent.show',$link->uuid));
    }

    public function manual_check(Request $request){
        DB::transaction(function () use($request) {            
            $result = TrainingAssessmentResult::findOrFail($request->result_id);
            $total_score = 0;
            foreach($request->questionAnswerScores as $questionAnswerScore){
                $answer = TrainingAssessmentResultAnswer::findOrFail($questionAnswerScore['result_answer_id']);
                $answer->update([
                    'score'=>$questionAnswerScore['score'],
                    'needs_manual_check'=>0,
                ]);
                $total_score+=$questionAnswerScore['score'];
            }
            $result->update([
                'user_score'=>$total_score,
                'date_checked'=>Carbon::now(),
                'checked_by_id'=>Auth::id(),
            ]);
        });        
        return redirect()->back();
    }


    private function removeSpecialChars($string) {
        // Use a regular expression to replace any character that is not a letter, a number, or a period with an empty string
        $newString = preg_replace('/[^a-zA-Z0-9.]/', '', $string);
        // Return the new string
        return $newString;
    }
}
