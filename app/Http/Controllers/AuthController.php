<?php

namespace App\Http\Controllers;

use App\Models\Society;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            "id_card_number" => "required",
            "password" => "required",
        ]);

        $user = Society::where('id_card_number', $request->id_card_number)->first();
        $password = Society::where("password", $request->password)->first();


        if ($user && $password) {
           $token = md5(uniqid());
           $user->login_tokens = $token;
           $user->save();
        return response()->json($user->load('regional'));

          
        }


        return response()->json([
            "message" => "ID Card Number or Password incorrect"
        ], 401);

    }



    public function logout(Request $request) {
      $user =    $request->attributes->get('auth_user');   
      $user->login_tokens = null;
      $user->update();

      return response()->json([
        "message" => "Logout success" 
      ]);

    }
}
