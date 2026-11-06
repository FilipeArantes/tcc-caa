<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['sistema' => 'Diz Aí', 'status' => 'ativo']);
});

Route::middleware('throttle:10,1')->group(function () {
    Route::get('/auth/{provedor}/redirect', [AuthController::class, 'redirect'])
        ->whereIn('provedor', ['google']);
    Route::get('/auth/{provedor}/callback', [AuthController::class, 'callback'])
        ->whereIn('provedor', ['google']);
});
