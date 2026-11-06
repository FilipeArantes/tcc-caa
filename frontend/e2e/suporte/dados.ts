import type { Page } from '@playwright/test'

export const QUIZ_ASSOCIACAO = {
  id: 1,
  id_usuario: null,
  nome_quiz: 'O que é isso?',
  nivel: 'facil',
  padrao: true,
  perguntas: [
    {
      id: 1,
      id_quiz: 1,
      texto_pergunta: 'Qual é a bebida?',
      imagem_url: '/pictogramas/agua.png',
      audio_url: null,
      alternativas: [
        { id: 11, texto_alternativa: 'Leite', correta: false, ordem: 1 },
        { id: 12, texto_alternativa: 'Água', correta: true, ordem: 2 },
        { id: 13, texto_alternativa: 'Suco', correta: false, ordem: 3 },
      ],
    },
    {
      id: 2,
      id_quiz: 1,
      texto_pergunta: 'O que é isso?',
      imagem_url: '/pictogramas/bola.png',
      audio_url: null,
      alternativas: [
        { id: 21, texto_alternativa: 'Bola', correta: true, ordem: 1 },
        { id: 22, texto_alternativa: 'Carro', correta: false, ordem: 2 },
      ],
    },
  ],
}

export async function simularApiDeQuizzes(page: Page): Promise<void> {
  await page.route('**/api/quizzes**', async (rota) => {
    const caminho = new URL(rota.request().url()).pathname

    if (caminho.endsWith(`/quizzes/${QUIZ_ASSOCIACAO.id}`)) {
      return rota.fulfill({ json: { data: QUIZ_ASSOCIACAO } })
    }

    return rota.fulfill({ json: { data: [QUIZ_ASSOCIACAO], current_page: 1, last_page: 1, per_page: 50, total: 1 } })
  })
}
