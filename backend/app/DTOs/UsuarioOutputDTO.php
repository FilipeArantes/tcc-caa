<?php

namespace App\DTOs;

use App\Models\Usuario;

readonly class UsuarioOutputDTO
{
    public int $id;
    public string $nome;
    public ?string $email;
    public bool $idadeConfirmada;
    public string $papel;
    public string $criadoEm;

    public function __construct(Usuario $usuario)
    {
        $this->id = $usuario->id;
        $this->nome = $usuario->nome;
        $this->email = $usuario->email;
        $this->idadeConfirmada = $usuario->idade_confirmada;
        $this->papel = $usuario->papel;
        $this->criadoEm = $usuario->created_at->toIso8601String();
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'email' => $this->email,
            'idade_confirmada' => $this->idadeConfirmada,
            'papel' => $this->papel,
            'criado_em' => $this->criadoEm,
        ];
    }
}
