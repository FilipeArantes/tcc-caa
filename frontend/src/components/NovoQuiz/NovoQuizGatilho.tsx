import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

const BOTAO =
  'flex h-acao items-center gap-3 rounded-2xl bg-primary px-6 text-rotulo font-bold text-white no-underline ' +
  'shadow-sm transition-colors hover:bg-primary-dark active:bg-primary-dark'

export function NovoQuizGatilho() {
  return (
    <Link to="/quiz/novo" className={BOTAO}>
      <Plus size={28} strokeWidth={2.5} aria-hidden="true" />
      <span>Adicionar quiz</span>
    </Link>
  )
}
