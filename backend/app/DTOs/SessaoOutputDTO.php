<?php

namespace App\DTOs;

use App\Enums\ModoSessao;

readonly class SessaoOutputDTO
{
    public function __construct(
        public ModoSessao $modo,
        public ?string $expiraEm,
        public UsuarioOutputDTO $usuario,
    ) {}

    public function toArray(): array
    {
        return [
            'modo' => $this->modo->value,
            'expira_em' => $this->expiraEm,
            'usuario' => $this->usuario->toArray(),
        ];
    }
}
