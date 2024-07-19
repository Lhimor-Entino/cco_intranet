<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamHistory;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($team_id=null)
    {
        if(!$team_id) {
            $first_team_id = Team::first()->id;
            if(!$first_team_id) return redirect()->route('hrms.auto_create_teams');
            return redirect()->route('team.index',['team_id'=>$first_team_id]);
        } 
        $team = Team::with(['users'])->findOrFail($team_id);
        $team_leads = User::where('position','like','%lead%')->get();
        $teamless_agents = User::whereNull('team_id')->where('position', 'not like', '%lead%')->get();
        return Inertia::render('TeamSettings',[
            'team'=>$team,
            'team_leads'=>$team_leads,
            'teams'=>Team::all(),
            'teamless_agents'=>$teamless_agents,
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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        Team::create([
            'name'=>trim($request->name),
            'user_id'=>$request->user_id
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
        return User::where('team_id',$id)->get();
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
        $team=Team::findOrFail($id);
        $team->update([
            'name'=>trim($request->name),
            'user_id'=>$request->user_id
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
        Team::findOrFail($id)->delete();
        return redirect()->route('team.index',['team_id'=>Team::first()->id]);
    }

    public function transfer(Request $request,$team_id)
    {
        $user = User::findOrFail($request->user['id']);
        $user->update([
            'team_id'=>$team_id
        ]);
        TeamHistory::create([
            'team_id'=>$team_id,
            'user_id'=>$request->user['id'],
            'start_date'=>now()
        ]);
        return redirect()->back();
    }

    public function unassign(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $user->update([
            'team_id'=>null
        ]);
        TeamHistory::create([
            'team_id'=>null,
            'user_id'=>$request->user_id,
            'start_date'=>now()
        ]);
        return redirect()->back();
    }
}
