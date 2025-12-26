<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    protected $guarded = [];
    public $timestamps = false;

   public function doctor() {
    return $this->belongsTo(Medical::class, 'doctor_id', 'id');
   }


   public function society() {
    return $this->belongsTo(Society::class);
   }
}
