import { CalendarCheck, Medal, Mountain, Star, Trophy, type LucideIcon } from 'lucide-react'
import { CONQUISTAS, type IdConquista } from '../../services/conquistasService'

const ICONES: Record<IdConquista, LucideIcon> = {
  'primeiro-quiz': Star,
  'tudo-de-primeira': Trophy,
  'cinco-quizzes': Medal,
  'tres-dias': CalendarCheck,
  'nivel-dificil': Mountain,
}

const MEDALHA =
  'flex items-center gap-3 rounded-2xl border-2 border-aviso bg-aviso-soft px-4 py-3 text-texto'

const ICONE = 'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface text-aviso'

export interface IConquistasMedalhaProps {
  id: IdConquista
}

export function ConquistasMedalha({ id }: IConquistasMedalhaProps) {
  const conquista = CONQUISTAS[id]
  const Icone = ICONES[id]

  return (
    <li className={MEDALHA}>
      <span className={ICONE}>
        <Icone size={28} strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span className="flex flex-col">
        <span className="text-rotulo font-bold">{conquista.titulo}</span>
        <span className="text-base text-discreto">{conquista.descricao}</span>
      </span>
    </li>
  )
}
