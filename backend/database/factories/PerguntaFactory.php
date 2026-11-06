<?php

namespace Database\Factories;

use App\Models\Pergunta;
use App\Models\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;

class PerguntaFactory extends Factory
{
    protected $model = Pergunta::class;

    public function definition(): array
    {
        return [
            'id_quiz' => Quiz::factory(),
            'texto_pergunta' => fake()->sentence(6) . '?',
        ];
    }
}
