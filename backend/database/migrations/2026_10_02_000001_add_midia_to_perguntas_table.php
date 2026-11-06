<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('perguntas', function (Blueprint $table) {
            $table->string('texto_pergunta')->nullable()->change();
            $table->string('caminho_imagem')->nullable()->after('texto_pergunta');
            $table->string('caminho_audio')->nullable()->after('caminho_imagem');
        });
    }

    public function down(): void
    {
        Schema::table('perguntas', function (Blueprint $table) {
            $table->dropColumn(['caminho_imagem', 'caminho_audio']);
        });
    }
};
