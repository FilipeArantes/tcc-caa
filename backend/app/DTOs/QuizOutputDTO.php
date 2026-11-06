<?php

namespace App\DTOs;

use App\Models\Pergunta;
use App\Models\Quiz;

readonly class QuizOutputDTO
{
    public int $id;
    public ?int $idUsuario;
    public string $nomeQuiz;
    public string $nivel;
    public bool $padrao;
    public ?array $perguntas;

    public function __construct(Quiz $quiz)
    {
        $this->id = $quiz->id;
        $this->idUsuario = $quiz->id_usuario;
        $this->nomeQuiz = $quiz->nome_quiz;
        $this->nivel = $quiz->nivel->value;
        $this->padrao = $quiz->id_usuario === null;
        $this->perguntas = $quiz->relationLoaded('perguntas')
            ? $quiz->perguntas->map(fn (Pergunta $pergunta) => (new PerguntaOutputDTO($pergunta))->toArray())->all()
            : null;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'id_usuario' => $this->idUsuario,
            'nome_quiz' => $this->nomeQuiz,
            'nivel' => $this->nivel,
            'padrao' => $this->padrao,
            'perguntas' => $this->perguntas,
        ];
    }
}
