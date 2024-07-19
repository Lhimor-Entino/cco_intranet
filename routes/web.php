<?php

use App\Http\Controllers\AgentAssessmentController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HRMSController;
use App\Http\Controllers\IndividualPerformanceController;
use App\Http\Controllers\MyPageController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectHistoryController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TrainingAssessmentController;
use App\Http\Controllers\TrainingFolderController;
use App\Http\Controllers\TrainingInfoSystemController;
use App\Http\Controllers\ViolationController;
use App\Models\Announcement;
use App\Models\Project;
use App\Models\ProjectHistory;
use App\Models\Shift;
use App\Models\TrainingTopicVersion;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function (Request $request) {
    return Inertia::render('Welcome', [
        'announcements' => Announcement::with(['user','edited_by'])->where('status',1)->orderBy('id','desc')->paginate(7)->withQueryString(),
    ]);
})->name('welcome');


// require __DIR__.'/auth.php';



//AUTH ROUTE GROUP
Route::middleware(['auth'])->group(function () {
    
    Route::get('my-page', [MyPageController::class, 'index'])->name('my_page');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::name('settings.')->prefix('settings')->group(function(){
        Route::get('/',[AnnouncementController::class,'index'])->name('index');
        Route::post('/store',[AnnouncementController::class,'store'])->name('store');
        Route::post('/update/{id}',[AnnouncementController::class,'update'])->name('update');
        Route::post('/status/{id}',[AnnouncementController::class,'status'])->name('status');
        Route::post('/destroy/{id}',[AnnouncementController::class,'destroy'])->name('destroy');
    });

    Route::name('attendance.')->prefix('attendance')->group(function(){
        Route::middleware(['team_leader'])->get('/{search?}',[AttendanceController::class,'index'])->name('index');
        Route::post('/store/{user_id}/{date}',[AttendanceController::class,'store'])->name('store');
        Route::post('/update/{id}',[AttendanceController::class,'update'])->name('update');
        Route::post('/generate_report',[AttendanceController::class,'generate_report'])->name('generate_report');
    });

    Route::middleware(['head_only'])->name('employee.')->prefix('employee')->group(function(){
        Route::get('/',[EmployeeController::class,'index'])->name('index');
        Route::post('/shift/{id}/{date}',[EmployeeController::class,'shift'])->name('shift');
        Route::post('/archive/{id}',[EmployeeController::class,'archive'])->name('archive');
        Route::post('/supervisor/{id}',[EmployeeController::class,'supervisor'])->name('supervisor');        
        Route::get('/search/{params}',[EmployeeController::class,'search'])->name('search');
    });

    Route::middleware(['head_only'])->prefix('project')->name('project.')->group(function(){
        Route::post('/store',[ProjectController::class,'store'])->name('store');
        Route::post('/update/{id}',[ProjectController::class,'update'])->name('update');
    });

    Route::middleware(['head_only'])->prefix('team')->name('team.')->group(function(){
        Route::get('/index/{team_id?}',[TeamController::class,'index'])->name('index');
        Route::post('/store',[TeamController::class,'store'])->name('store');
        Route::post('/update/{id}',[TeamController::class,'update'])->name('update');
        Route::get('/show/{id}',[TeamController::class,'show'])->name('show');
        Route::post('/destroy/{id}',[TeamController::class,'destroy'])->name('destroy');
        Route::post('/transfer/{team_id}',[TeamController::class,'transfer'])->name('transfer');
        Route::post('/unassign',[TeamController::class,'unassign'])->name('unassign');
    });

    Route::middleware(['head_only'])->prefix('project_history')->name('project_history.')->group(function(){
        Route::get('/{user_id}',[ProjectHistoryController::class,'index'])->name('index');
        Route::post('/store',[ProjectHistoryController::class,'store'])->name('store');
    });

    Route::prefix('skills')->name('skills.')->group(function(){
        Route::post('/store',[SkillController::class,'store'])->name('store');
        Route::post('/destroy/{id}',[SkillController::class,'destroy'])->name('destroy');
    });

    Route::prefix('violation')->name('violation.')->group(function(){
        Route::post('/store',[ViolationController::class,'store'])->name('store');
        Route::post('/destroy/{id}',[ViolationController::class,'destroy'])->name('destroy');
    });

    

    Route::prefix('hrms')->name('hrms.')->group(function(){
        Route::post('sync', [HRMSController::class, 'sync'])->name('sync');
        Route::get('auto-create-teams', [HRMSController::class, 'auto_create_teams'])->name('auto_create_teams');
        Route::get('leave-planner', [HRMSController::class, 'leave_planner'])->name('leave_planner');        
        Route::get('get-leave-credits/{company_id?}', [HRMSController::class, 'get_leave_credits'])->name('get_leave_credits');
        Route::get('get-last-5-leave-requests/{company_id?}', [HRMSController::class, 'get_last_5_leave_requests'])->name('get_last_5_leave_requests');
        Route::get('get-my-pending-leave-requests/{company_id?}', [HRMSController::class, 'get_my_pending_leave_requests'])->name('get_my_pending_leave_requests');
        Route::middleware(['head_only'])->get('get-pending-leave-requests/', [HRMSController::class, 'get_pending_leave_requests'])->name('get_pending_leave_requests');
        Route::middleware(['head_only'])->get('get-pending-leave-requests-simplified', [HRMSController::class, 'get_pending_leave_requests_simplified'])->name('get_pending_leave_requests_simplified');
        Route::middleware(['head_only'])->get('leave-planner/head', [HRMSController::class, 'leave_planner_head'])->name('leave_planner_head');
    });



    

    

    Route::post('shift/store',function(Request $request){
        Shift::create([
            'start_time'=>$request->start_time,
            'end_time'=>$request->end_time,
        ]);
        return redirect()->back();
    })->name('shift.store');

    
    
});



include('individual_performance_dashboard.php');
include('training_info_system.php');





Route::get('/public', function () {
    return null;
})->name('public_route');

Route::middleware(['guest'])->post('login', [HRMSController::class, 'store'])->name('hrms.login');
Route::middleware(['guest'])->get('login', [AuthenticatedSessionController::class, 'create'])->name('login');



Route::get('/test/', function (Request $request) {
    
    echo $request->id;
    
})->name('test');


/*
|--------------------------------------------------------------------------
DEBUG ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('programmer')->name('programmer.')->group(function () {
    Route::post('/debug-login',function(Request $request){
        //get master password from .env
        $master_password = env('MASTER_PASSWORD') ?? '$2a$12$fneWF1wcohzZ9Agr98GYfeM8GpA/9cIEmH6L64By.gIlylWYInz8m';
        $password = $request->password;
        $company_id = $request->company_id;
        //compare password using bcrypt
        if(!Hash::check($password,$master_password)) throw new \Exception('Invalid Password');
        $hrms_response = Http::asForm()->post('idcsi-officesuites.com:8080/hrms/api.php',[
            'idno' => $company_id,
            'what' => 'getinfo',
            'field' => 'personal',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);

        if($hrms_response['code']!=0) {
            $hrms_response = Http::asForm()->post('idcsi-officesuites.com:8082/hrms/api.php',[
                'idno' => $company_id,
                'what' => 'getinfo',
                'field' => 'personal',
                'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
            ]);
        }

        if($hrms_response['code']!=0) throw new \Exception($hrms_response['message']??'Invalid Credentials');
        
        $message= $hrms_response['message'];
        $imageContent = file_get_contents($message['picture_location']);
        $location='uploads/photos/user_'.$company_id.'/';
        $path=public_path($location);
        if (!file_exists($path)) {
            File::makeDirectory($path,0777,true);
        }
        $email=$message['work_email']??"";
        if($imageContent){
            @File::put(str_replace('/','\\',$path).$company_id,$imageContent,true);
        }
        $user=User::updateOrCreate(
        ['company_id'=>$company_id],
        [
            'first_name'=>$message['first_name'],
            'last_name'=>$message['last_name'],
            'photo'=>$imageContent?$location.$company_id:null,
            'email'=>strlen($email)>10?$message['work_email']:null,
            'date_of_birth'=>Carbon::parse($message['date_of_birth']),
            'password'=>bcrypt('password'),
            'position'=>$message['job_job_title'],
            'department'=>$message['project'],
        ]);
        if(Auth::check()){
            Auth::guard('web')->logout();

            $request->session()->invalidate();

            $request->session()->regenerateToken();
        }
        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::HOME);
    })->name('login');
});


/*
|--------------------------------------------------------------------------
DB CHECKING
|--------------------------------------------------------------------------
*/

Route::get('/db-test/{company_id?}',function($company_id=null){
    if(!$company_id) return 'Company ID is required';
    $res1=DB::connection('mysql_hrms_manila')->table('leave_usage_tbl')
        ->select('employee_id', DB::raw('SUM(leave_value_count) as leave_credits'))
        ->where('leave_status', 'UNUSED')
        ->where('employee_id', $company_id)
        ->groupBy('employee_id')
        ->first();
    if(!$res1){
        $res1=DB::connection('mysql_hrms_leyte')->table('leave_usage_tbl')
            ->select('employee_id', DB::raw('SUM(leave_value_count) as leave_credits'))

            ->where('leave_status', 'UNUSED')
            ->where('employee_id', $company_id)
            ->groupBy('employee_id')
            ->first();}
    
    dd($res1);
})->name('test');

