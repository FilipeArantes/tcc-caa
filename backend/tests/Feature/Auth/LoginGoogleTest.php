<?php

namespace Tests\Feature\Auth;

use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Psr7\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Laravel\Socialite\Two\User as SocialiteUser;
use Tests\TestCase;

class LoginGoogleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Http::preventStrayRequests();
        Socialite::fake('google', SocialiteUser::fake([
            'id' => 'google-123',
            'name' => 'Maria Mediadora',
            'email' => 'maria@exemplo.com',
            'avatar' => 'https://exemplo.com/maria.jpg',
            'token' => 'token-google',
        ]));
    }

    public function test_redireciona_para_o_provedor(): void
    {
        $this->get('/auth/google/redirect')->assertRedirect();
    }

    public function test_provedor_fora_da_lista_retorna_404(): void
    {
        $this->get('/auth/facebook/redirect')->assertNotFound();
        $this->get('/auth/facebook/callback')->assertNotFound();
    }

    public function test_maior_de_idade_volta_ao_frontend_com_codigo_e_sem_token(): void
    {
        $this->fakeAniversario(now()->subYears(30));

        $resposta = $this->get('/auth/google/callback');

        $destino = $resposta->headers->get('Location');
        $this->assertStringStartsWith(config('app.frontend_url') . '/mediador/callback?codigo=', $destino);
        $this->assertStringNotContainsString('token', $destino);
        $this->assertDatabaseHas('usuarios', [
            'provider_name' => 'google',
            'provider_id' => 'google-123',
            'nome' => 'Maria Mediadora',
            'idade_confirmada' => true,
        ]);
    }

    public function test_menor_de_idade_e_recusado_e_nada_e_gravado(): void
    {
        $this->fakeAniversario(now()->subYears(15));

        $this->get('/auth/google/callback')
            ->assertRedirect(config('app.frontend_url') . '/mediador/callback?erro=menor_de_idade');

        $this->assertDatabaseCount('usuarios', 0);
    }

    public function test_sem_data_de_nascimento_entra_com_idade_nao_confirmada(): void
    {
        Http::fake(['people.googleapis.com/*' => Http::response(['resourceName' => 'people/123'])]);

        $this->get('/auth/google/callback')->assertRedirectContains('/mediador/callback?codigo=');

        $this->assertDatabaseHas('usuarios', ['provider_id' => 'google-123', 'idade_confirmada' => false]);
    }

    public function test_aniversario_sem_ano_nao_confirma_idade(): void
    {
        Http::fake(['people.googleapis.com/*' => Http::response([
            'birthdays' => [['date' => ['month' => 5, 'day' => 10]]],
        ])]);

        $this->get('/auth/google/callback')->assertRedirectContains('/mediador/callback?codigo=');

        $this->assertDatabaseHas('usuarios', ['provider_id' => 'google-123', 'idade_confirmada' => false]);
    }

    public function test_falha_na_people_api_nao_impede_o_login(): void
    {
        Http::fake(['people.googleapis.com/*' => Http::response(['error' => 'forbidden'], 403)]);

        $this->get('/auth/google/callback')->assertRedirectContains('/mediador/callback?codigo=');

        $this->assertDatabaseHas('usuarios', ['provider_id' => 'google-123', 'idade_confirmada' => false]);
    }

    public function test_login_repetido_atualiza_o_mesmo_usuario(): void
    {
        $this->fakeAniversario(now()->subYears(30));

        $this->get('/auth/google/callback');
        $this->get('/auth/google/callback');

        $this->assertDatabaseCount('usuarios', 1);
    }

    public function test_cancelamento_no_google_volta_ao_frontend_com_erro(): void
    {
        $this->get('/auth/google/callback?error=access_denied')
            ->assertRedirect(config('app.frontend_url') . '/mediador/callback?erro=cancelado');
    }

    public function test_state_invalido_volta_ao_frontend_com_erro(): void
    {
        Socialite::fake('google', fn () => throw new InvalidStateException());

        $this->get('/auth/google/callback')
            ->assertRedirect(config('app.frontend_url') . '/mediador/callback?erro=oauth');

        $this->assertDatabaseCount('usuarios', 0);
    }

    public function test_google_fora_do_ar_volta_ao_frontend_com_erro(): void
    {
        Socialite::fake('google', fn () => throw new ConnectException(
            'TLS connect error',
            new Request('POST', 'https://www.googleapis.com/oauth2/v4/token'),
        ));

        $this->get('/auth/google/callback')
            ->assertRedirect(config('app.frontend_url') . '/mediador/callback?erro=google_indisponivel');

        $this->assertDatabaseCount('usuarios', 0);
    }

    private function fakeAniversario(\DateTimeInterface $data): void
    {
        Http::fake(['people.googleapis.com/*' => Http::response([
            'birthdays' => [
                [
                    'metadata' => ['source' => ['type' => 'ACCOUNT']],
                    'date' => [
                        'year' => (int) $data->format('Y'),
                        'month' => (int) $data->format('m'),
                        'day' => (int) $data->format('d'),
                    ],
                ],
            ],
        ])]);
    }
}
