import { useMemo, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { CategoriaContext } from './CategoriaContext'
import { FITZGERALD } from '../../types/fitzgerald'
import type { CategoriaGramatical } from '../../types/Categoria'

const RAIZ =
  'flex min-h-44 flex-col items-center justify-between gap-3 rounded-2xl border-4 p-4 ' +
  'shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:brightness-90'

export interface ICategoriaRootProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  gramatical: CategoriaGramatical
  children: ReactNode
}

export function CategoriaRoot({ gramatical, children, ...props }: ICategoriaRootProps) {
  const estilo = FITZGERALD[gramatical]

  const valor = useMemo(
    () => ({ state: { gramatical }, meta: { estilo } }),
    [gramatical, estilo]
  )

  return (
    <CategoriaContext value={valor}>
      <button {...props} type="button" className={[RAIZ, estilo.fundo, estilo.borda].join(' ')}>
        {children}
      </button>
    </CategoriaContext>
  )
}
