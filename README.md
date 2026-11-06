# Sistema CAA

Aplicativo de Comunicação Aumentativa e Alternativa com estimulação cognitiva.

## Estrutura

- `backend/` — API em Laravel + PostgreSQL
- `frontend/` — Interface em React (Vite) como PWA

## Backend

O skeleton foi obtido diretamente do repositório oficial do Laravel no GitHub, já que o
Packagist não estava acessível no ambiente onde este projeto foi gerado. Por isso, o
diretório `vendor/` ainda não existe e o `composer install` precisa ser executado na sua
máquina, com acesso normal à internet.

```
cd backend
cp .env.example .env
composer install
php artisan key:generate
```

Com o Docker instalado, suba o banco de dados e a API:

```
docker compose up -d
```

Depois de os contêineres estarem no ar, rode as migrations e o seeder:

```
docker compose exec app php artisan migrate --seed
```

Para gerar o token de acesso via Google OAuth, preencha no `.env`:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

## Frontend

```
cd frontend
cp .env.example .env
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`. A rota `/` é a tela de comunicação por
pictogramas (Usuário/PcD), e `/mediador/login` é o ponto de entrada do Mediador.

## Mapeamento de requisitos

| Requisito | Onde está implementado |
| --- | --- |
| RF01 | `frontend/src/pages/ComunicacaoPage.tsx` |
| RF02 | `frontend/src/pages/EscritaLivrePage.tsx` |
| RF03 | `frontend/src/pages/QuizPage.tsx` |
| RF04 | `backend/app/Http/Controllers/AuthController.php`, `frontend/src/services/authService.ts` |
| RF05 | `frontend/src/hooks/useTTS.ts` |
| RF06 | `backend/app/Http/Controllers/QuizController.php`, `frontend/src/pages/AdminQuizPage.tsx` |
| RF07 | `backend/app/Http/Controllers/PictogramaController.php`, `frontend/src/pages/AdminPictogramasPage.tsx` |

Os pictogramas referenciados em `nome_pictograma` precisam ser colocados em
`frontend/public/pictogramas/`, já que o cadastro no banco guarda apenas o nome do
arquivo, não a imagem em si.
# tcc-caa
