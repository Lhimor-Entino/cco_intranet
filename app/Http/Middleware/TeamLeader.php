<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TeamLeader
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        /*
        only allow access to the following positions:
        GENERAL MANAGER
        OPERATIONS MANAGER
        OPERATIONS SUPERVISOR
        OPERATIONS SUPERVISOR 2
        QUALITY ANALYST
        QUALITY ANALYST 1
        QUALITY ANALYST 2
        QUALITY ANALYST 4
        QUALITY ANALYST 5
        QUALITY ANALYST 6
        QUALITY ASSURANCE AND TRAINING SUPERVISOR
        REAL TIME ANALYST
        REPORTS ANALYST
        TEAM LEADER
        TEAM LEADER 1
        TEAM LEADER 2
        TEAM LEADER 3
        TEAM LEADER 4
        TEAM LEADER 5
        TEAM LEADER 6
        */
        if (
            auth()->user()->position == "PROGRAMMER" ||
            auth()->user()->position == "GENERAL MANAGER" ||
            auth()->user()->position == "OPERATIONS MANAGER" ||
            auth()->user()->position == "OPERATIONS SUPERVISOR" ||
            auth()->user()->position == "OPERATIONS SUPERVISOR 2" ||
            auth()->user()->position == "QUALITY ANALYST" ||
            auth()->user()->position == "QUALITY ANALYST 1" ||
            auth()->user()->position == "QUALITY ANALYST 2" ||
            auth()->user()->position == "QUALITY ANALYST 4" ||
            auth()->user()->position == "QUALITY ANALYST 5" ||
            auth()->user()->position == "QUALITY ANALYST 6" ||
            auth()->user()->position == "QUALITY ASSURANCE AND TRAINING SUPERVISOR" ||
            auth()->user()->position == "REAL TIME ANALYST" ||
            auth()->user()->position == "REPORTS ANALYST" ||
            auth()->user()->position == "TEAM LEADER" ||
            auth()->user()->position == "TEAM LEADER 1" ||
            auth()->user()->position == "TEAM LEADER 2" ||
            auth()->user()->position == "TEAM LEADER 3" ||
            auth()->user()->position == "TEAM LEADER 4" ||
            auth()->user()->position == "TEAM LEADER 5" ||
            auth()->user()->position == "TEAM LEADER 6" ||
            auth()->user()->position == "TEAM LEAD" ||
            auth()->user()->position == "TEAM LEAD 1" ||
            auth()->user()->position == "TEAM LEAD 2" ||
            auth()->user()->position == "TEAM LEAD 3" ||
            auth()->user()->position == "TEAM LEAD 4" ||
            auth()->user()->position == "TEAM LEAD 5" ||
            auth()->user()->position == "TEAM LEAD 6"
        ) {
            return $next($request);
        }
        abort(403, 'Only Team Leaders,RTAs and Supervisors are allowed to access this page.');
    }
}
