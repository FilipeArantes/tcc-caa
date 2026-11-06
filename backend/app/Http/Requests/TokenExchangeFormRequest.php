<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TokenExchangeFormRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'codigo' => ['required', 'string', 'size:64'],
        ];
    }

    public function messages(): array
    {
        return [
            'codigo.required' => 'O código de acesso é obrigatório',
            'codigo.string' => 'O código de acesso é inválido',
            'codigo.size' => 'O código de acesso é inválido',
        ];
    }
}
