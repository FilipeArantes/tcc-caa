import { useSessaoContext } from '../Sessao/useSessaoContext'

const PERFIL = 'flex items-center gap-4'

const INICIAIS =
  'flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-soft ' +
  'text-2xl font-bold text-primary'

const NOME = 'm-0 break-words text-2xl font-bold leading-tight text-texto'

const EMAIL = 'm-0 break-all text-base text-discreto'

const SELOS = 'flex flex-wrap gap-2'

const SELO = 'rounded-full px-3 py-1 text-base font-bold'

const SELO_CONFIRMADO = `${SELO} bg-acerto-soft text-acerto`

const SELO_PENDENTE = `${SELO} bg-aviso-soft text-aviso`

const SELO_MEDIADOR = `${SELO} bg-primary-soft text-primary`

const SELO_NORMAL = `${SELO} bg-fundo text-discreto`

function iniciais(nome: string): string {
  return nome
    .split(' ')
    .filter((parte) => parte.length > 0)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('')
}

function horario(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function AreaMediadorPerfil() {
  const { state, meta } = useSessaoContext()

  if (state.usuario === null) {
    return null
  }

  const { usuario } = state

  return (
    <div className="flex flex-col gap-4">
      <div className={PERFIL}>
        <span aria-hidden="true" className={INICIAIS}>
          {iniciais(usuario.nome)}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <p className={NOME}>{usuario.nome}</p>
          {usuario.email !== null ? <p className={EMAIL}>{usuario.email}</p> : null}
        </div>
      </div>

      <div className={SELOS}>
        {meta.modoMediadorExpiraEm !== null ? (
          <span className={SELO_MEDIADOR}>Modo mediador até {horario(meta.modoMediadorExpiraEm)}</span>
        ) : (
          <span className={SELO_NORMAL}>Modo normal</span>
        )}
        {usuario.idade_confirmada ? (
          <span className={SELO_CONFIRMADO}>Maior de 18 confirmado</span>
        ) : (
          <span className={SELO_PENDENTE}>Idade não informada pelo Google</span>
        )}
      </div>
    </div>
  )
}
