<?php

namespace App\DTOs;

use Illuminate\Http\Request;

readonly class QuizFilterDTO
{
    public function __construct(
        public bool $apenasMeus = false,
        public int $porPagina = 50,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            apenasMeus: $request->boolean('meus'),
            porPagina: min(max($request->integer('por_pagina', 50), 1), 100),
        );
    }
}
