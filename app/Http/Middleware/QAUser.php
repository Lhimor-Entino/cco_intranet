<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class QAUser
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
        if (
            // ADMIN
            auth()->user()->position == "OPERATIONS MANAGER" ||
            auth()->user()->position == "GENERAL MANAGER" ||
            auth()->user()->position == "PROGRAMMER" ||
            auth()->user()->position == "OPERATIONS SUPERVISOR" ||
            auth()->user()->position == "OPERATIONS SUPERVISOR 2" ||
            // QA
            auth()->user()->position == "TRAINING & QUALITY OFFICER" ||
            auth()->user()->position == "QUALITY ANALYST" ||
            auth()->user()->position == "QUALITY ASSURANCE AND TRAINING SUPERVISOR"

        ) {
            return $next($request);
        }
        abort(403, 'Only QA Users,RTAs and Supervisors are allowed to access this page.');
    }
}
