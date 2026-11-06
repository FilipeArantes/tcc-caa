<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class MidiaService
{
    private const VALIDADE_LINK_HORAS = 12;

    public static function disco(): string
    {
        return config('filesystems.midia', 'local');
    }

    public static function linkAssinado(?string $caminho): ?string
    {
        if ($caminho === null) {
            return null;
        }

        return Storage::disk(self::disco())->temporaryUrl($caminho, now()->addHours(self::VALIDADE_LINK_HORAS));
    }

    public function salvarImagem(?UploadedFile $arquivo, int $idQuiz): ?string
    {
        return $this->salvar($arquivo, "quizzes/{$idQuiz}/imagens");
    }

    public function salvarAudio(?UploadedFile $arquivo, int $idQuiz): ?string
    {
        return $this->salvar($arquivo, "quizzes/{$idQuiz}/audios");
    }

    public function apagar(array $caminhos): void
    {
        $existentes = array_values(array_filter($caminhos));

        if ($existentes !== []) {
            Storage::disk(self::disco())->delete($existentes);
        }
    }

    public function apagarPastaDoQuiz(int $idQuiz): void
    {
        Storage::disk(self::disco())->deleteDirectory("quizzes/{$idQuiz}");
    }

    private function salvar(?UploadedFile $arquivo, string $pasta): ?string
    {
        if ($arquivo === null) {
            return null;
        }

        $caminho = $arquivo->store($pasta, self::disco());

        if ($caminho === false) {
            throw new RuntimeException('Não foi possível salvar o arquivo enviado');
        }

        return $caminho;
    }
}
