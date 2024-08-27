<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserAttendance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render('EmployeeInfoRecords', [
            'employees' => User::where('department', 'CCO')->get()
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
        //
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
        //
    }

    public function shift(Request $request, $id, $date)
    {
        $attendance_date = $date ? Carbon::parse($date)->format('Y-m-d') : Carbon::now()->format('Y-m-d');
        $employee = User::findOrFail($id);
        $employee->update([
            'shift_id' => $request->shift_id
        ]);
        /*
        $attendance = UserAttendance::where('user_id',$id)->where('date',date('Y-m-d'))->first();
        if($attendance){
            $attendance->update([
                'shift_id'=>$request->shift_id
            ]);
        }
        */
        UserAttendance::updateOrCreate([
            'user_id' => $id,
            'date' => $attendance_date
        ], [
            'shift_id' => $request->shift_id
        ]);
        return redirect()->back();
    }

    public function archive($id)
    {
        $employee = User::findOrFail($id);
        $employee->update([
            'is_archived' => 1
        ]);
        return redirect()->back();
    }

    public function supervisor(Request $request, $id)
    {
        $employee = User::findOrFail($id);
        $employee->update([
            'user_id' => $request->supervisor_id
        ]);
        return redirect()->back();
    }

    public function search($params)
    {
        $employees = User::with(['team'])->where('department', 'CCO')
            ->where('first_name', 'like', '%' . $params . '%')
            ->orWhere('last_name', 'like', '%' . $params . '%')
            ->orWhere('company_id', 'like', '%' . $params . '%')
            ->get();
        return $employees;
    }
}
