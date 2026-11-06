import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Dialogo } from '../Dialogo'
import { useInstalarAppContext } from './useInstalarAppContext'

export interface IInstalarAppDispensarProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function InstalarAppDispensar({ children, ...props }: IInstalarAppDispensarProps) {
  const { actions } = useInstalarAppContext()

  return (
    <Dialogo.Cancelar {...props} onClick={actions.dispensar}>
      {children}
    </Dialogo.Cancelar>
  )
}
