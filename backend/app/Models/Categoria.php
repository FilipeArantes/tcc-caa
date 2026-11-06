<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nome_categoria'])]
class Categoria extends Model
{
    protected $table = 'categorias';

    public function pictogramas(): HasMany
    {
        return $this->hasMany(Pictograma::class, 'id_categoria');
    }
}
