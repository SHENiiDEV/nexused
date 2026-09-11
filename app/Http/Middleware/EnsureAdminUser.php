<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminUser
{
    /**
     * Handle an incoming request.
     * Restrict access exclusively to users authenticated with an admin account.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->guest(route('login'));
        }

        // Restrict to admin users only (login must be admin account)
        if (! $user->isAdmin() || (! str_starts_with($user->email, 'admin@') && $user->email !== 'admin')) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Access denied. Only the admin account can access this section.',
                ], 403);
            }

            abort(403, 'Access denied. Only users authenticated with the admin account can access the administration portal.');
        }

        return $next($request);
    }
}
