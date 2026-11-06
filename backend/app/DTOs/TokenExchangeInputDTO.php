<?php

namespace App\DTOs;

use App\Http\Requests\TokenExchangeFormRequest;

readonly class TokenExchangeInputDTO
{
    public function __construct(
        public string $codigo,
    ) {}

    public static function fromRequest(TokenExchangeFormRequest $request): self
    {
        return new self(
            codigo: $request->validated('codigo'),
        );
    }
}
