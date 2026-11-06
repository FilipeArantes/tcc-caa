<?php

namespace App\Models;

use App\Enums\NivelQuiz;
use Database\Factories\QuizFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['id_usuario', 'nome_quiz', 'nivel'])]
#[UseFactory(QuizFactory::class)]
class Quiz extends Model
{
    use HasFactory;

    protected $table = 'quizzes';

    protected function casts(): array
    {
        return [
            'nivel' => NivelQuiz::class,
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function perguntas(): HasMany
    {
        return $this->hasMany(Pergunta::class, 'id_quiz')->orderBy('id');
    }
}
