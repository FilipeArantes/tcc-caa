<?php

namespace App\Http\Controllers;

use App\DTOs\QuizFilterDTO;
use App\DTOs\QuizInputDTO;
use App\Http\Requests\QuizFormRequest;
use App\Services\QuizService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function __construct(
        private QuizService $service,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filtro = QuizFilterDTO::fromRequest($request);

        return response()->json($this->service->list($filtro, $request->user('sanctum')?->id));
    }

    public function show(Request $request, int $quiz): JsonResponse
    {
        $detalhe = $this->service->detail($quiz, $request->user('sanctum')?->id);

        if (!$detalhe) {
            return response()->json(['message' => 'Quiz não encontrado'], 404);
        }

        return response()->json(['data' => $detalhe->toArray()]);
    }

    public function store(QuizFormRequest $request): JsonResponse
    {
        $quiz = $this->service->create(QuizInputDTO::fromRequest($request));

        return response()->json(['data' => $quiz->toArray()], 201);
    }

    public function update(QuizFormRequest $request, int $quiz): JsonResponse
    {
        $atualizado = $this->service->update($quiz, QuizInputDTO::fromRequest($request));

        if (!$atualizado) {
            return response()->json(['message' => 'Quiz não encontrado'], 404);
        }

        return response()->json(['data' => $atualizado->toArray()]);
    }

    public function destroy(Request $request, int $quiz): JsonResponse
    {
        if (!$this->service->delete($quiz, $request->user()->id)) {
            return response()->json(['message' => 'Quiz não encontrado'], 404);
        }

        return response()->json(null, 204);
    }
}
