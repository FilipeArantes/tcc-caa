<?php

namespace App\Http\Requests;

class PerguntaUpdateFormRequest extends PerguntaFormRequest
{
    public function rules(): array
    {
        return [
            'texto_pergunta' => ['nullable', 'string', 'min:3', 'max:255'],
            'remover_imagem' => ['sometimes', 'boolean'],
            'remover_audio' => ['sometimes', 'boolean'],
            ...$this->regrasComuns(),
        ];
    }
}
