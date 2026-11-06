<?php

namespace App\DTOs;

use App\Enums\ModoSessao;

readonly class TokenOutputDTO
{
    public function __construct(
        public string $token,
        public string $expiraEm,
        public ModoSessao $modo,
    ) {}

    public function toArray(): array
    {
        return [
            'token' => $this->token,
            'tipo' => 'Bearer',
            'expira_em' => $this->expiraEm,
            'modo' => $this->modo->value,
        ];
    }
}
