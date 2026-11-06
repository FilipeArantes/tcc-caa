import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { useSessaoContext } from '../Sessao/useSessaoContext'
import { BOTAO_PERIGO, BOTAO_SECUNDARIO } from './estilos'
import { useAreaMediadorContext } from './useAreaMediadorContext'

const CONFIRMACAO = 'flex flex-col gap-4 rounded-2xl border-2 border-erro bg-erro-soft p-4'

const TEXTO = 'm-0 text-rotulo leading-relaxed text-texto'

export function AreaMediadorDesconectar() {
  const sessao = useSessaoContext()
  const area = useAreaMediadorContext()
  const [confirmando, setConfirmando] = useState(false)

  async function desconectar() {
    await sessao.actions.desconectar()
    setConfirmando(false)
    area.actions.fechar()
  }

  if (!confirmando) {
    return (
      <button type="button" className={BOTAO_PERIGO} onClick={() => setConfirmando(true)}>
        <LogOut size={26} strokeWidth={2.5} aria-hidden="true" />
        <span>Desconectar deste aparelho</span>
      </button>
    )
  }

  return (
    <div role="group" aria-label="Confirmar desconexão" className={CONFIRMACAO}>
      <p className={TEXTO}>
        Este aparelho vai esquecer você e os seus quizzes deixam de aparecer aqui. Eles continuam salvos e
        voltam quando você entrar com o Google de novo.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" className={BOTAO_SECUNDARIO} onClick={() => setConfirmando(false)}>
          Cancelar
        </button>
        <button
          type="button"
          className={BOTAO_PERIGO}
          disabled={sessao.state.processando}
          onClick={desconectar}
        >
          <LogOut size={26} strokeWidth={2.5} aria-hidden="true" />
          <span>Desconectar</span>
        </button>
      </div>
    </div>
  )
}
