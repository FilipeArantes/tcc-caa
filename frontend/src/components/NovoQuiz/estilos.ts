export const ROTULO = 'text-rotulo font-bold text-texto'

export const ENTRADA =
  'h-acao w-full min-w-0 rounded-2xl border-2 border-borda bg-surface px-4 text-rotulo text-texto ' +
  'placeholder:text-discreto focus:border-primary disabled:bg-fundo disabled:text-discreto'

export const BOTAO_SECUNDARIO =
  'flex h-acao items-center justify-center gap-2 rounded-2xl border-2 border-borda bg-surface px-5 ' +
  'text-rotulo font-bold text-texto transition-colors hover:bg-fundo active:bg-fundo ' +
  'disabled:cursor-not-allowed disabled:opacity-40'

export const BOTAO_PERIGO =
  'flex h-acao w-acao shrink-0 items-center justify-center rounded-2xl border-2 border-borda bg-surface ' +
  'text-erro hover:bg-erro-soft active:bg-erro-soft disabled:cursor-not-allowed disabled:opacity-40'

export const BOTAO_TRACEJADO =
  'flex h-acao items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary ' +
  'bg-surface px-6 text-rotulo font-bold text-primary hover:bg-primary-soft active:bg-primary-soft ' +
  'disabled:cursor-not-allowed disabled:opacity-40'
