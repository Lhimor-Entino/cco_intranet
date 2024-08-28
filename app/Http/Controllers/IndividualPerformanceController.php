<?php

namespace App\Http\Controllers;

use App\Models\IndividualPerformanceMetric;
use App\Models\IndividualPerformanceUserMetric;
use App\Models\Project;
use App\Models\ProjectHistory;
use App\Models\Team;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;

class IndividualPerformanceController extends Controller
{
    public function index(Request $request, $project_id = null)
    {
        $my_project_id = Auth::user()->project_id;
        $my_company_id = Auth::user()->company_id;
        /*When in TL Account only agents who is member of the team to be fetched. Commented By: JOSH*/
        $agents = $this->is_admin() || $this->is_team_lead() ?
            User::where('project_id', $project_id)
            ->when($this->is_team_lead() && !$this->is_admin(), function ($query) {
                $query->whereIn('team_id', self::LeadedTeams());
            })
            ->get()
            :
            User::where('project_id', $project_id)->where('id', Auth::id())->get();
        /*******************************************************************************************/
        $company_id = $request->company_id;
        //return response()->json(['condition' =>  $agents->contains('company_id', $company_id)]);
        $user = $company_id  ? User::where('company_id', $company_id)->where('project_id', $project_id)->firstOrFail() : Auth::user();

        $project_history = collect(
            self::LeadedProjectswithHistories()
        );
        $project_id = (int) $project_id;

        if (!$project_id) {
            $project_id = $user->project_id;
            if (!$project_id && !$this->is_admin()) abort(403, 'This account is not assigned to any project. Please contact your administrator.');
            if (!$project_id && $this->is_admin()) return redirect()->route('individual_performance_dashboard.index', ['project_id' => Project::first()->id]);
            return redirect()->route('individual_performance_dashboard.index', ['project_id' => $project_id]);
        };

        if (isset($project_id)) {
            if ($user->project_id != $project_id && !$project_history->contains('id', $project_id) && !$this->is_admin()) abort(403, 'This account is not assigned to this project. Please contact your administrator.');
            if ($user->project_id != $project_id && ($this->is_admin() || $this->is_team_lead())) return redirect()->route('individual_performance_dashboard.index', ['project_id' => $project_id, 'company_id' => (string)User::where('project_id', $project_id)->firstOrFail()->company_id]);
        }

        //abort 403 if not admin and not team lead, and company_id is not the same as $user->company_id
        if (!$this->is_admin() && !$this->is_team_lead() && isset($company_id) && $company_id != $my_company_id) abort(403);

        //abort 403 if $this->is_admin() is false and $this->is_team_lead() is true and $user->project_id is not the same as $my_project_id
        if (!$this->is_admin() && $this->is_team_lead() && !$project_history->contains('id', $project_id)) abort(403);


        /**Prevent Adding Day Commented by Josh*/
        $from = isset($request->date['from']) ? Carbon::parse($request->date['from'])->format('Y-m-d') : null;
        $to = isset($request->date['to']) ? Carbon::parse($request->date['to'])->format('Y-m-d') : $from;

        if (!$from) {
            /**UPDATE - Instead of setting default by previous month set it into current month. commented By JOSH*/
            $from = Carbon::now()->startOfMonth()->format('Y-m-d');
            $to = Carbon::now()->endOfMonth()->format('Y-m-d');
        }

        $user_metrics = $user ? IndividualPerformanceUserMetric::with(['metric'])
            ->when($from && !$to, function ($query) use ($from) {
                $query->where('date', $from);
            })
            ->when($from && $to, function ($query) use ($from, $to) {
                $query->whereBetween('date', [$from, $to]);
            })
            ->where('individual_performance_user_metrics.user_id', $user->id)
            /**SORT METRICS BY POSITION IN RENDERING DATASET BARCHART Commented By: JOSH**/
            ->join('individual_performance_metrics', 'individual_performance_user_metrics.individual_performance_metric_id', '=', 'individual_performance_metrics.id')
            ->orderBy('individual_performance_metrics.position', 'asc')
            ->get()
            : null;
        $agent_averages = null;
        $grouped_metrics = [];
        if (isset($user_metrics)) {
            foreach ($user_metrics as $metric) {
                $date = Carbon::parse($metric['date'])->format('Y-m-d');
                $metric['goal'] = self::UnitConversion(["unit" => $metric['unit'], "value" => $metric['goal']]);
                $found = false;

                foreach ($grouped_metrics as &$group) {
                    if ($group['date'] === $date) {
                        $group['metrics'][] = $metric;
                        $found = true;
                        break;
                    }
                }

                if (!$found) {
                    $grouped_metrics[] = [
                        'date' => $date,
                        'metrics' => [$metric]
                    ];
                }
            }
        }
        if (isset($user_metrics)) {
            $averages = [];
            foreach ($user_metrics as $userMetric) {
                $metricName = $userMetric->metric->metric_name;
                $metricIndex = array_search($metricName, array_column($averages, 'metric_name'));
                $metricPosition = $userMetric->metric->position;
                /**This modification doesn't accumulate no. of days & total if metric is not applicable. Commented By: JOSH**/
                if ($metricIndex !== false && $userMetric['is_applicable'] > 0) {
                    $averages[$metricIndex]['total'] += $userMetric->value;
                    $averages[$metricIndex]['days'] += 1;
                } else {
                    /**This modification excludes not applicable metrics in user. Commented By: JOSH**/
                    if ($userMetric['is_applicable'] > 0) {
                        array_push($averages, [
                            'unit' => $userMetric->unit,
                            'position' => $metricPosition,
                            'metric_name' => $metricName,
                            'average' => 0,
                            'total' => $userMetric->value,
                            'days' => 1,
                            'goal' => $userMetric->metric->goal
                        ]);
                    }
                }
            }
            foreach ($averages as $key => $average) {
                $averages[$key]['average'] = $average['total'] / $average['days'];
                //round to 2 decimal places 
                $averages[$key]['average'] = round($averages[$key]['average'], 2);
                $averages[$key]['goal'] =  self::UnitConversion(["unit" => $averages[$key]['unit'], "value" => $averages[$key]['goal']]);
            }

            $agent_averages = $averages;
        }


        return Inertia::render('IndividualPerformanceDashboard', [
            'is_admin' => $this->is_admin(),
            'is_team_leader' => $this->is_team_lead(),
            'project' => Project::with(['metrics'])->where('id', $project_id)->firstOrFail(),
            'project_histories' => $project_history,
            'agents' => $agents,
            'date_range' => [
                'from' => $from,
                'to' => $to
            ],
            'agent' => $user->load(['team']),
            'agent_averages' => $agent_averages,
            'grouped_metrics' => $grouped_metrics,
        ]);
    }
    /**
     * CONVERT GOAL VALUE INTO RESPECTIVE UNIT (DURATION) Commented by: JOSH
     * Note: Since duration format is saved as minutes.
     **/
    public function UnitConversion($data)
    {
        $result  = $data['value'];
        switch ($data['unit']) {
            case 'Seconds':
                $result =  $data['value'] * 60;
                break;
            case 'Hours':
                $result =  $data['value'] / 60;
                break;
            default:
                break;
        }
        return $result;
    }
    public function hasNoTeamContent($user)
    {
        $team = ["id" => 0, "name" => "(No Team) " . $user->last_name, "user" => $user, "user_id" => $user->id];
        $from = Carbon::now()->startOfMonth()->format('Y-m-d');
        $to = Carbon::now()->endOfMonth()->format('Y-m-d');
        return Inertia::render('TeamPerformanceDashboard', [
            'is_admin' => $this->is_admin(),
            'is_team_leader' => $this->is_team_lead(),
            'date_range' => [
                'from' => $from,
                'to' => $to
            ],
            'team' => $team,
            'teams' => [$team],
            'agents' => [],
            'user_breakdown' => [],
            'breakdown' => [],
            'team_trends' => [],
            'top_performers' => []
        ]);
    }
    public function team(Request $request, $team_id = null)
    {
        $user = Auth::user();
        $team = !$team_id ? Team::firstOrFail() : Team::where('id', $team_id)->firstOrFail();

        if (!$team_id) {
            if (isset($user->team_id)) return redirect()->route('individual_performance_dashboard.team', ['team_id' => $user->team_id]);
            if ($this->is_admin() && !isset($user->team_id)) return redirect()->route('individual_performance_dashboard.team', ['team_id' => $team->id]);
            if ($this->is_team_lead() && !isset($user->team_id)) {
                $team_id = Team::select('id')->where('user_id', $user->id)->pluck('id')->first() ?? 0;

                return $team_id <= 0 ? self::hasNoTeamContent($user) : redirect()->route('individual_performance_dashboard.team', ['team_id' => $team_id]);
            }
            abort(403, 'This account is not assigned to any team. Please contact your administrator.');
        }

        if ($user->team_id != $team_id && !$this->is_admin() && !$this->is_team_lead()) abort(403, 'This account is not assigned to this team. Please contact your administrator.');
        /**Prevent Adding Day Commented by Josh*/
        $from = isset($request->date['from']) ? Carbon::parse($request->date['from'])->format('Y-m-d') : null;
        $to = isset($request->date['to']) ? Carbon::parse($request->date['to'])->format('Y-m-d') : $from;
        if (!$from) {
            //set $from to first day of previous month, set $to to last day of previous month
            /**UPDATE - Instead of setting default by previous month set it into current month. commented By JOSH*/
            // $from = Carbon::now()->subMonth()->startOfMonth()->addHours(12)->format('Y-m-d');
            // $to = Carbon::now()->subMonth()->endOfMonth()->format('Y-m-d');
            $from = Carbon::now()->startOfMonth()->format('Y-m-d');
            $to = Carbon::now()->endOfMonth()->format('Y-m-d');
        }
        $users = User::where('team_id', $team->id)->get();


        $user_breakdown_raw = IndividualPerformanceUserMetric::select(
            'individual_performance_user_metrics.individual_performance_metric_id',
            'individual_performance_metrics.metric_name as Metric',
            'individual_performance_metrics.goal as Goal',
            'users.id as user_id',
            'users.first_name',
            'users.last_name',
            'users.company_id',
            DB::raw('count(*) as Days'),
            DB::raw('sum(individual_performance_user_metrics.value) as Total'),
            DB::raw('ROUND(sum(individual_performance_user_metrics.value) / count(*),2) as Average')
        )
            ->join('individual_performance_metrics', 'individual_performance_user_metrics.individual_performance_metric_id', '=', 'individual_performance_metrics.id')
            ->join('users', 'individual_performance_user_metrics.user_id', '=', 'users.id')
            ->where('users.team_id', $team->id)
            ->where(function ($query) use ($from, $to) {
                $query->when($from && !$to, function ($query) use ($from) {
                    $query->where('date', $from);
                })
                    ->when($from && $to, function ($query) use ($from, $to) {
                        $query->whereBetween('date', [$from, $to]);
                    });
            })
            ->whereIn('individual_performance_user_metrics.user_id', $users->pluck('id')->toArray())
            //add the line below to exclude user_metrics that have 0 as value - this are ticked as not applicable in the frontend
            ->where('individual_performance_user_metrics.value', '>', 0)
            ->groupBy(
                'individual_performance_user_metrics.individual_performance_metric_id',
                'individual_performance_metrics.metric_name',
                'users.id',
                'users.first_name',
                'users.last_name',
                'users.company_id',
                'individual_performance_metrics.goal'
            )
            ->get()
            ->toArray();

        $user_breakdown = [];
        foreach ($user_breakdown_raw as $user) {
            //check if user is already in the array
            $userIndex = array_search($user['user_id'], array_column($user_breakdown, 'user_id'));
            if ($userIndex !== false) {
                $user_breakdown[$userIndex]['metrics'][] = [
                    'Metric' => $user['Metric'],
                    'Days' => $user['Days'],
                    'Total' => $user['Total'],
                    'Average' => $user['Average']
                ];
            } else {
                array_push($user_breakdown, [
                    'user_id' => $user['user_id'],
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name'],
                    'company_id' => $user['company_id'],
                    'metrics' => [
                        [
                            'Metric' => $user['Metric'],
                            'Days' => $user['Days'],
                            'Total' => $user['Total'],
                            'Average' => $user['Average']
                        ]
                    ]
                ]);
            }
        }

        $breakdown = IndividualPerformanceUserMetric::select(
            'individual_performance_metric_id',
            'metric_name as Metric',
            'team_id',
            'individual_performance_metrics.goal as Goal',
            'individual_performance_metrics.unit as Unit',
            DB::raw('COUNT(*) as Days'),
            DB::raw('SUM(value) as Total'),
            DB::raw('ROUND(SUM(value)/COUNT(*),2) as Average')
        )
            ->join('individual_performance_metrics', 'individual_performance_user_metrics.individual_performance_metric_id', '=', 'individual_performance_metrics.id')
            ->join('users', 'individual_performance_user_metrics.user_id', '=', 'users.id')
            ->where('users.team_id', $team->id)
            ->where(function ($query) use ($from, $to) {
                $query->when($from && !$to, function ($query) use ($from) {
                    $query->where('date', $from);
                })
                    ->when($from && $to, function ($query) use ($from, $to) {
                        $query->whereBetween('date', [$from, $to]);
                    });
            })
            ->whereIn('individual_performance_user_metrics.user_id', $users->pluck('id')->toArray())
            //add the line below to exclude user_metrics that have 0 as value - this are ticked as not applicable in the frontend
            ->where('individual_performance_user_metrics.value', '>', 0)
            ->groupBy(
                'individual_performance_user_metrics.individual_performance_metric_id',
                'individual_performance_metrics.metric_name',
                'users.team_id',
                'individual_performance_metrics.goal'
            )
            /**Sorted by metrics position. commented by: JOSH**/
            ->orderBy('individual_performance_metrics.position', 'asc')
            ->get()
            ->toArray();

        /**
         * CONVERT GOAL VALUE INTO RESPECTIVE UNIT (DURATION) Commented by: JOSH
         * Note: Since duration format is saved as minutes.
         **/
        foreach ($breakdown as $index => $data) {
            $breakdown[$index]['Goal'] = self::UnitConversion(["unit" => $data['Unit'], "value" =>  $breakdown[$index]['Goal']]);
        }



        $team_trends = IndividualPerformanceUserMetric::select(
            'individual_performance_user_metrics.individual_performance_metric_id',
            'individual_performance_metrics.metric_name',
            'individual_performance_metrics.goal as goal',
            'individual_performance_metrics.unit as unit',
            DB::raw('DATE(individual_performance_user_metrics.date) as date'),
            DB::raw('SUM(individual_performance_user_metrics.value) as total'),
            DB::raw('ROUND(SUM(individual_performance_user_metrics.value)/COUNT(*), 2) as average')
        )
            ->join('individual_performance_metrics', 'individual_performance_user_metrics.individual_performance_metric_id', '=', 'individual_performance_metrics.id')
            ->whereIn('individual_performance_user_metrics.user_id', $users->pluck('id')->toArray())
            ->whereBetween('individual_performance_user_metrics.date', [$from, $to])
            //add the line below to exclude user_metrics that have 0 as value - this are ticked as not applicable in the frontend
            ->where('individual_performance_user_metrics.value', '>', 0)
            ->groupBy('individual_performance_user_metrics.date', 'individual_performance_user_metrics.individual_performance_metric_id', 'individual_performance_metrics.goal')
            ->orderBy('individual_performance_metrics.position', 'asc')
            ->orderBy('individual_performance_user_metrics.individual_performance_metric_id')
            ->orderBy('individual_performance_user_metrics.date')
            ->get()
            ->groupBy('individual_performance_metric_id')
            ->map(function ($metricData, $metricId) {
                return [
                    'individual_performance_metric_id' => $metricId,
                    'metric_name' => $metricData->first()->metric_name,

                    'goal' => self::UnitConversion(["unit" => $metricData->first()->unit, "value" => $metricData->first()->goal]), //$metricData->first()->goal,
                    'trends' => $metricData->map(function ($dateData) {
                        return [
                            'date' => $dateData->date,
                            'total' => $dateData->total,
                            'average' => $dateData->average,
                        ];
                    })->values()->all()
                ];
            })
            ->values()->all();


        $results = DB::table('individual_performance_user_metrics as a')
            ->join('individual_performance_metrics as b', 'a.individual_performance_metric_id', '=', 'b.id')
            ->join('users as c', 'a.user_id', '=', 'c.id')
            ->select(
                'c.company_id',
                'c.first_name',
                'c.last_name',
                'b.metric_name',
                'b.id as metric_id',
                'b.goal',
                DB::raw('SUM(a.value) as total_score'),
                DB::raw('AVG(a.value) as average')
            )
            ->where('c.team_id', $team->id)
            //add the line below to exclude user_metrics that have 0 as value - this are ticked as not applicable in the frontend
            ->where('a.value', '>', 0)
            ->whereBetween('a.date', [$from, $to])
            ->groupBy('c.company_id', 'c.first_name', 'c.last_name', 'b.metric_name', 'b.id', 'b.goal')
            /**Sorted by metrics position. commented by: JOSH**/
            ->orderBy('b.position', 'asc')
            ->get();

        $top_performers = [];
        foreach ($results as $result) {
            if (!isset($top_performers[$result->metric_id])) {
                $top_performers[$result->metric_id] = [
                    'metric_name' => $result->metric_name,
                    'metric_id' => $result->metric_id,
                    'goal' => $result->goal,
                    'top_five_performers' => [],
                ];
            }

            $top_performers[$result->metric_id]['top_five_performers'][] = [
                'company_id' => $result->company_id,
                'first_name' => $result->first_name,
                'last_name' => $result->last_name,
                'total_score' => $result->total_score,
                'average' => $result->average,
            ];
        }

        // Limit to top five performers for each metric
        foreach ($top_performers as &$top_performer) {
            usort($top_performer['top_five_performers'], function ($a, $b) {
                return $b['total_score'] <=> $a['total_score'];
            });
            $top_performer['top_five_performers'] = array_slice($top_performer['top_five_performers'], 0, 5);
        }

        if ($this->is_team_lead()) {
            $current_user = Auth::user();
            $teams = Team::where('user_id', $current_user->id)
                ->orWhere(function ($query) use ($current_user) {
                    if (isset($current_user->team_id)) {
                        $query->where('id', $current_user->team_id);
                    }
                })
                ->get();
        }


        return Inertia::render('TeamPerformanceDashboard', [
            'is_admin' => $this->is_admin(),
            'is_team_leader' => $this->is_team_lead(),
            'date_range' => [
                'from' => $from,
                'to' => $to
            ],
            'team' => $team,
            'teams' => $this->is_admin() ? Team::all() : ($this->is_team_lead() ? $teams : [$team]),
            'agents' => $users,
            'user_breakdown' => $user_breakdown,
            'breakdown' => $breakdown,
            'team_trends' => $team_trends,
            'top_performers' => array_values($top_performers)
        ]);
    }

    public function project(Request $request, $project_id = null)
    {
        $user = Auth::user();
        $project = !$project_id ? Project::first() : Project::where('id', $project_id)->firstOrFail();
        if (!$project_id) {
            if (isset($user->project_id)) return redirect()->route('individual_performance_dashboard.project', ['project_id' => $user->project_id]);
            if ($this->is_admin() && !isset($user->project_id)) return redirect()->route('individual_performance_dashboard.project', ['project_id' => $project->id]);
            abort(403, 'This account is not assigned to any Project. Please contact your administrator.');
        }

        $project_history = collect(
            ProjectHistory::join('projects', 'project_histories.project_id', '=', 'projects.id')
                ->where('project_histories.user_id', Auth::user()->id)
                ->select('projects.*')->groupBy('projects.id')->get()
        );

        if (!$project_history->contains('id', $project_id) && !$this->is_admin()) abort(403, 'This account is not assigned to this Project. Please contact your administrator.');
        /**Prevent Adding Day Commented by Josh*/
        $from = isset($request->date['from']) ? Carbon::parse($request->date['from'])->format('Y-m-d') : null;
        $to = isset($request->date['to']) ? Carbon::parse($request->date['to'])->format('Y-m-d') : $from;

        if (!$from) {
            /**UPDATE - Instead of setting default by previous month set it into current month. commented By JOSH*/
            //set $from to first day of previous month, set $to to last day of previous month
            // $from = Carbon::now()->subMonth()->startOfMonth()->addHours(12)->format('Y-m-d');
            // $to = Carbon::now()->subMonth()->endOfMonth()->format('Y-m-d');
            $from = Carbon::now()->startOfMonth()->format('Y-m-d');
            $to = Carbon::now()->endOfMonth()->format('Y-m-d');
        }
        $users = User::where('project_id', $project->id)->get();


        $user_breakdown_raw = IndividualPerformanceUserMetric::select(
            'individual_performance_user_metrics.individual_performance_metric_id',
            'individual_performance_metrics.metric_name as Metric',
            'individual_performance_metrics.goal as Goal',
            'users.id as user_id',
            'users.first_name',
            'users.last_name',
            'users.company_id',
            DB::raw('count(*) as Days'),
            DB::raw('sum(individual_performance_user_metrics.value) as Total'),
            DB::raw('ROUND(sum(individual_performance_user_metrics.value) / count(*),2) as Average')
        )
            ->join('individual_performance_metrics', 'individual_performance_user_metrics.individual_performance_metric_id', '=', 'individual_performance_metrics.id')
            ->join('users', 'individual_performance_user_metrics.user_id', '=', 'users.id')
            ->where('users.project_id', $project->id)
            ->where(function ($query) use ($from, $to) {
                $query->when($from && !$to, function ($query) use ($from) {
                    $query->where('date', $from);
                })
                    ->when($from && $to, function ($query) use ($from, $to) {
                        $query->whereBetween('date', [$from, $to]);
                    });
            })
            ->whereIn('individual_performance_user_metrics.user_id', $users->pluck('id')->toArray())
            //add the line below to exclude user_metrics that have 0 as value - this are ticked as not applicable in the frontend
            ->where('individual_performance_user_metrics.value', '>', 0)
            ->groupBy(
                'individual_performance_user_metrics.individual_performance_metric_id',
                'individual_performance_metrics.metric_name',
                'users.id',
                'users.first_name',
                'users.last_name',
                'users.company_id',
                'individual_performance_metrics.goal'
            )
            ->get()
            ->toArray();

        $user_breakdown = [];
        foreach ($user_breakdown_raw as $user) {
            //check if user is already in the array
            $userIndex = array_search($user['user_id'], array_column($user_breakdown, 'user_id'));
            if ($userIndex !== false) {
                $user_breakdown[$userIndex]['metrics'][] = [
                    'Metric' => $user['Metric'],
                    'Days' => $user['Days'],
                    'Total' => $user['Total'],
                    'Average' => $user['Average']
                ];
            } else {
                array_push($user_breakdown, [
                    'user_id' => $user['user_id'],
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name'],
                    'company_id' => $user['company_id'],
                    'metrics' => [
                        [
                            'Metric' => $user['Metric'],
                            'Days' => $user['Days'],
                            'Total' => $user['Total'],
                            'Average' => $user['Average']
                        ]
                    ]
                ]);
            }
        }


        $breakdown = IndividualPerformanceUserMetric::select(
            'individual_performance_metric_id',
            'metric_name as Metric',
            'users.project_id',
            'individual_performance_metrics.goal as Goal',
            'individual_performance_metrics.unit as Unit',
            DB::raw('COUNT(*) as Days'),
            DB::raw('SUM(value) as Total'),
            DB::raw('ROUND(SUM(value)/COUNT(*),2) as Average')
        )
            ->join('individual_performance_metrics', 'individual_performance_user_metrics.individual_performance_metric_id', '=', 'individual_performance_metrics.id')
            ->join('users', 'individual_performance_user_metrics.user_id', '=', 'users.id')
            ->where('users.project_id', $project->id)
            ->where(function ($query) use ($from, $to) {
                $query->when($from && !$to, function ($query) use ($from) {
                    $query->where('date', $from);
                })
                    ->when($from && $to, function ($query) use ($from, $to) {
                        $query->whereBetween('date', [$from, $to]);
                    });
            })
            ->whereIn('individual_performance_user_metrics.user_id', $users->pluck('id')->toArray())
            //add the line below to exclude user_metrics that have 0 as value - this are ticked as not applicable in the frontend
            ->where('individual_performance_user_metrics.value', '>', 0)
            ->groupBy(
                'individual_performance_user_metrics.individual_performance_metric_id',
                'individual_performance_metrics.metric_name',
                'users.project_id',
                'individual_performance_metrics.goal'
            )
            /**Sorted by metrics position. commented by: JOSH**/
            ->orderBy('individual_performance_metrics.position', 'asc')
            ->get()
            ->toArray();
        /**
         * CONVERT GOAL VALUE INTO RESPECTIVE UNIT (DURATION) Commented by: JOSH
         * Note: Since duration format is saved as minutes.
         **/
        foreach ($breakdown as $index => $data) {
            $breakdown[$index]['Goal'] = self::UnitConversion(["unit" => $data['Unit'], "value" => floatval($data['Goal'])]);
        }



        $project_trends = IndividualPerformanceUserMetric::select(
            'individual_performance_user_metrics.individual_performance_metric_id',
            'individual_performance_metrics.metric_name',
            'individual_performance_metrics.goal as goal',
            'individual_performance_metrics.unit as unit',
            DB::raw('DATE(individual_performance_user_metrics.date) as date'),
            DB::raw('SUM(individual_performance_user_metrics.value) as total'),
            DB::raw('ROUND(SUM(individual_performance_user_metrics.value)/COUNT(*), 2) as average')
        )
            ->join('individual_performance_metrics', 'individual_performance_user_metrics.individual_performance_metric_id', '=', 'individual_performance_metrics.id')
            ->whereIn('individual_performance_user_metrics.user_id', $users->pluck('id')->toArray())
            ->whereBetween('individual_performance_user_metrics.date', [$from, $to])
            //add the line below to exclude user_metrics that have 0 as value - this are ticked as not applicable in the frontend
            ->where('individual_performance_user_metrics.value', '>', 0)
            ->groupBy('individual_performance_user_metrics.date', 'individual_performance_user_metrics.individual_performance_metric_id', 'individual_performance_metrics.goal')
            // ->orderBy('individual_performance_user_metrics.individual_performance_metric_id')
            // ->orderBy('individual_performance_user_metrics.date')
            /**Sorted by metrics position. commented by: JOSH**/
            ->orderBy('individual_performance_metrics.position', 'asc')
            ->get()
            ->groupBy('individual_performance_metric_id')
            ->map(function ($metricData, $metricId) {
                return [
                    'individual_performance_metric_id' => $metricId,
                    'metric_name' => $metricData->first()->metric_name,

                    'goal' => self::UnitConversion(["unit" => $metricData->first()->unit, "value" => $metricData->first()->goal]), //$metricData->first()->goal,
                    'trends' => $metricData->map(function ($dateData) {
                        return [
                            'date' => $dateData->date,
                            'total' => $dateData->total,
                            'average' => $dateData->average,
                        ];
                    })->values()->all()
                ];
            })
            ->values()->all();


        $results = DB::table('individual_performance_user_metrics as a')
            ->join('individual_performance_metrics as b', 'a.individual_performance_metric_id', '=', 'b.id')
            ->join('users as c', 'a.user_id', '=', 'c.id')
            ->select(
                'c.company_id',
                'c.first_name',
                'c.last_name',
                'b.metric_name',
                'b.id as metric_id',
                'b.goal',
                DB::raw('SUM(a.value) as total_score'),
                DB::raw('AVG(a.value) as average')
            )
            ->where('c.project_id', $project->id)
            ->whereBetween('a.date', [$from, $to])
            //add the line below to exclude user_metrics that have 0 as value - this are ticked as not applicable in the frontend
            ->where('a.value', '>', 0)
            ->groupBy('c.company_id', 'c.first_name', 'c.last_name', 'b.metric_name', 'b.id', 'b.goal')
            /**Sorted by metrics position. commented by: JOSH**/
            ->orderBy('b.position', 'asc')
            ->get();

        $top_performers = [];
        foreach ($results as $result) {
            if (!isset($top_performers[$result->metric_id])) {
                $top_performers[$result->metric_id] = [
                    'metric_name' => $result->metric_name,
                    'metric_id' => $result->metric_id,
                    'goal' => $result->goal,
                    'top_five_performers' => [],
                ];
            }

            $top_performers[$result->metric_id]['top_five_performers'][] = [
                'company_id' => $result->company_id,
                'first_name' => $result->first_name,
                'last_name' => $result->last_name,
                'total_score' => $result->total_score,
                'average' => $result->average,
            ];
        }

        // Limit to top five performers for each metric
        foreach ($top_performers as &$top_performer) {
            usort($top_performer['top_five_performers'], function ($a, $b) {
                return $b['total_score'] <=> $a['total_score'];
            });
            $top_performer['top_five_performers'] = array_slice($top_performer['top_five_performers'], 0, 5);
        }





        return Inertia::render('ProjectPerformanceDashboard', [
            'is_admin' => $this->is_admin(),
            'is_team_leader' => $this->is_team_lead(),
            'date_range' => [
                'from' => $from,
                'to' => $to
            ],
            'project' => $project,
            'projects' => $this->is_admin() ? Project::all() : [$project],
            'agents' => $users,
            'user_breakdown' => $user_breakdown,
            'breakdown' => $breakdown,
            'project_trends' => $project_trends,
            'project_histories' => $project_history,
            'top_performers' => array_values($top_performers)
        ]);
    }

    public function settings($project_id = null)
    {
        if (!$this->is_admin()) abort(403);
        return Inertia::render('IndividualPerformanceSettings', [
            'metrics' => !$project_id ? null : IndividualPerformanceMetric::where('project_id', $project_id)->orderBy('position', 'asc')->get(),
            'project' => $project_id ? Project::findOrFail($project_id) : null
        ]);
    }

    public function store(Request $request)
    {
        if (!$this->is_admin()) abort(403);
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'metric_name' => 'required',
            'goal' => 'required|numeric',
            'format' => 'required|in:number,percentage,duration,rate',
            'unit' => 'nullable',
            'rate_unit' => 'nullable'
        ]);
        $duration =  0;
        if ($request->format == 'duration' && $request->unit == 'Minutes') $duration = $request->goal;
        if ($request->format == 'duration' && $request->unit == 'Seconds') $duration = $request->goal / 60.00;
        if ($request->format == 'duration' && $request->unit == 'Hours') $duration = $request->goal * 60.00;

        // Set goal with 15 decimal places in order to preserve value precision for accuracy conversion. Commented By Josh
        IndividualPerformanceMetric::create([
            'project_id' => $request->project_id,
            'user_id' => Auth::id(),
            'metric_name' => $request->metric_name,
            'goal' => !($request->format == 'duration') ? $request->goal : number_format($duration, 15),
            'format' => $request->format,
            'unit' => $request->unit,
            'rate_unit' => $request->rate_unit
        ]);
        return redirect()->back();
    }

    public function update(Request $request, $metric_id)
    {
        if (!$this->is_admin()) abort(403);

        $request->validate([
            'metric_name' => 'required',
            'goal' => 'required|numeric',
            'format' => 'required|in:number,percentage,duration,rate',
            'unit' => 'nullable',
            'rate_unit' => 'nullable'
        ]);
        $duration =  0;
        if ($request->format == 'duration' && $request->unit == 'Minutes') $duration = $request->goal;
        if ($request->format == 'duration' && $request->unit == 'Hours') $duration = $request->goal * 60;
        if ($request->format == 'duration' && $request->unit == 'Seconds') $duration = $request->goal / 60;

        $metric = IndividualPerformanceMetric::findOrFail($metric_id);
        // Set goal with 15 decimal places in order to preserve value precision for accuracy conversion. Commented By Josh
        $metric->update([
            'metric_name' => $request->metric_name,
            'goal' => $request->format != 'duration' ? $request->goal : $duration, //number_format($duration, 15),
            'format' => $request->format,
            'unit' => $request->unit,
            'rate_unit' => $request->rate_unit
        ]);
        return redirect()->back();
    }

    /**JOSH - ADDED SAVE COLUMN REODERING*************************************************************/
    public function order(Request $request)
    {
        if (!$this->is_admin()) abort(403);
        $metrics = $request['metrics'];
        foreach ($metrics as $metric) {
            $data = IndividualPerformanceMetric::findOrFail($metric['id']);
            $data->update(['position' => $metric['position']]);
        }
        return redirect()->back();
    }
    /*************************************************************************************************/
    public function destroy($metric_id)
    {
        if (!$this->is_admin()) abort(403);
        $metric = IndividualPerformanceMetric::findOrFail($metric_id);
        $metric->delete();
        return redirect()->back();
    }

    public function rating(Request $request, $project_id = null)
    {
        if (!$this->is_admin() && !$this->is_team_lead()) abort(403);
        $date = $request->date;
        if (!$date) $date = Carbon::now()->format('Y-m-d');
        $user = Auth::user();
        $project = null;
        $leaded_projects =  collect(self::LeadedProjects());
        if ($project_id && $this->is_admin()) {
            $project = Project::with(['metrics'])->where('id', $project_id)->firstOrFail();
        }
        if ($project_id && $this->is_team_lead() && !$this->is_admin()) {
            // if ($user->project_id != $project_id) abort(403);
            if (!$leaded_projects->contains('id', $project_id)) abort(403);
            $project = Project::with(['metrics'])->where('id', $project_id)->firstOrFail();
        }

        if (!$project_id && $this->is_admin()) {
            $project = Project::with(['metrics'])->first();
        }

        if (!$project_id && $this->is_team_lead() && !$this->is_admin()) {
            // if (!$user->project_id) abort(403);
            if (empty($leaded_projects)) abort(403);
            $project = Project::with(['metrics'])->where('id', $user->project_id)->firstOrFail();
        }

        $agents = User::with(['user_metrics' => function ($q) use ($date) {
            return $q->where('date', $date);
        }])
            ->where('project_id', $project->id)
            ->when(($this->is_team_lead() && !$this->is_admin()), function ($query) {
                /*if role is team lead filter dataset with leaded teams only.*/
                $query->whereIn('team_id', self::LeadedTeams());
            })
            ->get();

        return Inertia::render('IndividualPerformanceRatingForm', [
            'is_admin' => $this->is_admin(),
            'is_team_leader' => $this->is_team_lead(),
            'project' => $project,
            'agents' => $agents,
            'date' => $date,
            'leaded_projects' => $leaded_projects
        ]);
    }

    public function save_rating(Request $request)
    {
        $date = $request->date;
        $user_ratings = $request->ratings;
        $user_id = $request->user_id;
        /*
        metric_id:number;
        user_metric_id:number;
        score:number;
        */
        DB::transaction(function () use ($date, $user_ratings, $user_id) {
            foreach ($user_ratings as $rating) {
                $payload = [
                    "metric_id" => $rating['metric_id'],
                    "user_id" => $user_id,
                    "date" => $date
                ];
                /**Check User Rate Exist Commented by: JOSH**/
                $rating['user_metric_id'] = $rating['user_metric_id'] > 0 ? $rating['user_metric_id'] : self::CheckUserMetric($payload);
                if ($rating['user_metric_id'] == 0) {
                    IndividualPerformanceUserMetric::create([
                        'individual_performance_metric_id' => $rating['metric_id'],
                        'user_id' => $user_id,
                        'value' => !$rating['not_applicable'] ? $rating['score'] : 0,
                        'is_applicable' => !$rating['not_applicable'] ? 1 : 0,
                        'date' => $date
                    ]);
                } else {
                    $user_metric = IndividualPerformanceUserMetric::findOrFail($rating['user_metric_id']);
                    $user_metric->update([
                        'is_applicable' => !$rating['not_applicable'] ? 1 : 0,
                        'value' => !$rating['not_applicable'] ? $rating['score'] : 0,
                    ]);
                }
            }
        });
        return redirect()->back();
    }

    /**Check User Rate Exist Commented by: JOSH**/
    public function CheckUserMetric($payload): int
    {
        $isExist = IndividualPerformanceUserMetric::where('individual_performance_metric_id', $payload['metric_id'])
            ->where('user_id', $payload['user_id'])
            ->where('date', $payload['date'])
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
            $user->position == 'TEAM LEAD 1' ||
            $user->position == 'TEAM LEAD 2' ||
            $user->position == 'TEAM LEAD 3' ||
            $user->position == 'TEAM LEAD 4' ||
            $user->position == 'TEAM LEAD 5' ||
            $user->position == 'TEAM LEAD 6' ||
            $user->position == 'TEAM LEAD' ||
            $this->is_admin();
    }

    /**TEAM LEADER'S FUNCTIONS*/
    private function LeadedTeams()
    {
        $user = Auth::user();
        $team_ids = Team::where('user_id', $user->id)->pluck('id');
        return $team_ids;
    }
    private function LeadedProjects()
    {
        $user = Auth::user();
        $projects = [];
        $projects = Project::join('users', 'projects.id', '=', 'users.project_id')
            ->when($this->is_team_lead() && !$this->is_admin(), function ($query) {
                $query->whereIn('users.team_id', self::LeadedTeams());
            })
            ->when((($user->project_id ?? 0) > 0), function ($query) use ($user) {
                $query->orWhere('projects.id', $user->project_id);
            })
            ->select('projects.*')
            ->groupBy('projects.id')
            ->get();

        return $projects;
    }
    private function LeadedProjectswithHistories()
    {
        $projects = [];
        $projects =  ProjectHistory::join('projects', 'project_histories.project_id', '=', 'projects.id')
            ->join('users', 'projects.id', '=', 'users.project_id')
            ->orWhereIn('users.team_id', self::LeadedTeams())
            ->orWhere('project_histories.user_id', Auth::user()->id)
            ->select('projects.*')->groupBy('projects.id')->get();
        return  $projects;
    }
    /**END OF TEAM LEADER'S FUNCTIONS*/
}
