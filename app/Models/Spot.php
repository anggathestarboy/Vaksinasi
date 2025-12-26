<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Spot extends Model
{
    protected $guarded = [];

  // App\Models\Spot.php
public function available_vaccines()
{
    return $this->hasMany(SpotVaccine::class, 'spot_id');
}

    public function regional()
{
    return $this->belongsTo(Regional::class);
}

}
