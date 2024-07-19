<?php

namespace App\Http\Controllers;

use App\Models\UserViolation;
use App\Models\UserViolationImage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ViolationController extends Controller
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
        $violation = UserViolation::create([
            'user_id' => $request->user_id,
            'violation' => $request->violation,
            'description' => $request->description,
            'date'=>Carbon::parse($request->date)->format('Y-m-d'),
        ]);

        //check if images array is not empty
        if($request->hasFile('images')){
            $violation_id = $violation->id;
            foreach($request->file('images') as $image){
                $image_name = strval($violation_id).'_'.Str::slug($image->getClientOriginalName());
                $location='uploads/violations/'.strval($violation_id).'/';
                $path=public_path($location);
                if (!file_exists($path)) {
                    File::makeDirectory($path,0777,true);
                }
                $new_image = $location.$image_name;
                $image->move($path,$new_image);
                UserViolationImage::create([
                    'user_violation_id' => $violation_id,
                    'image' => $new_image
                ]);
            }
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
        $violation = UserViolation::findOrFail($id);
        $images = UserViolationImage::where('user_violation_id',$id)->get();
        foreach($images as $image){
            @unlink(public_path($image->getAttributes()['image']));
            $image->delete();
        }
        $violation->delete();
        return redirect()->back();
    }
}
