<?php

namespace App\Http\Controllers;

use App\Models\TrainingFolder;
use App\Models\TrainingFolderProject;
use App\Models\TrainingSubFolder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TrainingFolderController extends Controller
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
        $folder = TrainingFolder::create([
            'name' => $request->name,
            'user_id' => Auth::id(),
        ]);
        //loop through $request->project_ids
        foreach($request->project_ids as $project_id){
            TrainingFolderProject::create([
                'training_folder_id' => $folder->id,
                'project_id' => $project_id,
            ]);
        }

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
        $folder = TrainingFolder::findOrFail($id);
        $folder->update([
            'name' => $request->name,
        ]);

        //delete all projects from the pivot table
        $projects=TrainingFolderProject::where('training_folder_id',$folder->id)->get();
        foreach($projects as $project){
            $project->delete();
        }

        //loop through $request->project_ids
        foreach($request->project_ids as $project_id){
            TrainingFolderProject::create([
                'training_folder_id' => $folder->id,
                'project_id' => $project_id,
            ]);
        }

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
        $folder = TrainingFolder::findOrFail($id);
        $folder->delete();
        return redirect()->back();
    }

    public function sub_store(Request $request)
    {
        TrainingSubFolder::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'training_folder_id' => !$request->training_sub_folder_id?$request->training_folder_id:null,
            'training_sub_folder_id' => $request->training_sub_folder_id??null,
        ]);
        return redirect()->back();
    }

    public function sub_update(Request $request, $id)
    {
        $sub_folder = TrainingSubFolder::findOrFail($id);
        $sub_folder->update([
            'name' => $request->name,
        ]);
        return redirect()->back();
    }

    public function sub_destroy($id)
    {
        $sub_folder = TrainingSubFolder::findOrFail($id);
        $sub_folder->delete();
        return redirect()->back();
    }

}
