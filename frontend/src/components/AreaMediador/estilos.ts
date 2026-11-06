const BOTAO_BASE =
  'flex h-acao items-center justify-center gap-3 rounded-2xl px-6 text-rotulo font-bold ' +
  'transition-colors disabled:cursor-not-allowed disabled:opacity-50'

export const BOTAO_CONTORNO =
  `${BOTAO_BASE} border-2 border-primary bg-surface text-primary hover:bg-primary-soft active:bg-primary-soft`

export const BOTAO_SECUNDARIO =
  `${BOTAO_BASE} border-2 border-borda bg-surface text-texto hover:bg-fundo active:bg-fundo`

export const BOTAO_PERIGO =
  `${BOTAO_BASE} border-2 border-erro bg-surface text-erro hover:bg-erro-soft active:bg-erro-soft`

export const GATILHO_BASE =
  'relative flex h-12 w-12 items-center justify-center self-center overflow-hidden rounded-xl ' +
  'select-none [-webkit-touch-callout:none] transition-colors'
