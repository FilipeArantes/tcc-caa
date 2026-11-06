import { CircleAlert } from 'lucide-react'
import type { ErroLogin } from '../../types/Sessao'
import { useSessaoContext } from '../Sessao/useSessaoContext'

const AVISO =
  'flex items-start gap-3 rounded-2xl border-2 border-erro bg-erro-soft p-4 text-rotulo text-texto'

const MENSAGENS: Record<ErroLogin, string> = {
  menor_de_idade:
    'O modo mediador é só para maiores de 18 anos. A data de nascimento da conta Google indica menos de 18.',
  cancelado: 'O login com o Google foi cancelado. Nada foi alterado.',
  oauth: 'Não foi possível entrar com o Google. Tente de novo.',
  google_indisponivel: 'O servidor não conseguiu falar com o Google agora. Espere um pouco e tente de novo.',
  codigo: 'O login demorou demais para ser concluído. Tente entrar de novo.',
  rede: 'Sem conexão com o servidor. Verifique a internet e tente de novo.',
}

export function AreaMediadorAvisoErro() {
  const { state } = useSessaoContext()

  if (state.erroLogin === null) {
    return null
  }

  return (
    <div role="alert" className={AVISO}>
      <CircleAlert size={28} strokeWidth={2.5} aria-hidden="true" className="shrink-0 text-erro" />
      <p className="m-0">{MENSAGENS[state.erroLogin]}</p>
    </div>
  )
}
