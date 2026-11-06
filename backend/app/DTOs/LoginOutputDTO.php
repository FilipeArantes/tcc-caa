<?php

namespace App\DTOs;

readonly class LoginOutputDTO
{
    public function __construct(
        public UsuarioOutputDTO $usuario,
        public TokenOutputDTO $tokenMediador,
        public TokenOutputDTO $tokenUsuario,
    ) {}

    public function toArray(): array
    {
        return [
            'usuario' => $this->usuario->toArray(),
            'tokens' => [
                'mediador' => $this->tokenMediador->toArray(),
                'usuario' => $this->tokenUsuario->toArray(),
            ],
        ];
    }
}
