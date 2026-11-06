<?php

namespace App\Services;

use App\DTOs\LoginOutputDTO;
use App\DTOs\SessaoOutputDTO;
use App\DTOs\SocialUserInputDTO;
use App\DTOs\TokenExchangeInputDTO;
use App\DTOs\TokenOutputDTO;
use App\DTOs\UsuarioOutputDTO;
use App\Enums\ModoSessao;
use App\Models\Usuario;
use App\Repositories\UsuarioRepository;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AuthService
{
    private const PREFIXO_CODIGO = 'oauth-codigo:';
    private const VALIDADE_CODIGO_SEGUNDOS = 60;
    private const VALIDADE_MEDIADOR_HORAS = 8;
    private const VALIDADE_USUARIO_DIAS = 180;

    public function __construct(
        private UsuarioRepository $repository,
        private VerificacaoIdadeService $verificacaoIdade,
    ) {}

    public function loginSocial(SocialUserInputDTO $dto): ?string
    {
        $idade = $this->verificacaoIdade->idade($dto->tokenAcesso);

        if ($this->verificacaoIdade->menorDeIdade($idade)) {
            return null;
        }

        $usuario = $this->repository->upsertSocial($dto, $idade !== null);
        $codigo = Str::random(64);

        Cache::put(
            $this->chaveCodigo($codigo),
            $usuario->id,
            now()->addSeconds(self::VALIDADE_CODIGO_SEGUNDOS),
        );

        return $codigo;
    }

    public function exchangeCode(TokenExchangeInputDTO $dto): ?LoginOutputDTO
    {
        $idUsuario = Cache::pull($this->chaveCodigo($dto->codigo));

        if (!$idUsuario) {
            return null;
        }

        $usuario = $this->repository->findById($idUsuario);

        if (!$usuario) {
            return null;
        }

        return DB::transaction(fn() => new LoginOutputDTO(
            usuario: new UsuarioOutputDTO($usuario),
            tokenMediador: $this->emitir($usuario, ModoSessao::Mediador, CarbonImmutable::now()->addHours(self::VALIDADE_MEDIADOR_HORAS)),
            tokenUsuario: $this->emitir($usuario, ModoSessao::Usuario, CarbonImmutable::now()->addDays(self::VALIDADE_USUARIO_DIAS)),
        ));
    }

    public function logout(Usuario $usuario): void
    {
        $this->repository->revokeCurrentToken($usuario);
    }

    public function session(Usuario $usuario): SessaoOutputDTO
    {
        $token = $this->repository->currentToken($usuario);

        return new SessaoOutputDTO(
            modo: $token?->can(ModoSessao::Mediador->value) ? ModoSessao::Mediador : ModoSessao::Usuario,
            expiraEm: $token?->expires_at?->toIso8601String(),
            usuario: new UsuarioOutputDTO($usuario),
        );
    }

    private function emitir(Usuario $usuario, ModoSessao $modo, CarbonImmutable $expiraEm): TokenOutputDTO
    {
        $token = $this->repository->createToken($usuario, $modo, $expiraEm);

        return new TokenOutputDTO(
            token: $token->plainTextToken,
            expiraEm: $expiraEm->toIso8601String(),
            modo: $modo,
        );
    }

    private function chaveCodigo(string $codigo): string
    {
        return self::PREFIXO_CODIGO . hash('sha256', $codigo);
    }
}
