<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserAttendance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($search="")
    {
        $dt=$search!=""?Carbon::parse($search)->format('Y-m-d'):Carbon::now()->format('Y-m-d');
        return Inertia::render('Attendance',[
            'dt'=>$dt,
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
    public function store(Request $request,$user_id,$date)
    {
        $user_attendance=UserAttendance::create([
            'date'=>Carbon::parse($date),
            'user_id'=>$user_id,          
            'time_in'=>$request->time_in,
            'time_out'=>$request->time_out
        ]);
        if($request->time_in){            
            $user_attendance->update([
                'edited_time_in'=>1,
                'edited_time_in_by_id'=>$request->user()->id,
                'edited_time_in_date'=>Carbon::now()                
            ]);            
        }
        if($request->time_out){
            $user_attendance->update([
                'edited_time_out'=>1,
                'edited_time_out_by_id'=>$request->user()->id,
                'edited_time_out_date'=>Carbon::now()
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
        $user_attendance = UserAttendance::findOrfail($id);
        if($request->time_in){
            //only update time in if time in is different from the original time in
            if(Carbon::parse($user_attendance->time_in)->format('H:i')!=Carbon::parse($request->time_in)->format('H:i')){
                $user_attendance->update([
                    'time_in'=>$request->time_in,
                    'edited_time_in'=>1,
                    'edited_time_in_by_id'=>$request->user()->id,
                    'edited_time_in_date'=>Carbon::now()                
                ]);
            }
        }
        if($request->time_out){
                if(Carbon::parse($user_attendance->time_out)->format('H:i')!=Carbon::parse($request->time_out)->format('H:i')){{
                    $user_attendance->update([
                        'time_out'=>$request->time_out,
                        'edited_time_out'=>1,
                        'edited_time_out_by_id'=>$request->user()->id,
                        'edited_time_out_date'=>Carbon::now()
                    ]);
                }                
            }
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
        //
    }

    public function generate_report(Request $request){
        $cco_users = User::withoutGlobalScope('is_archived')->select('company_id')->where('department','CCO')->get();
        $ids = $cco_users->pluck('company_id');
        

        $from=Carbon::parse($request->date['from'])->format('Y-m-d');
        $to=isset($request->date['to'])?Carbon::parse($request->date['to'])->addDay()->format('Y-m-d'):$from;
        //create an array of dates in 'Y-m-d' format between the two dates
        $dates = [];
        $start_date = $from;
        $end_date = $to;
        while (strtotime($start_date) <= strtotime($end_date)) {
            $dates[] = $start_date;
            $start_date = date ("Y-m-d", strtotime("+1 day", strtotime($start_date)));
        }
        foreach($dates as $date){
            $attendaces = UserAttendance::with(['user','user.shift'])->where('date',$date)->get();
            if(count($attendaces)<1){
                $config=[
                    'token' => 'JIGQ0PAI7AI3D152IOJVM',
                    'id_number'=>$ids,
                    //'log_date'=>'2024-03-21'
                    'log_date'=>$date
                ];
                $hrms_response1 = Http::retry(10, 100)->withoutVerifying()->asForm()->post('idcsi-officesuites.com:8080/mail/api/getDailyAttendance',[
                    'postData'=>json_encode($config)
                ]);
                $hrms_response2 = Http::retry(10, 100)->withoutVerifying()->asForm()->post('idcsi-officesuites.com:8082/mail/api/getDailyAttendance',[
                    'postData'=>json_encode($config)
                ]);
                $response=array_merge($hrms_response2['message'],$hrms_response1['message']);
                
                DB::transaction(function () use ($response,$date){
                    foreach($response as $res){
                        UserAttendance::firstOrCreate([
                            'user_id'=>User::withoutGlobalScope('is_archived')->where('company_id',$res['id_number'])->first()->id,
                            'date'=>$date
                        ],[
                            //set as null if either starts with 0000-00-00
                            'shift_id'=>User::withoutGlobalScope('is_archived')->where('company_id',$res['id_number'])->first()->shift_id,
                            'time_in'=>$res['time_in']=='0000-00-00 00:00:00'?null:Carbon::parse($res['time_in']),
                            'time_out'=>$res['time_out']=='0000-00-00 00:00:00'?null:Carbon::parse($res['time_out'])
                        ]);
                    }
                });
            }
        }
        return User::withoutGlobalScope('is_archived')->with(['attendances'=>function ($q) use ($from,$to) {
            $q->whereBetween('date',[$from,$to]);
        },'attendances.shift'])->where('department','CCO')->get();
    }
}
