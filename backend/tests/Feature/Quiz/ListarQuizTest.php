<?php

namespace Tests\Feature\Quiz;

use App\Models\Pergunta;
use App\Models\Quiz;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ListarQuizTest extends TestCase
{
    use RefreshDatabase;

    public function test_sem_login_ve_so_os_quizzes_padrao(): void
    {
        $padrao = Quiz::factory()->padrao()->create(['nome_quiz' => 'Cores']);
        Pergunta::factory()->for($padrao)->create(['texto_pergunta' => 'O céu é azul?']);
        Quiz::factory()->create(['nome_quiz' => 'De um mediador']);

        $this->getJson('/api/quizzes')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nome_quiz', 'Cores')
            ->assertJsonPath('data.0.padrao', true)
            ->assertJsonPath('data.0.perguntas.0.texto_pergunta', 'O céu é azul?')
            ->assertJsonStructure(['data' => [['id', 'id_usuario', 'nome_quiz', 'padrao', 'perguntas']], 'current_page', 'total']);
    }

    public function test_logado_ve_padrao_e_os_proprios_mas_nao_os_de_outros(): void
    {
        $mediador = Usuario::factory()->create();
        Quiz::factory()->padrao()->create(['nome_quiz' => 'Cores']);
        Quiz::factory()->for($mediador)->create(['nome_quiz' => 'Meu quiz']);
        Quiz::factory()->create(['nome_quiz' => 'Quiz de outro']);
        Sanctum::actingAs($mediador, ['usuario']);

        $nomes = collect($this->getJson('/api/quizzes')->assertOk()->json('data'))->pluck('nome_quiz');

        $this->assertEqualsCanonicalizing(['Cores', 'Meu quiz'], $nomes->all());
    }

    public function test_padrao_aparece_antes_dos_criados_pelo_mediador(): void
    {
        $mediador = Usuario::factory()->create();
        Quiz::factory()->for($mediador)->create(['nome_quiz' => 'Meu quiz']);
        Quiz::factory()->padrao()->create(['nome_quiz' => 'Cores']);
        Sanctum::actingAs($mediador, ['usuario']);

        $this->getJson('/api/quizzes')
            ->assertJsonPath('data.0.nome_quiz', 'Cores')
            ->assertJsonPath('data.1.nome_quiz', 'Meu quiz');
    }

    public function test_filtro_meus_traz_so_os_do_mediador(): void
    {
        $mediador = Usuario::factory()->create();
        Quiz::factory()->padrao()->create();
        Quiz::factory()->for($mediador)->create(['nome_quiz' => 'Meu quiz']);
        Sanctum::actingAs($mediador, ['usuario']);

        $this->getJson('/api/quizzes?meus=1')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nome_quiz', 'Meu quiz')
            ->assertJsonPath('data.0.padrao', false);
    }

    public function test_filtro_meus_sem_login_vem_vazio(): void
    {
        Quiz::factory()->padrao()->create();

        $this->getJson('/api/quizzes?meus=1')->assertOk()->assertJsonCount(0, 'data');
    }

    public function test_detalhe_de_quiz_padrao_sem_login(): void
    {
        $quiz = Quiz::factory()->padrao()->create(['nome_quiz' => 'Cores']);

        $this->getJson("/api/quizzes/{$quiz->id}")
            ->assertOk()
            ->assertJsonPath('data.nome_quiz', 'Cores');
    }

    public function test_detalhe_de_quiz_de_outro_mediador_retorna_404(): void
    {
        $quiz = Quiz::factory()->create();
        Sanctum::actingAs(Usuario::factory()->create(), ['usuario']);

        $this->getJson("/api/quizzes/{$quiz->id}")
            ->assertNotFound()
            ->assertJsonPath('message', 'Quiz não encontrado');
    }

    public function test_detalhe_com_id_nao_numerico_retorna_404(): void
    {
        $this->getJson('/api/quizzes/abc')
            ->assertNotFound()
            ->assertJsonPath('message', 'Recurso não encontrado');
    }
}
