<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\SpotController;
use App\Http\Controllers\VaccinationController;
use App\Http\Middleware\TokenMiddleware;
use Illuminate\Support\Facades\Route;

Route::post('/v1/auth/login', [AuthController::class, 'login']);


Route::middleware(TokenMiddleware::class)->group(function() {
            Route::post('v1/auth/logout', [AuthController::class, 'logout']);
            Route::post('v1/consultations', [ConsultationController::class, 'store']);
            Route::get('v1/consultations', [ConsultationController::class, 'index']);

            Route::get('/v1/spots', [SpotController::class, 'index']);
            Route::get('v1/spots/{spot}', [SpotController::class, 'show']);

            Route::post('v1/vaccinations', [VaccinationController::class, 'store']);
            Route::get('v1/vaccinations', [VaccinationController::class, 'index']);
});