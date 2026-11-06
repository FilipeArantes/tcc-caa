import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useSidebarContext } from './useSidebarContext'

const ITEM =
  'relative flex h-item-nav items-center gap-3 rounded-xl px-4 ' +
  'text-rotulo font-bold no-underline transition-colors'

const ITEM_RECOLHIDO = 'justify-center px-0'

const ITEM_ATIVO =
  'bg-primary-soft text-primary before:absolute before:left-0 ' +
  'before:top-2 before:bottom-2 before:w-1.5 before:rounded-full before:bg-primary'

const ITEM_INATIVO = 'text-primary hover:bg-primary-soft active:bg-primary-soft'

export interface ISidebarItemProps {
  para: string
  rotulo: string
  icone: LucideIcon
}

export function SidebarItem({ para, rotulo, icone: Icone }: ISidebarItemProps) {
  const { state } = useSidebarContext()

  function montarClasses({ isActive }: { isActive: boolean }) {
    return [
      ITEM,
      state.aberta ? '' : ITEM_RECOLHIDO,
      isActive ? ITEM_ATIVO : ITEM_INATIVO,
    ].join(' ')
  }

  return (
    <li>
      <NavLink
        to={para}
        end
        title={state.aberta ? undefined : rotulo}
        className={montarClasses}
      >
        <Icone size={30} strokeWidth={2.5} aria-hidden="true" className="shrink-0" />
        {state.aberta ? <span>{rotulo}</span> : <span className="sr-only">{rotulo}</span>}
      </NavLink>
    </li>
  )
}
