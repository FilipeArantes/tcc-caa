<?php

namespace App\Repositories;

use App\DTOs\QuizFilterDTO;
use App\DTOs\QuizInputDTO;
use App\Models\Quiz;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class QuizRepository
{
    public function paginateVisible(QuizFilterDTO $filtro, ?int $idUsuario): LengthAwarePaginator
    {
        $query = $filtro->apenasMeus
            ? $this->queryDoUsuario($idUsuario)
            : $this->queryVisivel($idUsuario);

        return $query
            ->with('perguntas.alternativas')
            ->orderByRaw('id_usuario is not null')
            ->orderBy('id')
            ->paginate($filtro->porPagina)
            ->withQueryString();
    }

    public function findVisible(int $id, ?int $idUsuario): ?Quiz
    {
        return $this->queryVisivel($idUsuario)->with('perguntas.alternativas')->find($id);
    }

    public function findOwned(int $id, int $idUsuario): ?Quiz
    {
        return $this->queryDoUsuario($idUsuario)->find($id);
    }

    public function create(QuizInputDTO $dto): Quiz
    {
        return Quiz::create($dto->toArray())->load('perguntas.alternativas');
    }

    public function update(Quiz $quiz, QuizInputDTO $dto): Quiz
    {
        $quiz->update(array_filter([
            'nome_quiz' => $dto->nomeQuiz,
            'nivel' => $dto->nivel?->value,
        ]));

        return $quiz->refresh()->load('perguntas.alternativas');
    }

    public function delete(Quiz $quiz): void
    {
        $quiz->delete();
    }

    private function queryVisivel(?int $idUsuario): Builder
    {
        return Quiz::query()->where(
            fn (Builder $query) => $query
                ->whereNull('id_usuario')
                ->when($idUsuario, fn (Builder $query, int $id) => $query->orWhere('id_usuario', $id))
        );
    }

    private function queryDoUsuario(?int $idUsuario): Builder
    {
        return Quiz::query()
            ->whereNotNull('id_usuario')
            ->where('id_usuario', $idUsuario ?? 0);
    }
}
