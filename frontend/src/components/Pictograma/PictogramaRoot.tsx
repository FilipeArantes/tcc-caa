import { useMemo, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { PictogramaContext } from './PictogramaContext'
import { FITZGERALD } from '../../types/fitzgerald'
import type { CategoriaGramatical } from '../../types/Categoria'

const RAIZ =
  'flex min-h-card-pictograma min-w-card-pictograma flex-col items-center justify-between ' +
  'gap-2 rounded-2xl border-4 p-3 shadow-sm transition-transform ' +
  'hover:-translate-y-0.5 active:translate-y-0.5 active:brightness-90'

export interface IPictogramaRootProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  categoria: CategoriaGramatical
  children: ReactNode
}

export function PictogramaRoot({ categoria, children, ...props }: IPictogramaRootProps) {
  const estilo = FITZGERALD[categoria]

  const valor = useMemo(
    () => ({ state: { categoria }, meta: { estilo } }),
    [categoria, estilo]
  )

  return (
    <PictogramaContext value={valor}>
      <button {...props} type="button" className={[RAIZ, estilo.fundo, estilo.borda].join(' ')}>
        {children}
      </button>
    </PictogramaContext>
  )
}
