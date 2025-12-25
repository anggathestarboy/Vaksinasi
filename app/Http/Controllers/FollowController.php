<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Follow;
// use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
    }


    public function getFollower(Request $request, $username) {
        $user = Auth::user();
            $lihatFollowing = User::where('username', $username)->first();

            if (!$lihatFollowing) {
               return response()->json([
                "message" => "User not found"
               ]);
            }

        $data =    Follow::where('following_id', $lihatFollowing->id)->with('follower')->get();

        $result = $data->map(function($d) {
            return [
                "id" => $d->id,
                "full_name" => $d->follower->full_name,
                "username" => $d->follower->username,
                "bio" => $d->follower->bio,
                "is_private" => $d->follower->is_private,
                "created_at" => $d->follower->created_at,
                "is_requested" => $d->is_accepted ? false : true
            ];
        });


        return response()->json(["follower" => $result]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function acceptUser(Request $request, $username) {
            $user = Auth::user();

            $userKonfirmasi = User::where('username', $username)->first();

            if (!$userKonfirmasi) {
              return response()->json([
                "message" => "User not found"
              ], 404);
            }

            


            $cek = Follow::where(['follower_id' => $userKonfirmasi->id,
            'following_id' => $user->id
        ])->first();

        if (!$cek) {
           return response()->json([
                "message" => "The user is not following you"
           ], 422);
        }

        if ($cek->is_accepted === 1) {
           return response()->json([
            "message" => "Follow request is already accepted"
           ], 422);
        }


       



        $cek->is_accepted = true;
        $cek->save();
      

        return response()->json([
            "message" => "Follow request accepted"
        ]);
    }


    


    function getFollowing(Request $request, $username) {
             $user = Auth::user();
            $lihatFollowing = User::where('username', $username)->first();

            if (!$lihatFollowing) {
               return response()->json([
                "message" => "User not found"
               ]);
            }


                $data =    Follow::where('follower_id', $lihatFollowing->id)->with('following')->get();

        $result = $data->map(function($d) {
            return [
                "id" => $d->id,
                "full_name" => $d->following->full_name,
                "username" => $d->following->username,
                "bio" => $d->following->bio,
                "is_private" => $d->following->is_private,
                "created_at" => $d->following->created_at,
                "is_requested" => $d->is_accepted ? false : true
            ];
        });


        return response()->json(["following" => $result]);

    }


  

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $username)
    {
        $user = Auth::user();

        $userDiFollow = User::where('username', $username)->first();


        if (!$userDiFollow) {
            return response()->json([
                "message" => "User not found"
            ], 404);
        }

        if ($user->id === $userDiFollow->id) {
            return response()->json([
                "message" => "You are not allowed to follow yourself"
            ], 422);
        }


        $cek = Follow::where([
            'follower_id' => $user->id,
            'following_id' => $userDiFollow->id,
        ])->first();
        // return response()->json($cek);
        if ($cek) {
            return response()->json([
                "message" => "You are already followed",
                "status" => $cek->is_accepted === 0 ? "Requested" : "Following"
            ], 422);
        }


        $isPrivate  =     $userDiFollow->is_private === 1 ? 0 : 1;




        $createFollow =  Follow::create([
            "follower_id" => $user->id,
            "following_id" => $userDiFollow->id,
            "is_accepted" => $isPrivate
        ]);


        return response()->json([
            "message" => "Follow success",
            "status" => $createFollow->is_accepted === 1 ? "following" : "requested"
        ]);
    }

    
    public function unFollow(Request $request, $username) {

        
 $user = Auth::user();

        $userDiFollow = User::where('username', $username)->first();

 if (!$userDiFollow) {
           return response()->json([
"message" => "User not found"
           ]);
        }

    $cek = Follow::where([
            'follower_id' => $user->id,
            'following_id' => $userDiFollow->id,
        ])->first();

       

        if (!$cek) {
            return response()->json([
                "message" => "You are not following the user"
            ]);
        }

        $cek->delete();


        return response()->json($cek, 204);

    }

    /**
     * Display the specified resource.
     */
    public function show(Follow $follow)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Follow $follow)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Follow $follow)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Follow $follow)
    {
        //
    }
}
