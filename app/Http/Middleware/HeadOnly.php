<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HeadOnly
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
            Allow only access for the following positions:
            PROGRAMMER
            REPORTS ANALYST
            REAL TIME ANALYST
            QUALITY ASSURANCE AND TRAINING SUPERVISOR
            QUALITY ANALYST 6
            QUALITY ANALYST 5
            QUALITY ANALYST 4
            QUALITY ANALYST 3
            QUALITY ANALYST 2
            QUALITY ANALYST 1
            QUALITY ANALYST
            OPERATIONS SUPERVISOR 2
            OPERATIONS SUPERVISOR
            OPERATIONS MANAGER
            GENERAL MANAGER
        */

        if (auth()->user()->position == 'PROGRAMMER' || auth()->user()->position == 'REPORTS ANALYST' || auth()->user()->position == 'REAL TIME ANALYST' || auth()->user()->position == 'QUALITY ASSURANCE AND TRAINING SUPERVISOR' || auth()->user()->position == 'QUALITY ANALYST 6' || auth()->user()->position == 'QUALITY ANALYST 5' || auth()->user()->position == 'QUALITY ANALYST 4' || auth()->user()->position == 'QUALITY ANALYST 3' || auth()->user()->position == 'QUALITY ANALYST 2' || auth()->user()->position == 'QUALITY ANALYST 1' || auth()->user()->position == 'QUALITY ANALYST' || auth()->user()->position == 'OPERATIONS SUPERVISOR 2' || auth()->user()->position == 'OPERATIONS SUPERVISOR' || auth()->user()->position == 'OPERATIONS MANAGER' || auth()->user()->position == 'GENERAL MANAGER') {
            return $next($request);
        }
        abort(403, 'Only Head/Manager/Supervisor of the Department can access this page.');
    }
}
