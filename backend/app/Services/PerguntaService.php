<?php

namespace App\Services;

use App\DTOs\PerguntaInputDTO;
use App\DTOs\PerguntaOutputDTO;
use App\Repositories\PerguntaRepository;
use App\Repositories\QuizRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class PerguntaService
{
    public function __construct(
        private PerguntaRepository $repository,
        private QuizRepository $quizRepository,
        private MidiaService $midia,
    ) {}

    public function create(int $idQuiz, int $idUsuario, PerguntaInputDTO $dto): ?PerguntaOutputDTO
    {
        $quiz = $this->quizRepository->findOwned($idQuiz, $idUsuario);

        if (!$quiz) {
            return null;
        }

        $imagem = $this->midia->salvarImagem($dto->imagem, $quiz->id);
        $audio = $this->midia->salvarAudio($dto->audio, $quiz->id);

        try {
            $pergunta = DB::transaction(fn () => $this->repository->create($quiz, $dto, $imagem, $audio));
        } catch (Throwable $erro) {
            $this->midia->apagar([$imagem, $audio]);
            throw $erro;
        }

        return new PerguntaOutputDTO($pergunta);
    }

    public function update(int $id, int $idUsuario, PerguntaInputDTO $dto): ?PerguntaOutputDTO
    {
        $pergunta = $this->repository->findOwned($id, $idUsuario);

        if (!$pergunta) {
            return null;
        }

        $imagemAnterior = $pergunta->caminho_imagem;
        $audioAnterior = $pergunta->caminho_audio;
        $manterImagem = $dto->imagem === null && !$dto->removerImagem;
        $manterAudio = $dto->audio === null && !$dto->removerAudio;

        $teraImagem = $dto->imagem !== null || ($manterImagem && $imagemAnterior !== null);
        $teraAudio = $dto->audio !== null || ($manterAudio && $audioAnterior !== null);

        if ($dto->textoPergunta === null && !$teraImagem && !$teraAudio) {
            throw ValidationException::withMessages([
                'texto_pergunta' => 'A pergunta precisa ter texto, imagem ou áudio',
            ]);
        }

        $novaImagem = $this->midia->salvarImagem($dto->imagem, $pergunta->id_quiz);
        $novoAudio = $this->midia->salvarAudio($dto->audio, $pergunta->id_quiz);
        $imagem = $manterImagem ? $imagemAnterior : $novaImagem;
        $audio = $manterAudio ? $audioAnterior : $novoAudio;

        try {
            $atualizada = DB::transaction(fn () => $this->repository->update($pergunta, $dto, $imagem, $audio));
        } catch (Throwable $erro) {
            $this->midia->apagar([$novaImagem, $novoAudio]);
            throw $erro;
        }

        $this->midia->apagar([
            $manterImagem ? null : $imagemAnterior,
            $manterAudio ? null : $audioAnterior,
        ]);

        return new PerguntaOutputDTO($atualizada);
    }

    public function delete(int $id, int $idUsuario): bool
    {
        $pergunta = $this->repository->findOwned($id, $idUsuario);

        if (!$pergunta) {
            return false;
        }

        $arquivos = [$pergunta->caminho_imagem, $pergunta->caminho_audio];
        $this->repository->delete($pergunta);
        $this->midia->apagar($arquivos);

        return true;
    }
}
