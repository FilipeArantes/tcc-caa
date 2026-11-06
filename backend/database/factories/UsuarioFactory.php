<?php

namespace Database\Factories;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;

class UsuarioFactory extends Factory
{
    protected $model = Usuario::class;

    public function definition(): array
    {
        return [
            'nome' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'idade_confirmada' => true,
            'papel' => 'mediador',
            'provider_name' => 'google',
            'provider_id' => (string) fake()->unique()->numerify('####################'),
        ];
    }

    public function idadeNaoConfirmada(): static
    {
        return $this->state(fn () => ['idade_confirmada' => false]);
    }
}
