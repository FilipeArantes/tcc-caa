<?php

namespace App\DTOs;

use App\Models\Alternativa;
use App\Models\Pergunta;
use App\Services\MidiaService;

readonly class PerguntaOutputDTO
{
    public int $id;
    public int $idQuiz;
    public ?string $textoPergunta;
    public ?string $imagemUrl;
    public ?string $audioUrl;
    public array $alternativas;

    public function __construct(Pergunta $pergunta)
    {
        $this->id = $pergunta->id;
        $this->idQuiz = $pergunta->id_quiz;
        $this->textoPergunta = $pergunta->texto_pergunta;
        $this->imagemUrl = MidiaService::linkAssinado($pergunta->caminho_imagem);
        $this->audioUrl = MidiaService::linkAssinado($pergunta->caminho_audio);
        $this->alternativas = $pergunta->relationLoaded('alternativas')
            ? $pergunta->alternativas->map(fn (Alternativa $alternativa) => (new AlternativaOutputDTO($alternativa))->toArray())->all()
            : [];
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'id_quiz' => $this->idQuiz,
            'texto_pergunta' => $this->textoPergunta,
            'imagem_url' => $this->imagemUrl,
            'audio_url' => $this->audioUrl,
            'alternativas' => $this->alternativas,
        ];
    }
}
