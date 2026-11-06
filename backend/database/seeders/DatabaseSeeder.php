<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Pictograma;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $necessidades = Categoria::create(['nome_categoria' => 'Necessidades']);
        $sentimentos = Categoria::create(['nome_categoria' => 'Sentimentos']);

        Pictograma::create([
            'id_categoria' => $necessidades->id,
            'texto_pictograma' => 'Fome',
            'nome_pictograma' => 'fome.png',
        ]);

        Pictograma::create([
            'id_categoria' => $necessidades->id,
            'texto_pictograma' => 'Água',
            'nome_pictograma' => 'agua.png',
        ]);

        Pictograma::create([
            'id_categoria' => $sentimentos->id,
            'texto_pictograma' => 'Feliz',
            'nome_pictograma' => 'feliz.png',
        ]);

        $this->call(QuizPadraoSeeder::class);
    }
}
