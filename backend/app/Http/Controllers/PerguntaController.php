<?php

namespace App\Http\Controllers;

use App\DTOs\PerguntaInputDTO;
use App\Http\Requests\PerguntaFormRequest;
use App\Http\Requests\PerguntaUpdateFormRequest;
use App\Services\PerguntaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PerguntaController extends Controller
{
    public function __construct(
        private PerguntaService $service,
    ) {}

    public function store(PerguntaFormRequest $request, int $quiz): JsonResponse
    {
        $pergunta = $this->service->create($quiz, $request->user()->id, PerguntaInputDTO::fromRequest($request));

        if (!$pergunta) {
            return response()->json(['message' => 'Quiz não encontrado'], 404);
        }

        return response()->json(['data' => $pergunta->toArray()], 201);
    }

    public function update(PerguntaUpdateFormRequest $request, int $pergunta): JsonResponse
    {
        $atualizada = $this->service->update($pergunta, $request->user()->id, PerguntaInputDTO::fromRequest($request));

        if (!$atualizada) {
            return response()->json(['message' => 'Pergunta não encontrada'], 404);
        }

        return response()->json(['data' => $atualizada->toArray()]);
    }

    public function destroy(Request $request, int $pergunta): JsonResponse
    {
        if (!$this->service->delete($pergunta, $request->user()->id)) {
            return response()->json(['message' => 'Pergunta não encontrada'], 404);
        }

        return response()->json(null, 204);
    }
}
