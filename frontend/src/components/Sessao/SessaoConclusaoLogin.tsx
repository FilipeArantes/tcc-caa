import { LoaderCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { consumirRotaDeRetorno } from '../../services/authService'
import type { ErroLogin } from '../../types/Sessao'
import { useSessaoContext } from './useSessaoContext'

const CONTEINER = 'flex min-h-screen flex-col items-center justify-center gap-4 bg-fundo p-6 text-texto'

const ERROS_DO_PROVEDOR: ErroLogin[] = ['menor_de_idade', 'cancelado', 'oauth', 'google_indisponivel']

function erroDoProvedor(valor: string | null): ErroLogin {
  return ERROS_DO_PROVEDOR.find((erro) => erro === valor) ?? 'oauth'
}

export function SessaoConclusaoLogin() {
  const { actions } = useSessaoContext()
  const [parametros] = useSearchParams()
  const navegar = useNavigate()
  const iniciado = useRef(false)

  useEffect(() => {
    if (iniciado.current) {
      return
    }

    iniciado.current = true

    const codigo = parametros.get('codigo')
    const retorno = consumirRotaDeRetorno()

    async function concluir() {
      if (codigo !== null) {
        await actions.concluirLogin(codigo)
      } else {
        actions.registrarErroLogin(erroDoProvedor(parametros.get('erro')))
      }

      navegar(retorno, { replace: true })
    }

    concluir()
  }, [actions, parametros, navegar])

  return (
    <div role="status" className={CONTEINER}>
      <LoaderCircle
        size={48}
        strokeWidth={2.5}
        aria-hidden="true"
        className="animate-spin text-primary motion-reduce:animate-none"
      />
      <p className="m-0 text-entrada font-bold">Entrando no modo mediador…</p>
    </div>
  )
}
