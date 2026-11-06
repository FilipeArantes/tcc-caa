<?php

namespace App\Http\Requests;

use App\Enums\NivelQuiz;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuizFormRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nome_quiz' => ['required', 'string', 'min:3', 'max:255'],
            'nivel' => ['sometimes', Rule::enum(NivelQuiz::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'nome_quiz.required' => 'O nome do quiz é obrigatório',
            'nome_quiz.string' => 'O nome do quiz deve ser um texto',
            'nome_quiz.min' => 'O nome do quiz deve ter pelo menos 3 caracteres',
            'nome_quiz.max' => 'O nome do quiz deve ter no máximo 255 caracteres',
            'nivel.enum' => 'O nível deve ser fácil, médio ou difícil',
        ];
    }
}
