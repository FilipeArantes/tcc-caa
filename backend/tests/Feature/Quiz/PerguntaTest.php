<?php

namespace Tests\Feature\Quiz;

use App\Models\Alternativa;
use App\Models\Pergunta;
use App\Models\Quiz;
use App\Models\Usuario;
use App\Services\MidiaService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Testing\TestResponse;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PerguntaTest extends TestCase
{
    use RefreshDatabase;

    private Usuario $mediador;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(MidiaService::disco());
        $this->mediador = Usuario::factory()->create();
    }

    public function test_mediador_cria_pergunta_de_texto_com_alternativas(): void
    {
        $quiz = $this->quizDoMediador();

        $resposta = $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [
            'texto_pergunta' => 'Que animal faz miau?',
            'alternativas' => $this->alternativas(['Gato', 'Cachorro', 'Vaca'], certa: 0),
        ]);

        $resposta->assertCreated()
            ->assertJsonPath('data.texto_pergunta', 'Que animal faz miau?')
            ->assertJsonPath('data.imagem_url', null)
            ->assertJsonPath('data.audio_url', null)
            ->assertJsonCount(3, 'data.alternativas')
            ->assertJsonPath('data.alternativas.0.texto_alternativa', 'Gato')
            ->assertJsonPath('data.alternativas.0.correta', true)
            ->assertJsonPath('data.alternativas.1.correta', false)
            ->assertJsonPath('data.alternativas.2.ordem', 3);
    }

    public function test_pergunta_pode_ser_so_imagem_e_audio_e_os_arquivos_ficam_no_disco_privado(): void
    {
        $quiz = $this->quizDoMediador();

        $resposta = $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [
            'imagem' => $this->imagem('vaca.jpg'),
            'audio' => UploadedFile::fake()->create('mugido.webm', 200, 'audio/webm'),
            'alternativas' => $this->alternativas(['Vaca', 'Porco'], certa: 0),
        ])->assertCreated();

        $pergunta = Pergunta::findOrFail($resposta->json('data.id'));

        $this->assertNull($pergunta->texto_pergunta);
        $this->assertStringStartsWith("quizzes/{$quiz->id}/imagens/", $pergunta->caminho_imagem);
        $this->assertStringStartsWith("quizzes/{$quiz->id}/audios/", $pergunta->caminho_audio);
        Storage::disk(MidiaService::disco())->assertExists([$pergunta->caminho_imagem, $pergunta->caminho_audio]);
        $this->assertNotNull($resposta->json('data.imagem_url'));
        $this->assertNotNull($resposta->json('data.audio_url'));
    }

    public function test_aceita_audio_gravado_no_chrome_e_no_safari(): void
    {
        $quiz = $this->quizDoMediador();

        foreach (['gravacao.webm' => 'audio/webm', 'gravacao.mp4' => 'audio/mp4'] as $nome => $tipo) {
            $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [
                'audio' => UploadedFile::fake()->create($nome, 100, $tipo),
                'alternativas' => $this->alternativas(['Sim', 'Não'], certa: 0),
            ])->assertCreated();
        }
    }

    public function test_pergunta_vazia_e_recusada(): void
    {
        $quiz = $this->quizDoMediador();

        $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [
            'alternativas' => $this->alternativas(['Sim', 'Não'], certa: 0),
        ])
            ->assertUnprocessable()
            ->assertJsonPath('errors.texto_pergunta.0', 'A pergunta precisa ter texto, imagem ou áudio');
    }

    public function test_exige_de_2_a_4_alternativas(): void
    {
        $quiz = $this->quizDoMediador();

        $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [
            'texto_pergunta' => 'Que cor é o céu?',
            'alternativas' => $this->alternativas(['Azul'], certa: 0),
        ])->assertUnprocessable()->assertJsonPath('errors.alternativas.0', 'A pergunta precisa ter pelo menos 2 alternativas');

        $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [
            'texto_pergunta' => 'Que cor é o céu?',
            'alternativas' => $this->alternativas(['Azul', 'Verde', 'Roxo', 'Preto', 'Rosa'], certa: 0),
        ])->assertUnprocessable()->assertJsonPath('errors.alternativas.0', 'A pergunta pode ter no máximo 4 alternativas');
    }

    public function test_exige_exatamente_uma_alternativa_certa(): void
    {
        $quiz = $this->quizDoMediador();

        $nenhuma = [['texto' => 'Azul', 'correta' => '0'], ['texto' => 'Verde', 'correta' => '0']];
        $duas = [['texto' => 'Azul', 'correta' => '1'], ['texto' => 'Verde', 'correta' => '1']];

        foreach ([$nenhuma, $duas] as $alternativas) {
            $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [
                'texto_pergunta' => 'Que cor é o céu?',
                'alternativas' => $alternativas,
            ])
                ->assertUnprocessable()
                ->assertJsonPath('errors.alternativas.0', 'Marque exatamente uma alternativa como certa');
        }

        $this->assertDatabaseCount('perguntas', 0);
    }

    public function test_alternativas_nao_podem_se_repetir(): void
    {
        $quiz = $this->quizDoMediador();

        $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [
            'texto_pergunta' => 'Que cor é o céu?',
            'alternativas' => $this->alternativas(['Azul', 'azul'], certa: 0),
        ])
            ->assertUnprocessable()
            ->assertJsonPath('errors', fn (array $erros) => in_array('As alternativas não podem se repetir', array_merge(...array_values($erros)), true));
    }

    public function test_recusa_arquivos_de_tipo_ou_tamanho_invalido(): void
    {
        $quiz = $this->quizDoMediador();
        $base = ['texto_pergunta' => 'Que animal é esse?', 'alternativas' => $this->alternativas(['Gato', 'Cão'], certa: 0)];

        $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [...$base, 'imagem' => UploadedFile::fake()->create('foto.pdf', 50, 'application/pdf')])
            ->assertUnprocessable()
            ->assertJsonPath('errors.imagem.0', 'O arquivo da imagem precisa ser uma foto ou figura');

        $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [...$base, 'imagem' => $this->imagem('grande.jpg')->size(6000)])
            ->assertUnprocessable()
            ->assertJsonPath('errors.imagem.0', 'A imagem deve ter no máximo 5 MB');

        $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [...$base, 'audio' => UploadedFile::fake()->create('som.exe', 50, 'application/x-msdownload')])
            ->assertUnprocessable()
            ->assertJsonPath('errors.audio.0', 'O áudio deve ser MP3, M4A, OGG, WEBM ou WAV');

        $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [...$base, 'audio' => UploadedFile::fake()->create('longo.mp3', 11000, 'audio/mpeg')])
            ->assertUnprocessable()
            ->assertJsonPath('errors.audio.0', 'O áudio deve ter no máximo 10 MB');

        $this->assertDatabaseCount('perguntas', 0);
    }

    public function test_nao_adiciona_pergunta_em_quiz_de_outro_ou_padrao_e_nao_salva_arquivo(): void
    {
        $deOutro = Quiz::factory()->create();
        $padrao = Quiz::factory()->padrao()->create();
        Sanctum::actingAs($this->mediador, ['mediador']);

        foreach ([$deOutro, $padrao] as $quiz) {
            $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [
                'imagem' => $this->imagem('foto.jpg'),
                'alternativas' => $this->alternativas(['Sim', 'Não'], certa: 0),
            ])
                ->assertNotFound()
                ->assertJsonPath('message', 'Quiz não encontrado');
        }

        $this->assertDatabaseCount('perguntas', 0);
        $this->assertSame([], Storage::disk(MidiaService::disco())->allFiles());
    }

    public function test_modo_usuario_nao_adiciona_pergunta(): void
    {
        $quiz = Quiz::factory()->for($this->mediador)->create();
        Sanctum::actingAs($this->mediador, ['usuario']);

        $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [
            'texto_pergunta' => 'O gato late?',
            'alternativas' => $this->alternativas(['Sim', 'Não'], certa: 1),
        ])->assertForbidden();
    }

    public function test_editar_troca_alternativas_e_substitui_a_imagem_apagando_a_antiga(): void
    {
        $quiz = $this->quizDoMediador();
        $criada = $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [
            'texto_pergunta' => 'Que animal é esse?',
            'imagem' => $this->imagem('gato.jpg'),
            'alternativas' => $this->alternativas(['Gato', 'Cão'], certa: 0),
        ])->assertCreated();
        $imagemAntiga = Pergunta::findOrFail($criada->json('data.id'))->caminho_imagem;

        $this->enviar("/api/perguntas/{$criada->json('data.id')}", [
            '_method' => 'PUT',
            'texto_pergunta' => 'Que bicho é esse?',
            'imagem' => $this->imagem('cachorro.jpg'),
            'alternativas' => $this->alternativas(['Gato', 'Cachorro', 'Pato'], certa: 1),
        ])
            ->assertOk()
            ->assertJsonPath('data.texto_pergunta', 'Que bicho é esse?')
            ->assertJsonCount(3, 'data.alternativas')
            ->assertJsonPath('data.alternativas.1.correta', true);

        $imagemNova = Pergunta::findOrFail($criada->json('data.id'))->caminho_imagem;
        $this->assertNotSame($imagemAntiga, $imagemNova);
        Storage::disk(MidiaService::disco())->assertMissing($imagemAntiga);
        Storage::disk(MidiaService::disco())->assertExists($imagemNova);
        $this->assertSame(3, Alternativa::count());
    }

    public function test_editar_pode_remover_o_audio_mas_nao_deixar_a_pergunta_vazia(): void
    {
        $quiz = $this->quizDoMediador();
        $criada = $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [
            'audio' => UploadedFile::fake()->create('som.mp3', 100, 'audio/mpeg'),
            'alternativas' => $this->alternativas(['Sim', 'Não'], certa: 0),
        ])->assertCreated();
        $id = $criada->json('data.id');
        $audio = Pergunta::findOrFail($id)->caminho_audio;

        $this->enviar("/api/perguntas/{$id}", [
            '_method' => 'PUT',
            'remover_audio' => '1',
            'alternativas' => $this->alternativas(['Sim', 'Não'], certa: 0),
        ])
            ->assertUnprocessable()
            ->assertJsonPath('errors.texto_pergunta.0', 'A pergunta precisa ter texto, imagem ou áudio');
        Storage::disk(MidiaService::disco())->assertExists($audio);

        $this->enviar("/api/perguntas/{$id}", [
            '_method' => 'PUT',
            'texto_pergunta' => 'Você ouviu um gato?',
            'remover_audio' => '1',
            'alternativas' => $this->alternativas(['Sim', 'Não'], certa: 0),
        ])
            ->assertOk()
            ->assertJsonPath('data.audio_url', null);
        Storage::disk(MidiaService::disco())->assertMissing($audio);
    }

    public function test_excluir_pergunta_apaga_os_arquivos(): void
    {
        $quiz = $this->quizDoMediador();
        $criada = $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [
            'imagem' => $this->imagem('foto.jpg'),
            'alternativas' => $this->alternativas(['Sim', 'Não'], certa: 0),
        ])->assertCreated();
        $imagem = Pergunta::findOrFail($criada->json('data.id'))->caminho_imagem;

        $this->deleteJson("/api/perguntas/{$criada->json('data.id')}")->assertNoContent();

        Storage::disk(MidiaService::disco())->assertMissing($imagem);
        $this->assertDatabaseCount('alternativas', 0);
    }

    public function test_excluir_quiz_apaga_a_pasta_de_midias(): void
    {
        $quiz = $this->quizDoMediador();
        $this->enviar("/api/quizzes/{$quiz->id}/perguntas", [
            'imagem' => $this->imagem('foto.jpg'),
            'alternativas' => $this->alternativas(['Sim', 'Não'], certa: 0),
        ])->assertCreated();

        $this->deleteJson("/api/quizzes/{$quiz->id}")->assertNoContent();

        $this->assertSame([], Storage::disk(MidiaService::disco())->allFiles("quizzes/{$quiz->id}"));
    }

    public function test_nao_mexe_em_pergunta_de_outro_mediador(): void
    {
        $pergunta = Pergunta::factory()->create(['texto_pergunta' => 'Original?']);
        Sanctum::actingAs($this->mediador, ['mediador']);

        $this->enviar("/api/perguntas/{$pergunta->id}", [
            '_method' => 'PUT',
            'texto_pergunta' => 'Alterada?',
            'alternativas' => $this->alternativas(['Sim', 'Não'], certa: 0),
        ])
            ->assertNotFound()
            ->assertJsonPath('message', 'Pergunta não encontrada');
        $this->deleteJson("/api/perguntas/{$pergunta->id}")->assertNotFound();

        $this->assertDatabaseHas('perguntas', ['id' => $pergunta->id, 'texto_pergunta' => 'Original?']);
    }

    public function test_midia_so_abre_com_link_assinado(): void
    {
        $caminho = 'quizzes/1/imagens/foto.jpg';
        Storage::disk(MidiaService::disco())->put($caminho, 'conteudo');

        $this->get("/storage/{$caminho}")->assertStatus(403);

        $assinado = URL::temporarySignedRoute('storage.' . MidiaService::disco(), now()->addMinutes(5), ['path' => $caminho], absolute: false);
        $this->get($assinado)->assertOk();

        $this->travel(10)->minutes();
        $this->get($assinado)->assertStatus(403);
    }

    private function quizDoMediador(): Quiz
    {
        Sanctum::actingAs($this->mediador, ['mediador']);

        return Quiz::factory()->for($this->mediador)->create();
    }

    private function imagem(string $nome): UploadedFile
    {
        $pngDeUmPixel = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');

        return UploadedFile::fake()->createWithContent(str_replace('.jpg', '.png', $nome), $pngDeUmPixel);
    }

    private function alternativas(array $textos, int $certa): array
    {
        return array_map(
            fn (string $texto, int $indice) => ['texto' => $texto, 'correta' => $indice === $certa ? '1' : '0'],
            $textos,
            array_keys($textos),
        );
    }

    private function enviar(string $url, array $dados): TestResponse
    {
        return $this->post($url, $dados, ['Accept' => 'application/json']);
    }
}
