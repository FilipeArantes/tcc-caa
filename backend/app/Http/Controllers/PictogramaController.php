<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Pictograma;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PictogramaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Pictograma::all());
    }

    public function porCategoria(Categoria $categoria): JsonResponse
    {
        return response()->json($categoria->pictogramas);
    }

    public function store(Request $request): JsonResponse
    {
        $dadosValidados = $request->validate([
            'id_categoria' => ['required', 'exists:categorias,id'],
            'texto_pictograma' => ['required', 'string', 'max:255'],
            'nome_pictograma' => ['required', 'string', 'max:255'],
        ]);

        $pictograma = Pictograma::create($dadosValidados);

        return response()->json($pictograma, 201);
    }

    public function update(Request $request, Pictograma $pictograma): JsonResponse
    {
        $dadosValidados = $request->validate([
            'id_categoria' => ['sometimes', 'exists:categorias,id'],
            'texto_pictograma' => ['sometimes', 'string', 'max:255'],
            'nome_pictograma' => ['sometimes', 'string', 'max:255'],
        ]);

        $pictograma->update($dadosValidados);

        return response()->json($pictograma);
    }

    public function destroy(Pictograma $pictograma): JsonResponse
    {
        $pictograma->delete();

        return response()->json(null, 204);
    }
}
