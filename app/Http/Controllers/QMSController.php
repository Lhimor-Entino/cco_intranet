<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectHistory;
use App\Models\QAElements;
use App\Models\QaElementScores;
use App\Models\QaGroupHistories;
use App\Models\QaGroups;
use App\Models\Team;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QMSController extends Controller
{
    public function index(Request $request, $team_id = null, $project_id = null)
    {
        $user = Auth::user();
        $team = !$team_id ? Team::firstOrFail() : Team::where('id', $team_id)->firstOrFail();
        // return $team_id;
        if (!$team_id) {
            if (isset($user->team_id)) return redirect()->route('quality_management_system.index', ['team_id' => $user->team_id]);
            if ($this->is_admin() && !isset($user->team_id)) return  redirect()->route('quality_management_system.index', ['team_id' =>  $team->id]);
            if ($this->is_team_lead() && !isset($user->team_id)) {
                $team_id = Team::select('id')->where('user_id', $user->id)->pluck('id')->first() ?? 0;

                return $team_id <= 0 ? self::hasNoTeamContent($user) : redirect()->route('quality_management_system.index', ['team_id' => $team_id]);
            }
            // abort(403, 'This account is not assigned to any team. Please contact your administrator.');
        }
        $from = isset($request->date['from']) ? Carbon::parse($request->date['from'])->format('Y-m-d') : null;
        $to = isset($request->date['to']) ? Carbon::parse($request->date['to'])->format('Y-m-d') : $from;
        if (!$from) {
            $from = Carbon::now()->startOfMonth()->format('Y-m-d');
            $to = Carbon::now()->endOfMonth()->format('Y-m-d');
        }
        $tl_user = User::where('id', $team->user_id)->first();
        $projects = collect(self::LeadedProjectswithHistories($tl_user));
        $project_id = $project_id ? $project_id : $projects[0]['id'];
        // return self::QAElementA($team_id, $project_id);
        return Inertia::render('QMS', [
            'is_admin' => $this->is_admin(),
            'is_team_leader' => $this->is_team_lead(),
            'date_range' => [
                'from' => $from,
                'to' => $to
            ],
            'team_projects' => $projects,
            'team' => $team,
            'project' => $projects,
            'project' => Project::find($project_id) ??  ["id" => 0, "name" => "No Project Found", "metrics" => []],
            'agents' => self::agents($team_id, $project_id)
        ]);
    }
    function QAElementA($team_id, $project_id)
    {
        return  User::with('team', 'user_elements')->get();
    }
    function agents($team_id, $project_id)
    {
        return  User::with('team', 'user_elements')->where('team_id', $team_id)->where('users.project_id', $project_id)->get()
            ->map(function ($user) {
                return [
                    'user_id' => $user->id,
                    'tl_user_id' => $user->team->user_id,
                    'user' => $user,
                    'team_leader' => $user->team->user,
                    'score' => 0
                ];
            });
    }
    public function settings($project_id = null)
    {

        if (!$this->is_admin()) abort(403);
        $metrics_data = !$project_id ? null : QAElements::where('project_id', $project_id)->orderBy('position', 'asc')->get();
        // collect($metrics_data ?? [])->each(function ($data) {
        //     $setting = $data->setting('dashboard_setting', 'top_performer_order')->first();
        //     if ($setting == null) {
        //         $setting = new MetricSettings();
        //         $setting->id = 0;
        //         $setting->individual_performance_metric_id = 0;
        //         $setting->name = 'top_performer_order';
        //         $setting->value = 'DESC';
        //         $setting->tag = 'dashboard_setting';
        //         $data->setting = $setting;
        //     } else {
        //         $data->setting = $setting;
        //     }
        // });
        return Inertia::render('QMSSettings', [
            'elements' => $metrics_data,
            'project' => $project_id ? Project::findOrFail($project_id) : null
        ]);
    }
    public function store(Request $request)
    {
        if (!$this->is_quality_access()) abort(403);

        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'qa_element' => 'required | string',
            'goal' => 'required|numeric',
        ]);
        QAElements::create([
            'project_id' => $request->project_id,
            'user_id' => Auth::id(),
            'qa_element' => $request->qa_element,
            'goal' => $request->goal
        ]);
        return redirect()->back();
    }
    public function  update(Request $request, $id)
    {
        if (!$this->is_quality_access()) abort(403);
        $request->validate([
            'qa_element' => 'required | string',
            'goal' => 'required|numeric',
        ]);
        $element = QAElements::findOrFail($id);
        $element->update([
            'qa_element' => $request->qa_element,
            'goal' => $request->goal
        ]);
        return redirect()->back();
    }
    public function destroy($id)
    {
        if (!$this->is_quality_access()) abort(403);
        $element = QAElements::findOrFail($id);
        $element->delete();
        return redirect()->back();
    }
    public function order(Request $request)
    {
        if (!$this->is_quality_access()) abort(403);

        $elements = $request['elements'];
        foreach ($elements as $element) {
            $data = QAElements::findOrFail($element['id']);
            $data->update(['position' => $element['position']]);
        }
        return $elements;
        return redirect()->back();
    }
    public function qa_index($qa_group_id = 0)
    {
        if (!$qa_group_id) {
            $first_qa_group = QaGroups::first()->id ?? 0;
            if (!$first_qa_group) return redirect()->route('hrms.auto_create_qa_group');
            return redirect()->route('qa_group.index', ['qa_group_id' => $first_qa_group]);
        }
        $group = QaGroups::with(['users'])->findOrFail($qa_group_id);
        $users = User::where('position', 'like', '%lead%')->get();
        $unassigned_users = User::whereNull('qa_group_id')->where('position', 'not like', '%quality%')->get();

        return Inertia::render('QAGroupSettings', [
            'group' => $group,
            'users' => $users,
            'groups' => QaGroups::all(),
            'unassigned_users' => $unassigned_users,
        ]);
    }
    public function qa_store(Request $request)
    {
        QaGroups::create([
            'name' => trim($request->name),
            'user_id' => $request->user_id
        ]);
        return redirect()->back();
    }
    public function qa_update(Request $request, $id)
    {
        $qa_group = QaGroups::findOrFail($id);
        $qa_group->update([
            'name' => trim($request->name),
            'user_id' => $request->user_id
        ]);
        return redirect()->back();
    }
    public function qa_show($id)
    {
        return User::where('qa_group_id', $id)->get();
    }
    public function qa_destroy($id)
    {
        QaGroups::findOrFail($id)->delete();
        return redirect()->route('qa_group.index', ['qa_group_id' => QaGroups::first()->id]);
    }
    public function qa_transfer(Request $request, $qa_group_id)
    {
        $user = User::findOrFail($request->user['id']);
        $user->update([
            'qa_group_id' => $qa_group_id
        ]);
        QaGroupHistories::create([
            'qa_group_id' => $qa_group_id,
            'user_id' => $request->user['id'],
            'start_date' => now()
        ]);
        return redirect()->back();
    }
    public function qa_unassign(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $user->update([
            'qa_group_id' => null
        ]);
        QaGroupHistories::create([
            'qa_group_id' => null,
            'user_id' => $request->user_id,
            'start_date' => now()
        ]);
        return redirect()->back();
    }
    /******[QA Scores]******************************************************************************************************************************/
    public function scoring(Request $request, $project_id = null)
    {
        if (!$this->is_admin() && !$this->is_team_lead() && !$this->is_quality_access()) abort(403);
        $date = $request->date;
        if (!$date) $date = Carbon::now()->format('Y-m-d');
        $user = Auth::user();
        $project = null;
        $leaded_projects =  collect(self::LeadedProjects());
        if ($project_id && $this->is_admin()) {
            $project = Project::with(['elements'])->where('id', $project_id)->firstOrFail();
        }
        if ($project_id && $this->is_team_lead() && !$this->is_admin()) {
            // if ($user->project_id != $project_id) abort(403);
            if (!$leaded_projects->contains('id', $project_id)) abort(403);
            $project = Project::with(['elements'])->where('id', $project_id)->firstOrFail();
        }

        if (!$project_id && $this->is_admin()) {
            $project = Project::with(['elements'])->first();
        }

        if (!$project_id && $this->is_team_lead() && !$this->is_admin()) {
            // if (!$user->project_id) abort(403);
            if (empty($leaded_projects)) abort(403);
            $project = Project::with(['elements'])->where('id', $user->project_id)->firstOrFail();
        }

        $agents = User::with(['user_elements' => function ($q) use ($date) {
            return $q->where('date', $date);
        }])
            ->where('project_id', $project->id)
            ->when((($this->is_team_lead() || $this->is_quality_access()) && !$this->is_admin()), function ($query) {
                /*if role is team lead filter dataset with leaded teams only.*/
                $query->whereIn('qa_group_id', self::LeadedQAGroup());
            })
            ->get();

        return Inertia::render('IndividualScoringForm', [
            'is_admin' => $this->is_admin(),
            'is_qa_user' => $this->is_team_lead(),
            'project' => $project,
            'agents' => $agents,
            'date' => $date,
            'leaded_projects' => $leaded_projects
        ]);
    }
    public function save_rating(Request $request)
    {
        $date = $request->date;
        $user_scores = $request->scores;
        $user_id = $request->user_id;
        /*
        metric_id:number;
        user_metric_id:number;
        score:number;
        */
        DB::transaction(function () use ($date, $user_scores, $user_id) {

            foreach ($user_scores as $score) {
                $payload = [
                    "qa_element_id" => $score['qa_element_id'],
                    "user_id" => $user_id,
                    "date" => $date
                ];

                /**Check User Rate Exist Commented by: JOSH**/
                $score['qa_element_score_id'] = $score['qa_element_score_id'] > 0 ? $score['qa_element_score_id'] : self::CheckUserScore($payload);

                if ($score['qa_element_score_id'] == 0) {
                    QaElementScores::create([
                        'qa_element_id' => $score['qa_element_id'],
                        'user_id' => $user_id,
                        'score' => !$score['not_applicable'] ? $score['score'] : 0,
                        'is_applicable' => !$score['not_applicable'] ? 1 : 0,
                        'date' => $date
                    ]);
                } else {
                    $user_metric = QaElementScores::findOrFail($score['qa_element_score_id']);
                    $user_metric->update([
                        'is_applicable' => !$score['not_applicable'] ? 1 : 0,
                        'score' => !$score['not_applicable'] ? $score['score'] : 0,
                    ]);
                }
            }
        });
        return redirect()->back();
    }
    /******[SUPPORT]******************************************************************************************************************************/
    /**Check User Rate Exist Commented by: JOSH**/
    public function CheckUserScore($payload): int
    {
        $date = Carbon::parse($payload['date'])->format('Y-m-d');
        $isExist = QaElementScores::where('qa_element_id', $payload['qa_element_id'])
            ->where('user_id', $payload['user_id'])
            ->where('date', $date)
            ->pluck('id')
            ->first();
        return $isExist ?? 0;
    }
    private function is_admin(): bool
    {
        $user = Auth::user();
        return $user->position == 'OPERATIONS MANAGER' ||
            $user->position == 'GENERAL MANAGER' ||
            $user->position == 'PROGRAMMER' ||
            $user->position == 'OPERATIONS SUPERVISOR' ||
            $user->position == 'OPERATIONS SUPERVISOR 2' ||
            $user->position == 'QUALITY ASSURANCE AND TRAINING SUPERVISOR';
    }
    private function is_quality_access(): bool
    {
        $user = Auth::user();
        return  $user->position == 'TRAINING & QUALITY OFFICER' ||
            $user->position == 'QUALITY ANALYST' ||
            $user->position == 'QUALITY ASSURANCE AND TRAINING SUPERVISOR' ||
            $this->is_admin();
    }

    private function is_team_lead(): bool
    {
        $user = Auth::user();
        return $user->position == 'TEAM LEADER' ||
            $user->position == 'TEAM LEADER 1' ||
            $user->position == 'TEAM LEADER 2' ||
            $user->position == 'TEAM LEADER 3' ||
            $user->position == 'TEAM LEADER 4' ||
            $user->position == 'TEAM LEADER 5' ||
            $user->position == 'TEAM LEADER 6' ||
            $user->position == 'TEAM LEADER 7' ||
            $user->position == 'TEAM LEAD 1' ||
            $user->position == 'TEAM LEAD 2' ||
            $user->position == 'TEAM LEAD 3' ||
            $user->position == 'TEAM LEAD 4' ||
            $user->position == 'TEAM LEAD 5' ||
            $user->position == 'TEAM LEAD 6' ||
            $user->position == 'TEAM LEAD 7' ||
            $user->position == 'TEAM LEAD' ||
            $this->is_admin();
    }

    /**TEAM LEADER'S FUNCTIONS*/
    private function LeadedTeams($param_user = null)
    {
        $user = $param_user != null ? $param_user : Auth::user();
        $team_ids = Team::where('user_id', $user->id)->pluck('id');
        return $team_ids;
    }
    private function LeadedQAGroup($param_user = null)
    {
        $user = $param_user != null ? $param_user : Auth::user();
        $team_ids = QaGroups::where('user_id', $user->id)->pluck('id');
        return $team_ids;
    }
    private function LeadedProjects($param_user = null)
    {
        $user = $param_user != null ? $param_user : Auth::user();
        $projects = [];
        $projects = Project::join('users', 'projects.id', '=', 'users.project_id')
            ->when($this->is_team_lead() && !$this->is_admin(), function ($query) use ($param_user) {
                $query->whereIn('users.team_id', self::LeadedTeams($param_user));
            })
            ->when((($user->project_id ?? 0) > 0), function ($query) use ($user) {
                $query->orWhere('projects.id', $user->project_id);
            })
            ->select('projects.*')
            ->groupBy('projects.id')
            ->orderBy('projects.name')
            ->get();

        return $projects;
    }
    private function LeadedProjectswithHistories($param_user = null)
    {
        $user = $param_user != null ? $param_user : Auth::user();
        $projects = [];
        $projects =  ProjectHistory::join('projects', 'project_histories.project_id', '=', 'projects.id')
            ->join('users', 'projects.id', '=', 'users.project_id')
            ->orWhereIn('users.team_id', self::LeadedTeams($param_user))
            ->orWhere('project_histories.user_id', $user->id)
            ->select('projects.*')->groupBy('projects.id')
            ->orderBy('projects.name')
            ->get();
        return  $projects;
    }
    public function hasNoTeamContent($user)
    {
        $team = ["id" => 0, "name" => "(No Team) " . $user->last_name, "user" => $user, "user_id" => $user->id];
        $from = Carbon::now()->startOfMonth()->format('Y-m-d');
        $to = Carbon::now()->endOfMonth()->format('Y-m-d');
        return Inertia::render('QMS', [
            'is_admin' => $this->is_admin(),
            'is_team_leader' => $this->is_team_lead(),
            'date_range' => [
                'from' => $from,
                'to' => $to
            ],
            'team' => $team,
            'teams' => [$team],
            'agents' => [],
            'team_projects' => [],
            'projects' => []
        ]);
    }
    /**END OF TEAM LEADER'S FUNCTIONS*/
}
