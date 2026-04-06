<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class EnsureEmailIsVerified
{
    public function handle(Request $request, Closure $next)
    {
        // Skip verification check for superadmin
        if ($request->user() && $request->user()->type === 'superadmin') {
            return $next($request);
        }

        // Optional Soft Verification: Allow access but share verification status.
        // The frontend will show a non-intrusive banner for unverified users.
        // Email verification status is shared via Inertia (HandleInertiaRequests).
        return $next($request);
    }
}
