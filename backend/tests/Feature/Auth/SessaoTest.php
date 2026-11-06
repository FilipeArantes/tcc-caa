<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Tests\TestCase;

class SessaoTest extends TestCase
{
    use RefreshDatabase;

    public function test_codigo_e_trocado_por_token_de_mediador_e_de_usuario(): void
    {
        $codigo = $this->loginGoogle();

        $this->postJson('/api/auth/token', ['codigo' => $codigo])
            ->assertOk()
            ->assertJsonPath('data.usuario.nome', 'Maria Mediadora')
            ->assertJsonPath('data.tokens.mediador.modo', 'mediador')
            ->assertJsonPath('data.tokens.mediador.tipo', 'Bearer')
            ->assertJsonPath('data.tokens.usuario.modo', 'usuario')
            ->assertJsonMissingPath('data.usuario.provider_id')
            ->assertJsonMissingPath('data.usuario.avatar')
            ->assertJsonStructure(['data' => [
                'usuario' => ['id', 'nome', 'email', 'idade_confirmada', 'papel', 'criado_em'],
                'tokens' => [
                    'mediador' => ['token', 'tipo', 'expira_em', 'modo'],
                    'usuario' => ['token', 'tipo', 'expira_em', 'modo'],
                ],
            ]]);

        $this->assertDatabaseCount('personal_access_tokens', 2);
    }

    public function test_codigo_so_pode_ser_usado_uma_vez(): void
    {
        $codigo = $this->loginGoogle();

        $this->postJson('/api/auth/token', ['codigo' => $codigo])->assertOk();

        $this->postJson('/api/auth/token', ['codigo' => $codigo])
            ->assertUnauthorized()
            ->assertJsonPath('message', 'Código de acesso inválido ou expirado');
    }

    public function test_codigo_expira_em_um_minuto(): void
    {
        $codigo = $this->loginGoogle();

        $this->travel(61)->seconds();

        $this->postJson('/api/auth/token', ['codigo' => $codigo])->assertUnauthorized();
    }

    public function test_codigo_mal_formado_retorna_422_em_portugues(): void
    {
        $this->postJson('/api/auth/token', [])
            ->assertUnprocessable()
            ->assertJsonPath('errors.codigo.0', 'O código de acesso é obrigatório');

        $this->postJson('/api/auth/token', ['codigo' => 'curto'])
            ->assertUnprocessable()
            ->assertJsonPath('errors.codigo.0', 'O código de acesso é inválido');
    }

    public function test_sessao_informa_o_modo_de_cada_token(): void
    {
        [$mediador, $usuario] = $this->tokens();

        $this->withToken($mediador)->getJson('/api/usuario')
            ->assertOk()
            ->assertJsonPath('data.modo', 'mediador')
            ->assertJsonPath('data.usuario.email', 'maria@exemplo.com');

        $this->novaRequisicao();
        $this->withToken($usuario)->getJson('/api/usuario')
            ->assertOk()
            ->assertJsonPath('data.modo', 'usuario');
    }

    public function test_sem_token_retorna_401_em_portugues(): void
    {
        $this->getJson('/api/usuario')
            ->assertUnauthorized()
            ->assertJsonPath('message', 'Não autenticado');
    }

    public function test_voltar_ao_normal_revoga_so_o_token_de_mediador(): void
    {
        [$mediador, $usuario] = $this->tokens();

        $this->withToken($mediador)->postJson('/api/auth/logout')->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 1);
        $this->assertDatabaseHas('personal_access_tokens', ['name' => 'usuario']);

        $this->novaRequisicao();
        $this->withToken($mediador)->postJson('/api/quizzes', ['nome_quiz' => 'Animais'])->assertUnauthorized();

        $this->novaRequisicao();
        $this->withToken($usuario)->getJson('/api/usuario')
            ->assertOk()
            ->assertJsonPath('data.modo', 'usuario');
    }

    public function test_token_de_usuario_nao_cria_quiz(): void
    {
        [, $usuario] = $this->tokens();

        $this->withToken($usuario)->postJson('/api/quizzes', ['nome_quiz' => 'Animais'])
            ->assertForbidden()
            ->assertJsonPath('message', 'Não autorizado. Entre no modo mediador para fazer isso.');
    }

    public function test_token_de_mediador_expira_em_8_horas_e_o_de_usuario_continua(): void
    {
        [$mediador, $usuario] = $this->tokens();

        $this->travel(8)->hours();
        $this->travel(1)->minutes();

        $this->withToken($mediador)->postJson('/api/quizzes', ['nome_quiz' => 'Animais'])->assertUnauthorized();

        $this->novaRequisicao();
        $this->withToken($usuario)->getJson('/api/usuario')->assertOk();
    }

    public function test_desconectar_revoga_o_token_de_usuario(): void
    {
        [, $usuario] = $this->tokens();

        $this->withToken($usuario)->postJson('/api/auth/logout')->assertNoContent();

        $this->assertDatabaseMissing('personal_access_tokens', ['name' => 'usuario']);
        $this->novaRequisicao();
        $this->withToken($usuario)->getJson('/api/usuario')->assertUnauthorized();
    }

    private function loginGoogle(): string
    {
        Http::fake(['people.googleapis.com/*' => Http::response([
            'birthdays' => [['date' => ['year' => 1990, 'month' => 5, 'day' => 10]]],
        ])]);
        Socialite::fake('google', SocialiteUser::fake([
            'id' => 'google-123',
            'name' => 'Maria Mediadora',
            'email' => 'maria@exemplo.com',
            'token' => 'token-google',
        ]));

        $destino = $this->get('/auth/google/callback')->headers->get('Location');
        parse_str((string) parse_url($destino, PHP_URL_QUERY), $parametros);

        return $parametros['codigo'];
    }

    private function tokens(): array
    {
        $tokens = $this->postJson('/api/auth/token', ['codigo' => $this->loginGoogle()])->json('data.tokens');
        $this->novaRequisicao();

        return [$tokens['mediador']['token'], $tokens['usuario']['token']];
    }

    private function novaRequisicao(): void
    {
        $this->app['auth']->forgetGuards();
        $this->flushHeaders();
    }
}
