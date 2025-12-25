<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request) {
   $data =    $request->validate([
    "full_name" => "required",
    "bio" => "required|max:100",
    "username" => "required|string|min:3|unique:users,username|regex:/^[a-zA-Z0-9._]+$/",
    "password" => "required|min:6",
    "is_private" => "nullable",
]);


User::create($data);


$user = User::where('username', $request->username)->first();
$token = $user->createToken('auth_token')->plainTextToken;



return response()->json([
    "message" => "Register success",
    "token" => $token,
    "user" => $user
]);




    }




public function getDetailUser($username)
{
    $user = User::where('username', $username)->first();

    if (!$user) {
        return response()->json([
            'message' => 'User not found'
        ], 404);
    }

    $authUser = Auth::user();

    if (!$authUser) {
        return response()->json([
            'message' => 'Unauthenticated'
        ], 401);
    }

    // Ambil data follow (kalau ada)
    $follow = Follow::where('follower_id', $authUser->id)
        ->where('following_id', $user->id)
        ->first();

    $isFollowing = $follow !== null;
    $isAccepted  = $follow && $follow->is_accepted == 1;

        $isAccepted = Follow::where('follower_id', $authUser->id)
    ->where('following_id', $user->id)
    ->where('is_accepted', 1)
    ->exists();

    // 🔐 AKUN PRIVATE - BLOK AKSES
    if (
        $user->is_private == 1 &&
        $authUser->id !== $user->id &&
        (!$isFollowing || !$isAccepted)
    ) {
        return response()->json([
            'message' => 'This account is private',
            'is_private' => true,
            "is_accepted" => $isAccepted,
            "full_name" => $user->full_name,
            "username" => $user->username,
            "bio" => $user->bio,
            'follow_status' => $isFollowing ? 'requested' : 'not_following',
            'posts_count' => $user->posts()->count(),
            'follower_count' => Follow::where('following_id', $user->id)->count(),
            'following_count' => Follow::where('follower_id', $user->id)->count(),
        ], 403);
    }



   
    $user->load('posts.attachments')->loadCount('posts');

    return response()->json([
        'user' => $user,
            "follow_status" => $isAccepted  ? "sudah" : "belum",

         'is_accepted' => $isAccepted  ,
        'follower_count' => Follow::where('following_id', $user->id)->count(),
        'following_count' => Follow::where('follower_id', $user->id)->count(),
    ]);
}




    public function getAllUser() {
        $users = User::all();
        return response()->json($users);
    }



    public function login(Request $request) {
        $request->validate([
            "username" => "required",
            "password" => "required",
        ]);


        $user = User::where('username', $request->username)->first();
        if ($user  && Hash::check($request->password, $user->password)) {
            $token = $user->createToken("auth_token")->plainTextToken;
            return response()->json([
    "message" => "Login success",
    "token" => $token,
    "user" => $user
]);
        }
        else {
          return response()->json([ "message" => "Wrong username or password"], 401);

        }
    }


    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            "message" => "Logout success"
        ]);
    }
}
