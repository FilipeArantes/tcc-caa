<?php

namespace App\Models;

use Database\Factories\AlternativaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['id_pergunta', 'texto_alternativa', 'correta', 'ordem'])]
#[UseFactory(AlternativaFactory::class)]
class Alternativa extends Model
{
    use HasFactory;

    protected $table = 'alternativas';

    protected function casts(): array
    {
        return [
            'correta' => 'boolean',
            'ordem' => 'integer',
        ];
    }

    public function pergunta(): BelongsTo
    {
        return $this->belongsTo(Pergunta::class, 'id_pergunta');
    }
}
