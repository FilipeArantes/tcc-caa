import { Menu, PanelLeftClose } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { useSidebarContext } from './useSidebarContext'

const BOTAO =
  'flex h-item-nav w-full items-center gap-3 rounded-xl px-4 ' +
  'text-primary hover:bg-primary-soft active:bg-primary-soft'

export type ISidebarToggleProps = ButtonHTMLAttributes<HTMLButtonElement>

export function SidebarToggle({ ...props }: ISidebarToggleProps) {
  const { state, actions } = useSidebarContext()

  const rotulo = state.aberta ? 'Fechar menu' : 'Abrir menu'
  const Icone = state.aberta ? PanelLeftClose : Menu

  return (
    <button
      {...props}
      type="button"
      onClick={actions.alternar}
      aria-label={rotulo}
      aria-expanded={state.aberta}
      title={rotulo}
      className={BOTAO}
    >
      <Icone size={28} strokeWidth={2.5} aria-hidden="true" className="shrink-0" />
      {state.aberta ? <span className="text-rotulo font-bold">Menu</span> : null}
    </button>
  )
}
