<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render('AnnouncementSettings',[
            'announcements' => Announcement::with(['user','edited_by'])->orderBy('id','desc')->get()
        ]);
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
     * Store a newly created announcement in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $announcement = Announcement::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'content' => $request->content
        ]);

        $image = $request->file('image');
        if ($image) {
            $id = $announcement->id;
            $image_name = strval($id) . '_' . Str::slug($image->getClientOriginalName());
            $location = 'uploads/announcements/announcement_' . strval($id) . '/';
            $path = public_path($location);

            if (!file_exists($path)) {
                File::makeDirectory($path, 0777, true);
            }

            $new_image = $location . $image_name;
            $request->file('image')->move($path, $new_image);

            $announcement->update([
                'image' => $new_image
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
        $request->validate([
            'title' => 'required',
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        $announcement = Announcement::findOrFail($id);
        $announcement->update([
            'edited_by_id' => $request->user()->id, // 'edited_by_id' is the foreign key of 'users' table, which is 'id
            'title' => $request->title,
            'content' => $request->content
        ]);
        $image = $request->file('image') ;
        if($image){            
            $image_name=strval($id).'_'.Str::slug($image->getClientOriginalName());
            $location='uploads/announcements/announcement_'.strval($id).'/';
            $path=public_path($location);
            if (!file_exists($path)) {
                File::makeDirectory($path,0777,true);
            }
            $new_image = $location.$image_name;
            $request->file('image')->move($path, $new_image);
            $announcement->update([
                'image'=>$new_image
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
        $announcement = Announcement::findOrFail($id);
        if($announcement->image){
            @unlink(public_path($announcement->getAttributes()['image']));
        }
        $announcement->delete();
        return redirect()->back();
    }

    /**
     * Update the status of an announcement.
     *
     * @param int $id The ID of the announcement.
     * @return \Illuminate\Http\RedirectResponse
     */
    public function status($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->update([
            'status' => $announcement->status==1?0:1
        ]);
        return redirect()->back();
    }
}
