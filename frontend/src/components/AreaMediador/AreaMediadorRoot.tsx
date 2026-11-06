import type { ReactNode } from 'react'
import { Dialogo } from '../Dialogo'
import { useAreaMediadorContext } from './useAreaMediadorContext'

export interface IAreaMediadorRootProps {
  children: ReactNode
}

export function AreaMediadorRoot({ children }: IAreaMediadorRootProps) {
  const { state, actions } = useAreaMediadorContext()

  return (
    <Dialogo.Root aberto={state.aberta} aoFechar={actions.fechar} titulo="Área do mediador">
      {children}
    </Dialogo.Root>
  )
}
