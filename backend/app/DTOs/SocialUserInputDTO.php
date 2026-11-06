<?php

namespace App\DTOs;

use Laravel\Socialite\Contracts\User as SocialiteUser;

readonly class SocialUserInputDTO
{
    public function __construct(
        public string $provedor,
        public string $idProvedor,
        public string $nome,
        public ?string $email,
        public string $tokenAcesso,
    ) {}

    public static function fromSocialite(SocialiteUser $usuario, string $provedor): self
    {
        return new self(
            provedor: $provedor,
            idProvedor: (string) $usuario->getId(),
            nome: $usuario->getName() ?? $usuario->getNickname() ?? 'Mediador',
            email: $usuario->getEmail(),
            tokenAcesso: (string) ($usuario->token ?? ''),
        );
    }

    public function toArray(bool $idadeConfirmada): array
    {
        return [
            'provider_name' => $this->provedor,
            'provider_id' => $this->idProvedor,
            'nome' => $this->nome,
            'email' => $this->email,
            'idade_confirmada' => $idadeConfirmada,
        ];
    }
}
