<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->attributes->get('auth_user')->id;


        $konsultasi = Consultation::where('society_id', $user)->with('doctor')->get();


        return response()->json($konsultasi);



    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'disease_history' => "nullable",
            "current_symptoms" => "nullable"
        ]);

        
        $user = $request->attributes->get('auth_user');

        Consultation::create([
            "society_id" => $user->id,
            "disease_history" => $request->disease_history,
            "current_symptoms" => $request->current_symptoms
        ]);


        return response()->json([
            "message" => "Request consultation sent successful"
        ]);
        





    }

    /**
     * Display the specified resource.
     */
    public function show(Consultation $consultation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Consultation $consultation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Consultation $consultation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Consultation $consultation)
    {
        //
    }
}
