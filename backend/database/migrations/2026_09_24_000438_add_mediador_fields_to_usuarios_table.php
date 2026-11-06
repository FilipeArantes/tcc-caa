<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('email');
            $table->boolean('idade_confirmada')->default(false)->after('avatar');
            $table->string('papel')->default('mediador')->after('idade_confirmada');
            $table->dropUnique('usuarios_provider_id_unique');
            $table->unique(['provider_name', 'provider_id']);
        });
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropUnique(['provider_name', 'provider_id']);
            $table->unique('provider_id');
            $table->dropColumn(['avatar', 'idade_confirmada', 'papel']);
        });
    }
};
