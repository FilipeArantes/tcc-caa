<?php

namespace Database\Seeders;

use App\Models\Pergunta;
use App\Models\Quiz;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuizPadraoSeeder extends Seeder
{
    use WithoutModelEvents;

    private const QUIZZES = [
        'Cores' => [
            'O céu é azul?' => 'Sim',
            'A grama é vermelha?' => 'Não',
        ],
        'Minha rotina' => [
            'Escovamos os dentes depois de comer?' => 'Sim',
            'Dormimos na cozinha?' => 'Não',
        ],
    ];

    public function run(): void
    {
        foreach (self::QUIZZES as $nomeQuiz => $perguntas) {
            $quiz = Quiz::firstOrCreate(['id_usuario' => null, 'nome_quiz' => $nomeQuiz], ['nivel' => 'facil']);

            foreach ($perguntas as $texto => $respostaCerta) {
                $pergunta = $quiz->perguntas()->firstOrCreate(['texto_pergunta' => $texto]);
                $this->garantirSimOuNao($pergunta, $respostaCerta);
            }
        }
    }

    private function garantirSimOuNao(Pergunta $pergunta, string $respostaCerta): void
    {
        if ($pergunta->alternativas()->exists()) {
            return;
        }

        $pergunta->alternativas()->createMany([
            ['texto_alternativa' => 'Sim', 'correta' => $respostaCerta === 'Sim', 'ordem' => 1],
            ['texto_alternativa' => 'Não', 'correta' => $respostaCerta === 'Não', 'ordem' => 2],
        ]);
    }
}
