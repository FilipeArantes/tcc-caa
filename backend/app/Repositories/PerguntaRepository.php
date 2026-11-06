<?php

namespace App\Repositories;

use App\DTOs\PerguntaInputDTO;
use App\Models\Pergunta;
use App\Models\Quiz;
use Illuminate\Database\Eloquent\Builder;

class PerguntaRepository
{
    public function create(Quiz $quiz, PerguntaInputDTO $dto, ?string $imagem, ?string $audio): Pergunta
    {
        $pergunta = Pergunta::create(['id_quiz' => $quiz->id, ...$dto->toArray($imagem, $audio)]);
        $pergunta->alternativas()->createMany($dto->alternativasToArray());

        return $pergunta->load('alternativas');
    }

    public function findOwned(int $id, int $idUsuario): ?Pergunta
    {
        return Pergunta::query()
            ->whereHas('quiz', fn (Builder $query) => $query->where('id_usuario', $idUsuario))
            ->with('alternativas')
            ->find($id);
    }

    public function update(Pergunta $pergunta, PerguntaInputDTO $dto, ?string $imagem, ?string $audio): Pergunta
    {
        $pergunta->update($dto->toArray($imagem, $audio));
        $pergunta->alternativas()->delete();
        $pergunta->alternativas()->createMany($dto->alternativasToArray());

        return $pergunta->refresh()->load('alternativas');
    }

    public function delete(Pergunta $pergunta): void
    {
        $pergunta->delete();
    }
}
