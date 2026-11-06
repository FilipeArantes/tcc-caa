import { Keyboard, LayoutGrid, Puzzle } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { ConviteInstalacao } from '../../pages/mediador/ConviteInstalacao'
import { JanelaMediador } from '../../pages/mediador/JanelaMediador'
import { AreaMediador } from '../AreaMediador'
import { InstalarApp } from '../InstalarApp'
import { Sessao } from '../Sessao'
import { Sidebar } from '../Sidebar'
import { Layout } from './index'

export function LayoutUsuario() {
  return (
    <Sidebar.Provider>
      <InstalarApp.Provider>
        <AreaMediador.Provider>
          <Layout.Root>
            <Sidebar.Root>
              <Sidebar.Toggle />
              <Sidebar.Nav>
                <Sidebar.Item para="/" rotulo="Pictogramas" icone={LayoutGrid} />
                <Sidebar.Item para="/escrita-livre" rotulo="Abecedário" icone={Keyboard} />
                <Sidebar.Item para="/quiz" rotulo="Quiz" icone={Puzzle} />
              </Sidebar.Nav>
              <Sidebar.Rodape>
                <Sessao.ModoNormal>
                  <AreaMediador.GatilhoProtegido />
                </Sessao.ModoNormal>
                <Sessao.ModoMediador>
                  <AreaMediador.GatilhoAtivo />
                </Sessao.ModoMediador>
              </Sidebar.Rodape>
            </Sidebar.Root>

            <Layout.Conteudo>
              <Sessao.ModoMediador>
                <AreaMediador.Faixa>
                  <AreaMediador.VoltarAoNormal />
                </AreaMediador.Faixa>
              </Sessao.ModoMediador>
              <Outlet />
            </Layout.Conteudo>
          </Layout.Root>

          <JanelaMediador />
          <ConviteInstalacao />
        </AreaMediador.Provider>
      </InstalarApp.Provider>
    </Sidebar.Provider>
  )
}
