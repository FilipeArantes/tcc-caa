<?php

namespace App\Services;

use Carbon\CarbonImmutable;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class VerificacaoIdadeService
{
    public const ESCOPO_GOOGLE = 'https://www.googleapis.com/auth/user.birthday.read';

    private const IDADE_MINIMA = 18;
    private const URL_PEOPLE_API = 'https://people.googleapis.com/v1/people/me';

    public function idade(string $tokenAcesso): ?int
    {
        if ($tokenAcesso === '') {
            return null;
        }

        try {
            $resposta = Http::withToken($tokenAcesso)
                ->acceptJson()
                ->timeout(5)
                ->get(self::URL_PEOPLE_API, ['personFields' => 'birthdays']);
        } catch (ConnectionException) {
            return null;
        }

        if ($resposta->failed()) {
            return null;
        }

        return $this->dataCompleta($resposta->json('birthdays') ?? [])?->age;
    }

    public function menorDeIdade(?int $idade): bool
    {
        return $idade !== null && $idade < self::IDADE_MINIMA;
    }

    private function dataCompleta(array $aniversarios): ?CarbonImmutable
    {
        $aniversario = collect($aniversarios)
            ->filter(fn (array $item) => isset($item['date']['year'], $item['date']['month'], $item['date']['day']))
            ->sortByDesc(fn (array $item) => ($item['metadata']['source']['type'] ?? null) === 'ACCOUNT')
            ->first();

        if ($aniversario === null) {
            return null;
        }

        return CarbonImmutable::create(
            $aniversario['date']['year'],
            $aniversario['date']['month'],
            $aniversario['date']['day'],
        );
    }
}
