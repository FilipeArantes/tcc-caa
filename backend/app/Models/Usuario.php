<?php

namespace App\Models;

use Database\Factories\UsuarioFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['nome', 'email', 'idade_confirmada', 'papel', 'provider_name', 'provider_id'])]
#[Hidden(['provider_id'])]
#[UseFactory(UsuarioFactory::class)]
class Usuario extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;

    protected $table = 'usuarios';

    protected function casts(): array
    {
        return [
            'idade_confirmada' => 'boolean',
        ];
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class, 'id_usuario');
    }
}
