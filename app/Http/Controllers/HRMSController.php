<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Carbon\Carbon;
use Exception;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class HRMSController extends Controller
{
    public function store(Request $request)
    {
        $company_id = $request->company_id;

        $check = Http::asForm()->post('idcsi-officesuites.com:8080/hrms/api.php', [
            'idno' => $company_id,
            'what' => 'is_id_exists',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);

        $manila = $check['code'] == "0" ? 1 : 0;


        $password = $request->password;

        $url = $manila == 1 ? 'idcsi-officesuites.com:8080/hrms/sso.php' : 'idcsi-officesuites.com:8082/hrms/sso.php';


        $response = Http::asForm()->post($url, [
            'username' => $company_id,
            'password' => $password
        ]);

        if ($response['code'] != "0") {
            throw ValidationException::withMessages(['company_id' => $response['message'] ?? 'Invalid Credentials']);
        }


        $api = $manila == 1 ? 'idcsi-officesuites.com:8080/hrms/api.php' : 'idcsi-officesuites.com:8082/hrms/api.php';

        $hrms_response = Http::asForm()->post($api, [
            'idno' => $company_id,
            'what' => 'getinfo',
            'field' => 'personal',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);



        $message = $hrms_response['message'];
        $imageContent = file_get_contents($message['picture_location']);
        $location = 'uploads/photos/user_' . $company_id . '/';
        $path = public_path($location);
        if (!file_exists($path)) {
            File::makeDirectory($path, 0777, true);
        }
        $email = $message['work_email'] ?? "";
        if ($imageContent) {
            @File::put(str_replace('/', '\\', $path) . $company_id, $imageContent, true);
        }
        $user = User::updateOrCreate(
            ['company_id' => $company_id],
            [
                'first_name' => $message['first_name'],
                'last_name' => $message['last_name'],
                'photo' => $imageContent ? $location . $company_id : null,
                'email' => strlen($email) > 10 ? $message['work_email'] : null,
                'date_of_birth' => Carbon::parse($message['date_of_birth']),
                'password' => bcrypt('password'),
                'position' => $message['job_job_title'],
                'department' => $message['project'],
            ]
        );


        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Syncs employee data from two HRMS APIs and updates the database.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function sync()
    {

        $api1 = env('HRMS_MANILA_API');
        $api2 = env('HRMS_LEYTE_API');
        $job_code = env('HRMS_JOB_CODE');
        $payload = [
            'apitoken' =>   env('HRMS_API_TOKEN'),
            'field'    =>   'allpeople',
            'what'     =>   'getinfo',
            'location' =>   env('HRMS_LOCATION'),
            'division' =>   env('HRMS_DIVISION'),
        ];

        /*
        !!!!WARNING!!!! !!!FOR NOW, UTILIZE SQL INJECTION TO GET ALL CCO EMPLOYEES - THIS IS UNSAFE AND SHOULD BE CHANGED IN THE FUTURE!!!
       
        1. Set global parameter value in .env file in order to dynamically change
        2. Modify HRMS API subscription
        Commented By: JOSH

        $hrms_response1 = Http::retry(10, 100)->asForm()->post($api1, [
            'idno' => "X' or d.divisions='CCO' or c.location like 'CCO%' or c.jobcode='",
            'what' => 'getinfo',
            'field' => 'acctg',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);
        $hrms_response2 = Http::retry(10, 100)->asForm()->post($api2, [
            'idno' => "X' or d.divisions='CCO' or c.location like 'CCO%' or c.jobcode='",
            'what' => 'getinfo',
            'field' => 'acctg',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);
        */
        $hrms_response_manila = null;
        $hrms_response_leyte = null;
        try {
            $hrms_response_manila = Http::retry(10, 100)->asForm()->post($api1, $payload);
            $hrms_response_leyte = Http::retry(10, 100)->asForm()->post($api2, $payload);
            $hrms_response_manila = $hrms_response_manila != null ? $hrms_response_manila : ["message" => []];
            $hrms_response_leyte = $hrms_response_leyte != null ? $hrms_response_leyte : ["message" => []];
        } catch (Exception $e) {
            $hrms_response_manila = $hrms_response_manila != null ? $hrms_response_manila : ["message" => []];
            $hrms_response_leyte = $hrms_response_leyte != null ? $hrms_response_leyte : ["message" => []];
        }
        $users = array_merge(($hrms_response_manila['message']), ($hrms_response_leyte['message']));

        DB::transaction(function () use ($users) {

            foreach ($users as $user) {
                User::withoutGlobalScopes()->updateOrCreate(
                    ['company_id' => $user['idno']],
                    [
                        'first_name' => $user['first_name'],
                        'last_name' => $user['last_name'],
                        'middle_name' => $user['middle_name'],
                        'date_of_birth' => Carbon::parse($user['birthdate']),
                        'position' => $user['job_job_title'],
                        'department' => $user['department'],
                        //'project'=>$user['jobcode'],
                        'site' => $user['job_location'],
                        'date_hired' => Carbon::parse($user['joined_date']),
                        'password' => bcrypt('password'),
                        'schedule' => '',
                    ]
                );
            }
            /*
            
            */
        });




        return redirect()->back();
    }

    public function auto_create_teams()
    {
        $team_leads = User::where('position', 'like', '%lead%')->get();
        foreach ($team_leads as $team_lead) {
            $team = Team::firstOrCreate(
                [
                    'user_id' => $team_lead->id
                ],
                [
                    'name' => 'Team ' . $team_lead->first_name,
                ]
            );
            $team_lead->update([
                'team_id' => $team->id
            ]);
        }
        return redirect()->route('team.index', ['team_id' => Team::first()->id]);
    }

    public function get_leave_credits($company_id = null)
    {
        $company_id = $company_id ?? Auth::user()->company_id;
        $res1 = DB::connection('mysql_hrms_manila')->table('leave_usage_tbl')
            ->select('employee_id', DB::raw('SUM(leave_value_count) as leave_credits'))
            ->where('leave_status', 'UNUSED')
            ->where('employee_id', $company_id)
            ->groupBy('employee_id')
            ->first();

        if ($res1) return $res1;

        $res2 = DB::connection('mysql_hrms_leyte')->table('leave_usage_tbl')
            ->select('employee_id', DB::raw('SUM(leave_value_count) as leave_credits'))
            ->where('leave_status', 'UNUSED')
            ->where('employee_id', $company_id)
            ->groupBy('employee_id')
            ->first();

        if ($res2) return $res2;
        return [];
    }

    /**
     * Retrieve the last 5 leave requests for a given company ID.
     *
     * @param string|null $company_id The ID of the company (optional). If not provided, the company ID of the authenticated user will be used.
     * @return \Illuminate\Support\Collection An array of leave request objects. If no leave requests are found, an empty array will be returned. 
     */
    public function get_last_5_leave_requests($company_id = null)
    {
        $company_id = $company_id ?? Auth::user()->company_id;
        $res1 = DB::connection('mysql_hrms_manila')->table('leave_usage_tbl as a')
            ->selectRaw('SUM(leave_value_count) as total_days, application_date, employee_id, leave_reason,leave_category,leave_status')
            ->selectRaw('MIN(date_from) as date_from, date_to')
            ->where('a.employee_id', $company_id)
            ->where('leave_status', '!=', 'UNUSED')
            ->whereNotIn('leave_status', ['WITH PAY', 'WITHOUT PAY'])
            ->groupBy('application_date', 'employee_id', 'leave_reason', 'date_to', 'leave_category', 'leave_status')
            ->orderBy('application_date', 'desc')
            ->limit(5)
            ->get();
        if ($res1->count() > 0) return $res1;
        $res2 = DB::connection('mysql_hrms_leyte')->table('leave_usage_tbl as a')
            ->selectRaw('SUM(leave_value_count) as total_days, application_date, employee_id, leave_reason,leave_category,leave_status')
            ->selectRaw('MIN(date_from) as date_from, date_to')
            ->where('a.employee_id', $company_id)
            ->where('leave_status', '!=', 'UNUSED')
            ->whereNotIn('leave_status', ['WITH PAY', 'WITHOUT PAY'])
            ->groupBy('application_date', 'employee_id', 'leave_reason', 'date_to', 'leave_category', 'leave_status')
            ->orderBy('application_date', 'desc')
            ->limit(5)
            ->get();
        if ($res2->count() > 0) return $res2;
        return [];
    }

    public function get_pending_leave_requests()
    {

        $company_ids = User::where('department', '<>', 'SOFTWARE')->get()->pluck('company_id')->toArray();

        $pendling_leave_requests_manila = DB::connection('mysql_hrms_manila')->table('leave_usage_tbl')
            ->selectRaw('a.first_name,a.last_name,application_date, employee_id, leave_reason,leave_category,leave_status')
            ->selectRaw('date_from, date_to')
            ->join('userdetails_tbl as a', 'a.other_id', '=', 'leave_usage_tbl.employee_id')
            ->whereIn('leave_status', ['WITH PAY', 'WITHOUT PAY'])
            ->whereIn('employee_id', $company_ids)
            ->orderBy('application_date', 'desc')
            ->get();

        $pendling_leave_requests_leyte = DB::connection('mysql_hrms_leyte')->table('leave_usage_tbl')
            ->selectRaw('a.first_name,a.last_name,application_date, employee_id, leave_reason,leave_category,leave_status')
            ->selectRaw('date_from, date_to')
            ->join('userdetails_tbl as a', 'a.other_id', '=', 'leave_usage_tbl.employee_id')
            ->whereIn('leave_status', ['WITH PAY', 'WITHOUT PAY'])
            ->whereIn('employee_id', $company_ids)
            ->orderBy('application_date', 'desc')
            ->get();

        //merge both results
        $pending_leave_requests = array_merge($pendling_leave_requests_manila->toArray(), $pendling_leave_requests_leyte->toArray());
        return $pending_leave_requests ?? [];
    }


    public function get_pending_leave_requests_simplified()
    {

        $company_ids = User::where('department', '<>', 'SOFTWARE')->get()->pluck('company_id')->toArray();

        $pendling_leave_requests_manila = DB::connection('mysql_hrms_manila')->table('leave_usage_tbl')
            ->selectRaw(' SUM(leave_value_count) as total_days,a.first_name,a.last_name,application_date, employee_id, leave_reason,leave_category,leave_status')
            ->selectRaw('min(date_from) as date_from, date_to')
            ->join('userdetails_tbl as a', 'a.other_id', '=', 'leave_usage_tbl.employee_id')
            ->whereIn('leave_status', ['WITH PAY', 'WITHOUT PAY'])
            ->groupBy('a.first_name', 'a.last_name', 'application_date', 'employee_id', 'leave_reason', 'leave_category', 'leave_status', 'date_to')
            ->whereIn('employee_id', $company_ids)
            ->orderBy('application_date', 'desc')
            ->get();

        $pendling_leave_requests_leyte = DB::connection('mysql_hrms_leyte')->table('leave_usage_tbl')
            ->selectRaw(' SUM(leave_value_count) as total_days,a.first_name,a.last_name,application_date, employee_id, leave_reason,leave_category,leave_status')
            ->selectRaw('min(date_from) as date_from, date_to')
            ->join('userdetails_tbl as a', 'a.other_id', '=', 'leave_usage_tbl.employee_id')
            ->whereIn('leave_status', ['WITH PAY', 'WITHOUT PAY'])
            ->whereIn('employee_id', $company_ids)
            ->groupBy('a.first_name', 'a.last_name', 'application_date', 'employee_id', 'leave_reason', 'leave_category', 'leave_status', 'date_to')
            ->orderBy('application_date', 'desc')
            ->get();

        //merge both results
        $pending_leave_requests = array_merge($pendling_leave_requests_manila->toArray(), $pendling_leave_requests_leyte->toArray());
        return $pending_leave_requests ?? [];
    }

    public function get_my_pending_leave_requests($company_id = null)
    {
        $company_id = $company_id ?? Auth::user()->company_id;
        $my_pendling_leave_requests = DB::connection('mysql_hrms_manila')->table('leave_usage_tbl')
            ->selectRaw('SUM(leave_value_count) as total_days, application_date, employee_id, leave_reason,leave_category,leave_status')
            ->selectRaw('MIN(date_from) as date_from, date_to')
            ->whereIn('leave_status', ['WITH PAY', 'WITHOUT PAY'])
            ->where('employee_id', $company_id)
            ->groupBy('application_date', 'employee_id', 'leave_reason', 'date_to', 'leave_category', 'leave_status')
            ->orderBy('application_date', 'desc')
            ->get();

        if ($my_pendling_leave_requests->count() > 0) return $my_pendling_leave_requests;

        $my_pendling_leave_requests = DB::connection('mysql_hrms_leyte')->table('leave_usage_tbl')
            ->selectRaw('SUM(leave_value_count) as total_days, application_date, employee_id, leave_reason,leave_category,leave_status')
            ->selectRaw('MIN(date_from) as date_from, date_to')
            ->whereIn('leave_status', ['WITH PAY', 'WITHOUT PAY'])
            ->where('employee_id', $company_id)
            ->groupBy('application_date', 'employee_id', 'leave_reason', 'date_to', 'leave_category', 'leave_status')
            ->orderBy('application_date', 'desc')
            ->get();

        return $my_pendling_leave_requests;
    }

    public function leave_planner()
    {
        return Inertia::render('LeavePlanner');
    }

    public function leave_planner_head()
    {
        return Inertia::render('LeavePlannerHead');
    }
}
