import { AreaMediador } from '../../components/AreaMediador'
import { InstalarApp } from '../../components/InstalarApp'
import { Sessao } from '../../components/Sessao'

export function JanelaMediador() {
  return (
    <AreaMediador.Root>
      <AreaMediador.Cabecalho>Área do mediador</AreaMediador.Cabecalho>
      <AreaMediador.AvisoErro />

      <AreaMediador.Secao titulo="Este aparelho">
        <AreaMediador.Dispositivo />
      </AreaMediador.Secao>

      <InstalarApp.NaoInstalado>
        <AreaMediador.Secao titulo="Instalar o app">
          <AreaMediador.Texto>
            Instalado, o Diz Aí abre direto da tela inicial, em tela cheia, sem a barra do navegador.
          </AreaMediador.Texto>
          <InstalarApp.Nativa>
            <AreaMediador.Acoes>
              <InstalarApp.Instalar>Instalar o app</InstalarApp.Instalar>
            </AreaMediador.Acoes>
          </InstalarApp.Nativa>
          <InstalarApp.Apple>
            <InstalarApp.PassosApple />
          </InstalarApp.Apple>
          <InstalarApp.Menu>
            <AreaMediador.Texto>
              Abra o menu do navegador e escolha "Instalar app" ou "Adicionar à tela inicial". No computador, use o
              Chrome ou o Edge.
            </AreaMediador.Texto>
          </InstalarApp.Menu>
        </AreaMediador.Secao>
      </InstalarApp.NaoInstalado>

      <Sessao.Visitante>
        <AreaMediador.Secao titulo="Mediador">
          <AreaMediador.Texto>
            Entre com uma conta Google para criar quizzes neste aparelho. É preciso ter 18 anos ou mais.
          </AreaMediador.Texto>
          <AreaMediador.Acoes>
            <AreaMediador.EntrarComGoogle>Entrar com Google</AreaMediador.EntrarComGoogle>
          </AreaMediador.Acoes>
        </AreaMediador.Secao>
      </Sessao.Visitante>

      <Sessao.Conectado>
        <AreaMediador.Secao titulo="Mediador">
          <AreaMediador.Perfil />

          <Sessao.ModoUsuario>
            <AreaMediador.Texto>
              Os seus quizzes aparecem para quem usa este aparelho. Para criar ou editar, entre de novo com o
              Google.
            </AreaMediador.Texto>
            <AreaMediador.Acoes>
              <AreaMediador.EntrarComGoogle>Entrar no modo mediador</AreaMediador.EntrarComGoogle>
            </AreaMediador.Acoes>
          </Sessao.ModoUsuario>

          <Sessao.ModoMediador>
            <AreaMediador.Acoes>
              <AreaMediador.VoltarAoNormal />
            </AreaMediador.Acoes>
          </Sessao.ModoMediador>
        </AreaMediador.Secao>

        <AreaMediador.Desconectar />
      </Sessao.Conectado>

      <Sessao.ModoMediador>
        <AreaMediador.Secao titulo="Medição de latência da fala">
          <AreaMediador.Latencia />
        </AreaMediador.Secao>
      </Sessao.ModoMediador>

      <AreaMediador.Creditos />
    </AreaMediador.Root>
  )
}
