<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\PerguntaController;
use App\Http\Controllers\PictogramaController;
use App\Http\Controllers\QuizController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/token', [AuthController::class, 'token'])->middleware('throttle:10,1');

Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/categorias/{categoria}/pictogramas', [PictogramaController::class, 'porCategoria']);
Route::get('/pictogramas', [PictogramaController::class, 'index']);
Route::get('/quizzes', [QuizController::class, 'index']);
Route::get('/quizzes/{quiz}', [QuizController::class, 'show'])->whereNumber('quiz');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/usuario', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::middleware('ability:mediador')->group(function () {
        Route::post('/quizzes', [QuizController::class, 'store']);
        Route::put('/quizzes/{quiz}', [QuizController::class, 'update'])->whereNumber('quiz');
        Route::delete('/quizzes/{quiz}', [QuizController::class, 'destroy'])->whereNumber('quiz');

        Route::post('/quizzes/{quiz}/perguntas', [PerguntaController::class, 'store'])->whereNumber('quiz');
        Route::put('/perguntas/{pergunta}', [PerguntaController::class, 'update'])->whereNumber('pergunta');
        Route::delete('/perguntas/{pergunta}', [PerguntaController::class, 'destroy'])->whereNumber('pergunta');

        Route::post('/pictogramas', [PictogramaController::class, 'store']);
        Route::put('/pictogramas/{pictograma}', [PictogramaController::class, 'update']);
        Route::delete('/pictogramas/{pictograma}', [PictogramaController::class, 'destroy']);
    });
});
