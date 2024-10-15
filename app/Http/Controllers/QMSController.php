<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectHistory;
use App\Models\Team;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QMSController extends Controller
{
    public function index(Request $request, $team_id = null, $project_id = null)
    {
        $user = Auth::user();
        $team = !$team_id ? Team::firstOrFail() : Team::where('id', $team_id)->firstOrFail();
        // if (!$team_id) {
        //     if (isset($user->team_id)) return redirect()->route('quality_management_system.index', ['team_id' => $user->team_id]);
        //     if ($this->is_admin() && !isset($user->team_id)) return redirect()->route('quality_management_system.index', ['team_id' => $team->id]);
        //     if ($this->is_team_lead() && !isset($user->team_id)) {
        //         $team_id = Team::select('id')->where('user_id', $user->id)->pluck('id')->first() ?? 0;

        //         return $team_id <= 0 ? self::hasNoTeamContent($user) : redirect()->route('quality_management_system.index', ['team_id' => $team_id]);
        //     }
        //     abort(403, 'This account is not assigned to any team. Please contact your administrator.');
        // }
        $from = isset($request->date['from']) ? Carbon::parse($request->date['from'])->format('Y-m-d') : null;
        $to = isset($request->date['to']) ? Carbon::parse($request->date['to'])->format('Y-m-d') : $from;
        if (!$from) {
            $from = Carbon::now()->startOfMonth()->format('Y-m-d');
            $to = Carbon::now()->endOfMonth()->format('Y-m-d');
        }
        $tl_user = User::where('id', $team->user_id)->first();
        $projects = collect(self::LeadedProjectswithHistories($tl_user));
        $users = User::where('team_id', $team->id)->where('users.project_id', $project_id)->get();
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
            'agents' => $users
        ]);
    }
    /******[SUPPORT]******************************************************************************************************************************/
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
    private function hasNoTeamContent() {}
    /**END OF TEAM LEADER'S FUNCTIONS*/
}