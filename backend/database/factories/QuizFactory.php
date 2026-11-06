<?php

namespace Database\Factories;

use App\Models\Quiz;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuizFactory extends Factory
{
    protected $model = Quiz::class;

    public function definition(): array
    {
        return [
            'id_usuario' => Usuario::factory(),
            'nome_quiz' => fake()->sentence(3),
            'nivel' => 'facil',
        ];
    }

    public function padrao(): static
    {
        return $this->state(fn () => ['id_usuario' => null]);
    }
}
