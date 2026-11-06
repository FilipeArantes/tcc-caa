<?php

namespace App\Models;

use Database\Factories\PerguntaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['id_quiz', 'texto_pergunta', 'caminho_imagem', 'caminho_audio'])]
#[UseFactory(PerguntaFactory::class)]
class Pergunta extends Model
{
    use HasFactory;

    protected $table = 'perguntas';

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class, 'id_quiz');
    }

    public function alternativas(): HasMany
    {
        return $this->hasMany(Alternativa::class, 'id_pergunta')->orderBy('ordem');
    }
}
