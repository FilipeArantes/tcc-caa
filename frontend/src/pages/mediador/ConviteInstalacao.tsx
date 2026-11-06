import { Dialogo } from '../../components/Dialogo'
import { InstalarApp } from '../../components/InstalarApp'

export function ConviteInstalacao() {
  return (
    <InstalarApp.Convite>
      <Dialogo.Titulo>Instale o Diz Aí neste aparelho</Dialogo.Titulo>
      <Dialogo.Texto>
        Instalado, o Diz Aí abre direto da tela inicial, em tela cheia. Quem usa a comunicação não precisa
        procurar o endereço no navegador.
      </Dialogo.Texto>

      <InstalarApp.Apple>
        <InstalarApp.PassosApple />
      </InstalarApp.Apple>

      <Dialogo.Acoes>
        <InstalarApp.Nativa>
          <InstalarApp.Dispensar>Agora não</InstalarApp.Dispensar>
          <InstalarApp.Instalar>Instalar o app</InstalarApp.Instalar>
        </InstalarApp.Nativa>
        <InstalarApp.Apple>
          <InstalarApp.Dispensar>Entendi</InstalarApp.Dispensar>
        </InstalarApp.Apple>
      </Dialogo.Acoes>
    </InstalarApp.Convite>
  )
}
