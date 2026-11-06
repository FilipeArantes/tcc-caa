<?php

namespace Database\Factories;

use App\Models\Alternativa;
use App\Models\Pergunta;
use Illuminate\Database\Eloquent\Factories\Factory;

class AlternativaFactory extends Factory
{
    protected $model = Alternativa::class;

    public function definition(): array
    {
        return [
            'id_pergunta' => Pergunta::factory(),
            'texto_alternativa' => fake()->word(),
            'correta' => false,
            'ordem' => fake()->unique()->numberBetween(1, 200),
        ];
    }

    public function correta(): static
    {
        return $this->state(fn () => ['correta' => true]);
    }
}
