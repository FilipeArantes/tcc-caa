import type { ReactNode } from 'react'
import { Dialogo } from '../Dialogo'
import { useInstalarAppContext } from './useInstalarAppContext'

export interface IInstalarAppConviteProps {
  children: ReactNode
}

export function InstalarAppConvite({ children }: IInstalarAppConviteProps) {
  const { state, actions } = useInstalarAppContext()

  return (
    <Dialogo.Root aberto={state.conviteAberto} aoFechar={actions.dispensar} titulo="Instalar o Diz Aí">
      {children}
    </Dialogo.Root>
  )
}
