<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pictogramas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_categoria')->constrained('categorias')->cascadeOnDelete();
            $table->string('texto_pictograma');
            $table->string('nome_pictograma');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pictogramas');
    }
};
