<?php

namespace App\Http\Controllers;

use App\DTOs\SocialUserInputDTO;
use App\DTOs\TokenExchangeInputDTO;
use App\Http\Requests\TokenExchangeFormRequest;
use App\Services\AuthService;
use App\Services\VerificacaoIdadeService;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Symfony\Component\HttpFoundation\RedirectResponse;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $service,
    ) {}

    public function redirect(string $provedor): RedirectResponse
    {
        return Socialite::driver($provedor)
            ->scopes([VerificacaoIdadeService::ESCOPO_GOOGLE])
            ->with(['prompt' => 'select_account'])
            ->enablePKCE()
            ->redirect();
    }

    public function callback(Request $request, string $provedor): RedirectResponse
    {
        if ($request->has('error')) {
            return $this->voltarAoFrontend(['erro' => 'cancelado']);
        }

        try {
            $usuarioProvedor = Socialite::driver($provedor)->enablePKCE()->user();
        } catch (InvalidStateException|ClientException) {
            return $this->voltarAoFrontend(['erro' => 'oauth']);
        } catch (GuzzleException) {
            return $this->voltarAoFrontend(['erro' => 'google_indisponivel']);
        }

        $codigo = $this->service->loginSocial(SocialUserInputDTO::fromSocialite($usuarioProvedor, $provedor));

        if (!$codigo) {
            return $this->voltarAoFrontend(['erro' => 'menor_de_idade']);
        }

        return $this->voltarAoFrontend(['codigo' => $codigo]);
    }

    public function token(TokenExchangeFormRequest $request): JsonResponse
    {
        $login = $this->service->exchangeCode(TokenExchangeInputDTO::fromRequest($request));

        if (!$login) {
            return response()->json(['message' => 'Código de acesso inválido ou expirado'], 401);
        }

        return response()->json(['data' => $login->toArray()]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->service->logout($request->user());

        return response()->json(null, 204);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => $this->service->session($request->user())->toArray()]);
    }

    private function voltarAoFrontend(array $parametros): RedirectResponse
    {
        return redirect()->away(config('app.frontend_url') . '/mediador/callback?' . http_build_query($parametros));
    }
}
