<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\SpotVaccine;
use App\Models\Vaccination;
use Carbon\Carbon;
use Illuminate\Http\Request;

class VaccinationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
//   use App\Models\Vaccination;
// use Illuminate\Http\Request;

public function index(Request $request)
{
    $user = $request->attributes->get('auth_user');


    if (!$user) {
        return response()->json([
            'message' => 'Unauthorized user'
        ], 401);
    }

    
    $vaccinations = Vaccination::with([
        'spot.regional',
        'vaccine',
        'vaccinator'
    ])
    ->where('society_id', $user->id)
    ->orderBy('dose')
    ->get();

    $response = [
        'vaccinations' => [
            'first' => null,
            'second' => null
        ]
    ];

    foreach ($vaccinations as $vaccination) {

        $data = [
            'queue' =>  Vaccination::where('spot_id', $vaccination->spot_id)
    ->whereDate('date', $vaccination->date)
    ->count(),
            'dose' => $vaccination->dose,
            'vaccination_date' => $vaccination->date,
            'spot' => [
                'id' => $vaccination->spot->id,
                'name' => $vaccination->spot->name,
                'address' => $vaccination->spot->address,
                'serve' => $vaccination->spot->serve,
                'capacity' => $vaccination->spot->capacity,
                'regional' => [
                    'id' => $vaccination->spot->regional->id,
                    'province' => $vaccination->spot->regional->province,
                    'district' => $vaccination->spot->regional->district,
                ]
            ],
            'status' => 'done',
            'vaccine' => [
                'id' => $vaccination->vaccine->id,
                'name' => $vaccination->vaccine->name,
            ],
            'vaccinator' => [
                'id' => $vaccination->vaccinator->id,
                'role' => $vaccination->vaccinator->role,
                'name' => $vaccination->vaccinator->name,
            ] 
        ];

        if ($vaccination->dose === 1) {
            $response['vaccinations']['first'] = $data;
        }

        if ($vaccination->dose === 2) {
            $response['vaccinations']['second'] = $data;
        }
    }

    return response()->json($response, 200);
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
    $user = $request->attributes->get('auth_user');

    if (!$user) {
        return response()->json([
            'message' => 'Unauthorized user'
        ], 401);
    }

    $request->validate([
        "spot_id" => "required",
        "date" => "required|date",
    ]);

    $konsultasi = Consultation::where('society_id', $user->id)
        ->where('status', 'accepted')
        ->first();

    if (!$konsultasi) {
        return response()->json([
            'message' => 'Your consultation must be accepted by doctor before'
        ], 401);
    }

    $vaksinasi = Vaccination::where('society_id', $user->id)
        ->orderBy('date', 'asc')
        ->get();

    if ($vaksinasi->count() >= 2) {
        return response()->json([
            'message' => 'Society has been 2x vaccinated'
        ], 401);
    }

    $dose = $vaksinasi->count() + 1;

    if ($dose === 2) {
        $vaksinKeSatu = Carbon::parse($vaksinasi->first()->date);
        $tanggalInput = Carbon::parse($request->date);

        if ($tanggalInput->lessThanOrEqualTo($vaksinKeSatu)) {
            return response()->json([
                'message' => 'Second vaccination date must be after first vaccination'
            ], 401);
        }

        if ($tanggalInput->lessThan($vaksinKeSatu->copy()->addDays(30))) {
            return response()->json([
                'message' => 'Wait at least +30 days from 1st Vaccination'
            ], 401);
        }
    }

    $spotVaccine = SpotVaccine::where('spot_id', $request->spot_id)->first();

    if (!$spotVaccine) {
        return response()->json([
            'message' => 'Vaccine not available in this spot'
        ], 401);
    }

    Vaccination::create([
        "dose" => $dose,
        "date" => $request->date,
        "society_id" => $user->id,
        "spot_id" => $request->spot_id,
       "vaccine_id" => $spotVaccine->vaccine_id,
        "doctor_id" => $konsultasi->doctor_id
    ]);

    return response()->json([
        "message" => $dose === 1
            ? 'First vaccination registered successful'
            : 'Second vaccination registered successful'
    ]);
}



  

    /**
     * Display the specified resource.
     */
    public function show(Vaccination $vaccination)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vaccination $vaccination)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vaccination $vaccination)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vaccination $vaccination)
    {
        //
    }
}
