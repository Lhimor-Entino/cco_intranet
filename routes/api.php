<?php

use App\Models\Project;
use App\Models\User;
use App\Models\UserAttendance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware('api')->get('/get_server_time', function (Request $request) {
    return Carbon::now();
})->name('api.get_server_time');;



Route::middleware('api')->post('/attendance/', function (Request $request) {
    $search = $request->search;
    $dt = !$search ? Carbon::now()->format('Y-m-d') : Carbon::parse($search)->format('Y-m-d');
    $cco_users = User::select('company_id', 'id', 'shift_id')->where('department', '<>', 'SOFTWARE')->get();
    $ids = $cco_users->pluck('company_id');
    foreach ($cco_users as $cco_user) {

        $ua = UserAttendance::firstOrCreate([
            'user_id' => $cco_user['id'],
            'date' => $dt
        ]);
        if (!$ua->shift_id) {
            $ua->update([
                'shift_id' => $cco_user['shift_id']
            ]);
        }
    }

    $config = [
        'token' => 'JIGQ0PAI7AI3D152IOJVM',
        'id_number' => $ids,
        //'log_date'=>'2024-03-21'
        'log_date' => $dt
    ];
    $hrms_response1 = Http::retry(10, 100)->withoutVerifying()->asForm()->post('idcsi-officesuites.com:8080/mail/api/getDailyAttendance', [
        'postData' => json_encode($config)
    ]);
    $hrms_response2 = Http::retry(10, 100)->withoutVerifying()->asForm()->post('idcsi-officesuites.com:8082/mail/api/getDailyAttendance', [
        'postData' => json_encode($config)
    ]);
    $response = array_merge($hrms_response2['message'], $hrms_response1['message']);
    /*
    response type = {
        id_number:string
        time_in:string
        time_out:string
    }[]
    */
    DB::transaction(function () use ($response, $dt) {
        foreach ($response as $res) {
            $user_id = User::where('company_id', $res['id_number'])->first()->id;
            $attendance = UserAttendance::where('user_id', $user_id)->where('date', $dt)->first();
            if ($attendance) {
                if ($attendance->edited_time_in == 0) {
                    $attendance->update([
                        'time_in' => $res['time_in'] == '0000-00-00 00:00:00' ? null : Carbon::parse($res['time_in']),
                    ]);
                }
                if ($attendance->edited_time_out == 0) {
                    $attendance->update([
                        'time_out' => $res['time_out'] == '0000-00-00 00:00:00' ? null : Carbon::parse($res['time_out'])
                    ]);
                }
            }
            if (!$attendance) {
                //$time_in_date = !isTimeBetweenMidnightAnd6AM($res['time_in'])?$dt:Carbon::parse($dt)->subDay()->format('Y-m-d');


                UserAttendance::create([
                    'user_id' => $user_id,
                    'date' => $dt,
                    'time_in' => $res['time_in'] == '0000-00-00 00:00:00' ? null : Carbon::parse($res['time_in']),
                    'time_out' => $res['time_out'] == '0000-00-00 00:00:00' ? null : Carbon::parse($res['time_out'])
                ]);
            }
        }
    });

    return User::with(['shift', 'attendances' => function ($q) use ($dt) {
        $q->where('date', $dt);
    }])->where('department', '<>', 'SOFTWARE')->get();
})->name('api.attendances');



Route::get('/raw/{id?}/{dt?}', function ($id = null, $dt = null) {

    if (!$id) return "No id provided";
    if (!$dt) return "No date provided";

    $ids = [$id];

    $config = [
        'token' => 'JIGQ0PAI7AI3D152IOJVM',
        'id_number' => $ids,
        //'log_date'=>'2024-03-21'
        'log_date' => $dt
    ];
    $hrms_response1 = Http::retry(10, 100)->withoutVerifying()->asForm()->post('idcsi-officesuites.com:8080/mail/api/getDailyAttendance', [
        'postData' => json_encode($config)
    ]);
    $hrms_response2 = Http::retry(10, 100)->withoutVerifying()->asForm()->post('idcsi-officesuites.com:8082/mail/api/getDailyAttendance', [
        'postData' => json_encode($config)
    ]);
    $response = array_merge($hrms_response2['message'], $hrms_response1['message']);
    return $response;
})->name('api.raw');

//get distinct positions from User model; dont eager load shift and project
Route::get('/positions/{filter?}', fn($filter = "") => User::select('position')
    ->where('position', 'like', "%$filter%")
    ->without(['shift', 'project'])
    ->distinct()
    ->get()
    ->pluck('position'))->name('api.positions');

Route::get('users', fn() => User::with(['shift', 'project'])->get())->name('api.users');
Route::get('team-leads', fn() => User::without(['shift', 'team',])->select(['first_name', 'last_name', 'company_id', 'position', 'id'])->where('position', 'like', '%lead%')->get())->name('api.team_leads');
Route::get('projects', fn() => Project::all())->name('api.projects');
