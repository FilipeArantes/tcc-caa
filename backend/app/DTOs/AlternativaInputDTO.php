<?php

namespace App\DTOs;

readonly class AlternativaInputDTO
{
    public function __construct(
        public string $texto,
        public bool $correta,
        public int $ordem,
    ) {}

    public function toArray(): array
    {
        return [
            'texto_alternativa' => $this->texto,
            'correta' => $this->correta,
            'ordem' => $this->ordem,
        ];
    }
}
