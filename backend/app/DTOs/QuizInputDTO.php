<?php

namespace App\DTOs;

use App\Enums\NivelQuiz;
use App\Http\Requests\QuizFormRequest;

readonly class QuizInputDTO
{
    public function __construct(
        public int $idUsuario,
        public string $nomeQuiz,
        public ?NivelQuiz $nivel = null,
    ) {}

    public static function fromRequest(QuizFormRequest $request): self
    {
        return new self(
            idUsuario: $request->user()->id,
            nomeQuiz: $request->validated('nome_quiz'),
            nivel: $request->has('nivel') ? NivelQuiz::from($request->validated('nivel')) : null,
        );
    }

    public function toArray(): array
    {
        return [
            'id_usuario' => $this->idUsuario,
            'nome_quiz' => $this->nomeQuiz,
            'nivel' => ($this->nivel ?? NivelQuiz::Facil)->value,
        ];
    }
}
