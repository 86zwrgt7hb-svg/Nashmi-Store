<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SecurityAuditLog
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        if ($response->getStatusCode() === 401 || $response->getStatusCode() === 403) {
            Log::channel("security")->warning("Access denied", [
                "ip" => $request->ip(),
                "url" => $request->fullUrl(),
                "method" => $request->method(),
                "user_agent" => $request->userAgent(),
                "user_id" => $request->user()?->id,
                "status" => $response->getStatusCode(),
            ]);
        }
        
        if (str_starts_with($request->path(), "dashboard") || str_starts_with($request->path(), "admin")) {
            Log::channel("security")->info("Admin access", [
                "ip" => $request->ip(),
                "url" => $request->path(),
                "user_id" => $request->user()?->id,
                "method" => $request->method(),
            ]);
        }
        
        return $response;
    }
}
