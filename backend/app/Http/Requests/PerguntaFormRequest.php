<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class PerguntaFormRequest extends FormRequest
{
    protected const TIPOS_DE_AUDIO = [
        'audio/mpeg',
        'audio/mp3',
        'audio/mp4',
        'audio/x-m4a',
        'audio/aac',
        'audio/ogg',
        'audio/webm',
        'video/webm',
        'audio/wav',
        'audio/x-wav',
        'audio/wave',
    ];

    public function rules(): array
    {
        return [
            'texto_pergunta' => ['nullable', 'string', 'min:3', 'max:255', 'required_without_all:imagem,audio'],
            ...$this->regrasComuns(),
        ];
    }

    public function messages(): array
    {
        return [
            'texto_pergunta.required_without_all' => 'A pergunta precisa ter texto, imagem ou áudio',
            'texto_pergunta.string' => 'O texto da pergunta deve ser um texto',
            'texto_pergunta.min' => 'O texto da pergunta deve ter pelo menos 3 caracteres',
            'texto_pergunta.max' => 'O texto da pergunta deve ter no máximo 255 caracteres',
            'imagem.file' => 'A imagem não foi enviada corretamente',
            'imagem.image' => 'O arquivo da imagem precisa ser uma foto ou figura',
            'imagem.mimes' => 'A imagem deve ser JPG, PNG ou WEBP',
            'imagem.max' => 'A imagem deve ter no máximo 5 MB',
            'audio.file' => 'O áudio não foi enviado corretamente',
            'audio.mimetypes' => 'O áudio deve ser MP3, M4A, OGG, WEBM ou WAV',
            'audio.max' => 'O áudio deve ter no máximo 10 MB',
            'alternativas.required' => 'A pergunta precisa ter alternativas',
            'alternativas.array' => 'As alternativas foram enviadas em formato inválido',
            'alternativas.min' => 'A pergunta precisa ter pelo menos 2 alternativas',
            'alternativas.max' => 'A pergunta pode ter no máximo 4 alternativas',
            'alternativas.*.texto.required' => 'Escreva o texto de todas as alternativas',
            'alternativas.*.texto.string' => 'O texto da alternativa deve ser um texto',
            'alternativas.*.texto.max' => 'Cada alternativa deve ter no máximo 100 caracteres',
            'alternativas.*.texto.distinct' => 'As alternativas não podem se repetir',
            'alternativas.*.correta.required' => 'Indique se cada alternativa é certa ou não',
            'alternativas.*.correta.boolean' => 'A indicação de alternativa certa é inválida',
            'remover_imagem.boolean' => 'A opção de remover a imagem é inválida',
            'remover_audio.boolean' => 'A opção de remover o áudio é inválida',
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $alternativas = $this->input('alternativas');

                if (!is_array($alternativas) || $validator->errors()->has('alternativas')) {
                    return;
                }

                $corretas = collect($alternativas)
                    ->filter(fn ($alternativa) => is_array($alternativa) && filter_var($alternativa['correta'] ?? false, FILTER_VALIDATE_BOOLEAN))
                    ->count();

                if ($corretas !== 1) {
                    $validator->errors()->add('alternativas', 'Marque exatamente uma alternativa como certa');
                }
            },
        ];
    }

    protected function regrasComuns(): array
    {
        return [
            'imagem' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'audio' => ['nullable', 'file', 'mimetypes:' . implode(',', self::TIPOS_DE_AUDIO), 'max:10240'],
            'alternativas' => ['required', 'array', 'min:2', 'max:4'],
            'alternativas.*.texto' => ['required', 'string', 'max:100', 'distinct:ignore_case'],
            'alternativas.*.correta' => ['required', 'boolean'],
        ];
    }
}
