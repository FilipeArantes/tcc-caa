import { InstalarAppApple } from './InstalarAppApple'
import { InstalarAppConvite } from './InstalarAppConvite'
import { InstalarAppDispensar } from './InstalarAppDispensar'
import { InstalarAppInstalar } from './InstalarAppInstalar'
import { InstalarAppMenu } from './InstalarAppMenu'
import { InstalarAppNaoInstalado } from './InstalarAppNaoInstalado'
import { InstalarAppNativa } from './InstalarAppNativa'
import { InstalarAppPassosApple } from './InstalarAppPassosApple'
import { InstalarAppProvider } from './InstalarAppProvider'

export const InstalarApp = {
  Provider: InstalarAppProvider,
  Convite: InstalarAppConvite,
  NaoInstalado: InstalarAppNaoInstalado,
  Nativa: InstalarAppNativa,
  Apple: InstalarAppApple,
  Menu: InstalarAppMenu,
  Instalar: InstalarAppInstalar,
  Dispensar: InstalarAppDispensar,
  PassosApple: InstalarAppPassosApple,
}
