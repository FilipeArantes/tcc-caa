import { use } from 'react'
import { SidebarContext, type ISidebarContextValue } from './SidebarContext'

export function useSidebarContext(): ISidebarContextValue {
  const contexto = use(SidebarContext)

  if (contexto === null) {
    throw new Error('As partes da Sidebar precisam estar dentro de Sidebar.Provider.')
  }

  return contexto
}
