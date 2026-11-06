<?php

namespace App\DTOs;

use App\Http\Requests\PerguntaFormRequest;
use Illuminate\Http\UploadedFile;

readonly class PerguntaInputDTO
{
    public function __construct(
        public ?string $textoPergunta,
        public ?UploadedFile $imagem,
        public ?UploadedFile $audio,
        public bool $removerImagem,
        public bool $removerAudio,
        public array $alternativas,
    ) {}

    public static function fromRequest(PerguntaFormRequest $request): self
    {
        $dados = $request->validated();
        $texto = trim((string) ($dados['texto_pergunta'] ?? ''));
        $alternativas = array_values($dados['alternativas']);

        return new self(
            textoPergunta: $texto === '' ? null : $texto,
            imagem: $request->file('imagem'),
            audio: $request->file('audio'),
            removerImagem: (bool) ($dados['remover_imagem'] ?? false),
            removerAudio: (bool) ($dados['remover_audio'] ?? false),
            alternativas: array_map(
                fn (array $alternativa, int $indice) => new AlternativaInputDTO(
                    texto: trim($alternativa['texto']),
                    correta: filter_var($alternativa['correta'], FILTER_VALIDATE_BOOLEAN),
                    ordem: $indice + 1,
                ),
                $alternativas,
                array_keys($alternativas),
            ),
        );
    }

    public function toArray(?string $caminhoImagem, ?string $caminhoAudio): array
    {
        return [
            'texto_pergunta' => $this->textoPergunta,
            'caminho_imagem' => $caminhoImagem,
            'caminho_audio' => $caminhoAudio,
        ];
    }

    public function alternativasToArray(): array
    {
        return array_map(fn (AlternativaInputDTO $alternativa) => $alternativa->toArray(), $this->alternativas);
    }
}
