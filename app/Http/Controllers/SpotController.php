<?php

namespace App\Http\Controllers;

use App\Models\Spot;
use App\Models\Society;
use App\Models\Vaccination;
use App\Models\Consultation;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class SpotController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index(Request $request)
{
    $userId = $request->attributes->get('auth_user')->id;

    $konsultasi = Consultation::with('society')
        ->where('society_id', $userId)
        ->where('status', 'accepted')
        ->get();

    $societyIds = $konsultasi
        ->pluck('society.regional_id')
        ->unique()
        ->values();

    $spot = Spot::whereIn('regional_id', $societyIds)
        ->with('available_vaccines.vaccine')
        ->get();

    $allVaccines = [
        'Sinovac',
        'AstraZeneca',
        'Moderna',
        'Pfizer',
        'Sinnopharm',
    ];

    $result = $spot->map(function ($s) use ($allVaccines) {

        $tersedia = $s->available_vaccines
            ->pluck('vaccine.name')
            ->filter()
            ->toArray();

        $vaccines = collect($allVaccines)->mapWithKeys(function ($vaccine) use ($tersedia) {
            return [
                $vaccine => in_array($vaccine, $tersedia)
            ];
        });

        return [
            "id" => $s->id,
            "name" => $s->name,
            "address" => $s->address,
            "serve" => $s->serve,
            "regional_id" => $s->regional_id,
            "vaccine" => $vaccines->toArray()
        ];
    });

    return response()->json([
        "spots" => $result
    ]);
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
        //
    }

    /**
     * Display the specified resource.
     */


public function show(Request $request, $spotId)
{
    //  Auth (kalau token invalid biasanya middleware)
    $user = $request->attributes->get('auth_user');

    //  Ambil date (default hari ini)
    $date = $request->query('date')
        ? Carbon::parse($request->query('date'))
        : Carbon::today();

    //  Ambil spot
    $spot = Spot::find($spotId);

    //  Hitung jumlah vaksinasi di tanggal tsb
    $vaccinationsCount = Vaccination::where('spot_id', $spot->id)
        ->whereDate('date', $date)
        ->count();

    //  Response sesuai SPEC
    return response()->json([
         'date' => $date->format('F d, Y'),
        'spot' => [
            'id'       => $spot->id,
            'name'     => $spot->name,
            'address'  => $spot->address,
            'serve'    => $spot->serve,
            'capacity' => $spot->capacity,
        ],
        'vaccinations_count' => $vaccinationsCount
    ], 200);
}


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Spot $spot)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Spot $spot)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Spot $spot)
    {
        //
    }
}
