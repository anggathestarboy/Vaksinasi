<?php

namespace App\Http\Middleware;

use App\Models\Society;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TokenMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $token = $request->query('token');

        if (!$token) {
            return response()->json([
                "message" => "Invalid token"
            ]);
        }


        $user = Society::where("login_tokens", $token)->first();


        if (!$user) {
          return response()->json([
                "message" => "Invalid token"
            ]);
        }

        $request->attributes->set('auth_user', $user);

        return $next($request);
    }
}
