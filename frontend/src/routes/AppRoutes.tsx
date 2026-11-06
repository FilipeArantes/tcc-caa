import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LayoutUsuario } from '../components/Layout/LayoutUsuario'
import { ComunicacaoPage } from '../pages/ComunicacaoPage'
import { EscritaLivrePage } from '../pages/EscritaLivrePage'
import { QuizPage } from '../pages/QuizPage'
import { JogarQuizPage } from '../pages/JogarQuizPage'
import { NovoQuizPage } from '../pages/NovoQuizPage'
import { CallbackPage } from '../pages/CallbackPage'
import { CreditosPage } from '../pages/CreditosPage'
import { AdminPictogramasPage } from '../pages/AdminPictogramasPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutUsuario />}>
          <Route path="/" element={<ComunicacaoPage />} />
          <Route path="/escrita-livre" element={<EscritaLivrePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/novo" element={<NovoQuizPage />} />
          <Route path="/quiz/:idQuiz" element={<JogarQuizPage />} />
          <Route path="/creditos" element={<CreditosPage />} />
        </Route>

        <Route path="/mediador/callback" element={<CallbackPage />} />
        <Route path="/mediador/pictogramas" element={<AdminPictogramasPage />} />
      </Routes>
    </BrowserRouter>
  )
}
