import type { HTMLAttributes, ReactNode } from 'react'
import { useSidebarContext } from './useSidebarContext'

const RAIZ =
  'flex h-full shrink-0 flex-col gap-2 overflow-y-auto border-r border-borda ' +
  'bg-surface p-3 transition-[width] duration-200'

export interface ISidebarRootProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export function SidebarRoot({ children, ...props }: ISidebarRootProps) {
  const { state, meta } = useSidebarContext()

  const largura = state.aberta ? meta.larguraAberta : meta.larguraFechada

  return (
    <nav {...props} aria-label="Navegação principal" style={{ width: largura }} className={RAIZ}>
      {children}
    </nav>
  )
}
