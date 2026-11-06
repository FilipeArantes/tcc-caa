<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\Exceptions\MissingAbilityException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Throwable;

class ErrorHandling
{
    public static function render(Throwable $e, Request $request): ?JsonResponse
    {
        if (!$request->is('api/*')) {
            return null;
        }

        return match (true) {
            $e instanceof ValidationException => response()->json([
                'message' => collect($e->errors())->flatten()->first() ?? 'Os dados enviados são inválidos',
                'errors' => $e->errors(),
            ], 422),
            $e instanceof AuthenticationException => response()->json(['message' => 'Não autenticado'], 401),
            $e instanceof MissingAbilityException,
            $e instanceof AccessDeniedHttpException => response()->json(['message' => 'Não autorizado. Entre no modo mediador para fazer isso.'], 403),
            $e instanceof ModelNotFoundException,
            $e instanceof NotFoundHttpException => response()->json(['message' => 'Recurso não encontrado'], 404),
            $e instanceof MethodNotAllowedHttpException => response()->json(['message' => 'Método não permitido para este recurso'], 405),
            $e instanceof TooManyRequestsHttpException => response()->json(['message' => 'Muitas tentativas. Aguarde um pouco e tente novamente.'], 429),
            $e instanceof HttpExceptionInterface => response()->json(['message' => $e->getMessage() ?: 'Erro na requisição'], $e->getStatusCode()),
            default => self::inesperado($e),
        };
    }

    public static function context(): array
    {
        $request = request();

        return [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'user_id' => $request->user('sanctum')?->id,
        ];
    }

    private static function inesperado(Throwable $e): JsonResponse
    {
        $resposta = ['message' => 'Ocorreu um erro inesperado, tente novamente mais tarde'];

        if (config('app.debug')) {
            $resposta['error'] = $e->getMessage();
            $resposta['file'] = $e->getFile() . ':' . $e->getLine();
        }

        return response()->json($resposta, 500);
    }
}
