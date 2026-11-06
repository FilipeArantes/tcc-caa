<?php

namespace App\DTOs;

use App\Models\Alternativa;

readonly class AlternativaOutputDTO
{
    public int $id;
    public string $textoAlternativa;
    public bool $correta;
    public int $ordem;

    public function __construct(Alternativa $alternativa)
    {
        $this->id = $alternativa->id;
        $this->textoAlternativa = $alternativa->texto_alternativa;
        $this->correta = $alternativa->correta;
        $this->ordem = $alternativa->ordem;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'texto_alternativa' => $this->textoAlternativa,
            'correta' => $this->correta,
            'ordem' => $this->ordem,
        ];
    }
}
