import type { ReactNode } from 'react'
import { useSidebarContext } from './useSidebarContext'

export interface ISidebarRotuloProps {
  children: ReactNode
}

export function SidebarRotulo({ children }: ISidebarRotuloProps) {
  const { state } = useSidebarContext()

  return <span className={state.aberta ? 'text-rotulo font-bold' : 'sr-only'}>{children}</span>
}
