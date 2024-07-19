<?php

namespace App\Http\Controllers;

use App\Models\TrainingFolder;
use App\Models\TrainingSubFolder;
use App\Models\TrainingTopic;
use App\Models\TrainingTopicVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class TrainingInfoSystemController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return redirect()->route('training_info_system.admin');
    }

    public function admin($id=null,$sub_folder_id=null)
    {
        if($id && !$sub_folder_id){
            $sub_folders = TrainingSubFolder::with(['topics','assessments'])->where('training_folder_id',$id)->get();
            $main_folder = TrainingFolder::findOrFail($id);
            return Inertia::render('TrainingInformationSystemAdmin',['sub_folders'=>$sub_folders,'main_folder'=>$main_folder]);
        }
        if($id && $sub_folder_id){
            $main_folder = TrainingFolder::findOrFail($id);
            $current_folder = TrainingSubFolder::with(['topics','assessments'])->where('id',$sub_folder_id)->firstOrFail();
            return Inertia::render('TrainingInformationSystemAdmin',['topics'=>$current_folder->topics,'sub_folders'=>$current_folder->children,'main_folder'=>$main_folder,'current_folder'=>$current_folder]);
        }
        $main_folders = TrainingFolder::get();
        return Inertia::render('TrainingInformationSystemAdmin',['main_folders'=>$main_folders]);
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
        //topic count
        $topic_count = (TrainingTopic::where('training_sub_folder_id',$request->training_sub_folder_id)->count())+1;

        $topic=TrainingTopic::create([
            'user_id'=>Auth::id(),
            'title'=>'Untitled Topic '.$topic_count,
            'training_sub_folder_id'=>$request->training_sub_folder_id,
        ]);

        TrainingTopicVersion::create([
            'training_topic_id'=>$topic->id,
            'user_id'=>Auth::id(),
            'content'=>null,
            'version'=>'0.1',
            'is_active'=>1,
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
    public function edit($id,$version  = null)
    {
        $topic = TrainingTopic::with(['current_version','user','versions'])->find($id);
        if(!$topic) return redirect()->route('training_info_system.admin');
        if(!$version){
            $version = TrainingTopic::findOrFail($id)->current_version->version;
            return redirect()->route('training_info_system.edit',['id'=>$id,'version'=>$version]);
        }
        return Inertia::render('TrainingInformationSystem/Admin/TrainingInfoEdit',['topic'=>$topic,'version'=>$version]);
    }

    public function edit2($main_folder_id,$id,$version  = null)
    {
        $topic = TrainingTopic::with(['current_version','user','versions'])->find($id);
        $main_folder=TrainingFolder::findOrFail($main_folder_id);
        if(!$topic) return redirect()->route('training_info_system.admin');
        if(!$version){
            $version = TrainingTopic::findOrFail($id)->current_version->version;
            return redirect()->route('training_info_system.edit2',['id'=>$id,'version'=>$version,'main_folder_id'=>$main_folder_id]);
        }
        return Inertia::render('TrainingInformationSystem/Admin/TrainingInfoEdit',['topic'=>$topic,'version'=>$version,'main_folder'=>$main_folder]);
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
        $topic = TrainingTopic::findOrFail($id);
        $topic->update([
            'title'=>$request->title,
            'description'=>$request->description,
        ]);
        //set all versions to is_active=0
        $topic->versions()->update(['is_active'=>0]);
        //set the selected version to is_active=1
        $topic->versions()->where('id',$request->current_version_id)->update(['is_active'=>1]);
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
        TrainingTopic::findOrFail($id)->delete();
        return redirect()->back();
    }


    public function upload_video(Request $request,$id):string
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

    public function upload_image(Request $request,$id):string
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

    public function save_draft(Request $request,$id,$version):void
    {
        $version = TrainingTopicVersion::where('training_topic_id',$id)->where('version',$version)->firstOrFail();
        $content = json_encode($request->content);
        //replace all instances of null with empty string
        $content = str_replace('null', '""', $content);
        $version->update([
            'content'=>$content,
        ]);
        return;
    } 
    
    public function save_as_new(Request $request,$id)
    {
        
        $content = json_encode($request->content);
        //replace all instances of null with empty string
        $content = str_replace('null', '""', $content);
        $new_version=TrainingTopicVersion::create([
            'training_topic_id'=>$id,
            'user_id'=>Auth::id(),
            'content'=>$content,
            'version'=>$request->version,
        ]);
        $topic = TrainingTopic::findOrFail($id);
        //set all versions to is_active=0
        $topic->versions()->update(['is_active'=>0]);
        //set the selected version to is_active=1
        $topic->versions()->where('id',$new_version->id)->update(['is_active'=>1]);
        return redirect()->back();
    } 

    private function removeSpecialChars($string) {
        // Use a regular expression to replace any character that is not a letter, a number, or a period with an empty string
        $newString = preg_replace('/[^a-zA-Z0-9.]/', '', $string);
        // Return the new string
        return $newString;
    }
    
}
