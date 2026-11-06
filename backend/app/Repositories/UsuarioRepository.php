<?php

namespace App\Repositories;

use App\DTOs\SocialUserInputDTO;
use App\Enums\ModoSessao;
use App\Models\Usuario;
use DateTimeInterface;
use Laravel\Sanctum\NewAccessToken;
use Laravel\Sanctum\PersonalAccessToken;

class UsuarioRepository
{
    public function upsertSocial(SocialUserInputDTO $dto, bool $idadeConfirmada): Usuario
    {
        return Usuario::updateOrCreate(
            ['provider_name' => $dto->provedor, 'provider_id' => $dto->idProvedor],
            $dto->toArray($idadeConfirmada),
        );
    }

    public function findById(int $id): ?Usuario
    {
        return Usuario::find($id);
    }

    public function createToken(Usuario $usuario, ModoSessao $modo, DateTimeInterface $expiraEm): NewAccessToken
    {
        return $usuario->createToken($modo->value, [$modo->value], $expiraEm);
    }

    public function currentToken(Usuario $usuario): ?PersonalAccessToken
    {
        $token = $usuario->currentAccessToken();

        return $token instanceof PersonalAccessToken ? $token : null;
    }

    public function revokeCurrentToken(Usuario $usuario): void
    {
        $this->currentToken($usuario)?->delete();
    }
}
