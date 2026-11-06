<?php

namespace Tests\Feature\Quiz;

use App\Models\Quiz;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GerenciarQuizTest extends TestCase
{
    use RefreshDatabase;

    public function test_mediador_cria_quiz_em_seu_nome(): void
    {
        $mediador = Usuario::factory()->create();
        Sanctum::actingAs($mediador, ['mediador']);

        $this->postJson('/api/quizzes', ['nome_quiz' => 'Animais', 'id_usuario' => 999])
            ->assertCreated()
            ->assertJsonPath('data.nome_quiz', 'Animais')
            ->assertJsonPath('data.id_usuario', $mediador->id)
            ->assertJsonPath('data.padrao', false)
            ->assertJsonPath('data.perguntas', []);

        $this->assertDatabaseHas('quizzes', ['nome_quiz' => 'Animais', 'id_usuario' => $mediador->id]);
    }

    public function test_nome_obrigatorio_com_mensagem_em_portugues(): void
    {
        Sanctum::actingAs(Usuario::factory()->create(), ['mediador']);

        $this->postJson('/api/quizzes', [])
            ->assertUnprocessable()
            ->assertJsonPath('message', 'O nome do quiz é obrigatório')
            ->assertJsonPath('errors.nome_quiz.0', 'O nome do quiz é obrigatório');

        $this->postJson('/api/quizzes', ['nome_quiz' => 'ab'])
            ->assertUnprocessable()
            ->assertJsonPath('errors.nome_quiz.0', 'O nome do quiz deve ter pelo menos 3 caracteres');
    }

    public function test_criar_exige_login(): void
    {
        $this->postJson('/api/quizzes', ['nome_quiz' => 'Animais'])->assertUnauthorized();
    }

    public function test_criar_exige_modo_mediador(): void
    {
        Sanctum::actingAs(Usuario::factory()->create(), ['usuario']);

        $this->postJson('/api/quizzes', ['nome_quiz' => 'Animais'])->assertForbidden();
        $this->assertDatabaseCount('quizzes', 0);
    }

    public function test_mediador_renomeia_o_proprio_quiz(): void
    {
        $mediador = Usuario::factory()->create();
        $quiz = Quiz::factory()->for($mediador)->create(['nome_quiz' => 'Animais']);
        Sanctum::actingAs($mediador, ['mediador']);

        $this->putJson("/api/quizzes/{$quiz->id}", ['nome_quiz' => 'Bichos'])
            ->assertOk()
            ->assertJsonPath('data.nome_quiz', 'Bichos');
    }

    public function test_nao_edita_quiz_de_outro_mediador(): void
    {
        $quiz = Quiz::factory()->create(['nome_quiz' => 'Animais']);
        Sanctum::actingAs(Usuario::factory()->create(), ['mediador']);

        $this->putJson("/api/quizzes/{$quiz->id}", ['nome_quiz' => 'Bichos'])
            ->assertNotFound()
            ->assertJsonPath('message', 'Quiz não encontrado');

        $this->assertDatabaseHas('quizzes', ['id' => $quiz->id, 'nome_quiz' => 'Animais']);
    }

    public function test_nao_edita_nem_exclui_quiz_padrao(): void
    {
        $quiz = Quiz::factory()->padrao()->create(['nome_quiz' => 'Cores']);
        Sanctum::actingAs(Usuario::factory()->create(), ['mediador']);

        $this->putJson("/api/quizzes/{$quiz->id}", ['nome_quiz' => 'Outro'])->assertNotFound();
        $this->deleteJson("/api/quizzes/{$quiz->id}")->assertNotFound();

        $this->assertDatabaseHas('quizzes', ['id' => $quiz->id, 'nome_quiz' => 'Cores']);
    }

    public function test_mediador_exclui_o_proprio_quiz(): void
    {
        $mediador = Usuario::factory()->create();
        $quiz = Quiz::factory()->for($mediador)->create();
        Sanctum::actingAs($mediador, ['mediador']);

        $this->deleteJson("/api/quizzes/{$quiz->id}")->assertNoContent();

        $this->assertDatabaseMissing('quizzes', ['id' => $quiz->id]);
    }

    public function test_nao_exclui_quiz_de_outro_mediador(): void
    {
        $quiz = Quiz::factory()->create();
        Sanctum::actingAs(Usuario::factory()->create(), ['mediador']);

        $this->deleteJson("/api/quizzes/{$quiz->id}")->assertNotFound();

        $this->assertDatabaseHas('quizzes', ['id' => $quiz->id]);
    }

    public function test_nivel_padrao_e_facil_e_mediador_pode_escolher(): void
    {
        Sanctum::actingAs(Usuario::factory()->create(), ['mediador']);

        $this->postJson('/api/quizzes', ['nome_quiz' => 'Cores'])
            ->assertCreated()
            ->assertJsonPath('data.nivel', 'facil');

        $this->postJson('/api/quizzes', ['nome_quiz' => 'Animais', 'nivel' => 'dificil'])
            ->assertCreated()
            ->assertJsonPath('data.nivel', 'dificil');
    }

    public function test_nivel_invalido_retorna_mensagem_em_portugues(): void
    {
        Sanctum::actingAs(Usuario::factory()->create(), ['mediador']);

        $this->postJson('/api/quizzes', ['nome_quiz' => 'Animais', 'nivel' => 'impossivel'])
            ->assertUnprocessable()
            ->assertJsonPath('errors.nivel.0', 'O nível deve ser fácil, médio ou difícil');
    }

    public function test_mediador_muda_o_nivel_do_proprio_quiz(): void
    {
        $mediador = Usuario::factory()->create();
        $quiz = Quiz::factory()->for($mediador)->create(['nome_quiz' => 'Animais']);
        Sanctum::actingAs($mediador, ['mediador']);

        $this->putJson("/api/quizzes/{$quiz->id}", ['nome_quiz' => 'Animais', 'nivel' => 'medio'])
            ->assertOk()
            ->assertJsonPath('data.nivel', 'medio');
    }

    public function test_quiz_inexistente_retorna_404(): void
    {
        Sanctum::actingAs(Usuario::factory()->create(), ['mediador']);

        $this->putJson('/api/quizzes/999', ['nome_quiz' => 'Bichos'])->assertNotFound();
        $this->deleteJson('/api/quizzes/999')->assertNotFound();
    }
}
