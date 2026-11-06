<?php

namespace App\Services;

use App\DTOs\QuizFilterDTO;
use App\DTOs\QuizInputDTO;
use App\DTOs\QuizOutputDTO;
use App\Models\Quiz;
use App\Repositories\QuizRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class QuizService
{
    public function __construct(
        private QuizRepository $repository,
        private MidiaService $midia,
    ) {}

    public function list(QuizFilterDTO $filtro, ?int $idUsuario): LengthAwarePaginator
    {
        return $this->repository
            ->paginateVisible($filtro, $idUsuario)
            ->through(fn (Quiz $quiz) => (new QuizOutputDTO($quiz))->toArray());
    }

    public function detail(int $id, ?int $idUsuario): ?QuizOutputDTO
    {
        $quiz = $this->repository->findVisible($id, $idUsuario);

        return $quiz ? new QuizOutputDTO($quiz) : null;
    }

    public function create(QuizInputDTO $dto): QuizOutputDTO
    {
        return new QuizOutputDTO($this->repository->create($dto));
    }

    public function update(int $id, QuizInputDTO $dto): ?QuizOutputDTO
    {
        $quiz = $this->repository->findOwned($id, $dto->idUsuario);

        if (!$quiz) {
            return null;
        }

        return new QuizOutputDTO($this->repository->update($quiz, $dto));
    }

    public function delete(int $id, int $idUsuario): bool
    {
        $quiz = $this->repository->findOwned($id, $idUsuario);

        if (!$quiz) {
            return false;
        }

        $this->repository->delete($quiz);
        $this->midia->apagarPastaDoQuiz($id);

        return true;
    }
}
