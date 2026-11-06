import { DialogoAcoes } from './DialogoAcoes'
import { DialogoCancelar } from './DialogoCancelar'
import { DialogoConfirmar } from './DialogoConfirmar'
import { DialogoRoot } from './DialogoRoot'
import { DialogoTexto } from './DialogoTexto'
import { DialogoTitulo } from './DialogoTitulo'

export const Dialogo = {
  Root: DialogoRoot,
  Titulo: DialogoTitulo,
  Texto: DialogoTexto,
  Acoes: DialogoAcoes,
  Confirmar: DialogoConfirmar,
  Cancelar: DialogoCancelar,
}
