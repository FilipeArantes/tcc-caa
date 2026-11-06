<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alternativas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_pergunta')->constrained('perguntas')->cascadeOnDelete();
            $table->string('texto_alternativa', 100);
            $table->boolean('correta')->default(false);
            $table->unsignedTinyInteger('ordem');
            $table->timestamps();

            $table->unique(['id_pergunta', 'ordem']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alternativas');
    }
};
