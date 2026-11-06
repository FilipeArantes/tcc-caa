const SECAO = 'flex max-w-3xl flex-col gap-4 rounded-2xl border border-borda bg-surface p-6'

const TITULO = 'm-0 text-3xl font-bold text-texto'

const SUBTITULO = 'm-0 text-2xl font-bold text-texto'

const TEXTO = 'm-0 text-rotulo leading-relaxed text-texto'

const LINK = 'font-bold text-primary underline underline-offset-4'

export function CreditosPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className={TITULO}>Créditos e licenças</h1>

      <section aria-labelledby="creditos-arasaac" className={SECAO}>
        <h2 id="creditos-arasaac" className={SUBTITULO}>
          Pictogramas
        </h2>
        <p className={TEXTO}>
          Os símbolos pictográficos utilizados são propriedade do Governo de Aragão (Espanha) e foram criados por
          Sergio Palao para o ARASAAC (
          <a href="https://arasaac.org" target="_blank" rel="noreferrer" className={LINK}>
            arasaac.org
          </a>
          ), que os distribui sob a licença{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br"
            target="_blank"
            rel="noreferrer"
            className={LINK}
          >
            Creative Commons BY-NC-SA
          </a>
          .
        </p>
        <p className={TEXTO}>
          O uso é gratuito e sem fins comerciais. Pictogramas adaptados a partir desse acervo são compartilhados sob a
          mesma licença.
        </p>
      </section>

      <section aria-labelledby="creditos-voz" className={SECAO}>
        <h2 id="creditos-voz" className={SUBTITULO}>
          Voz
        </h2>
        <p className={TEXTO}>
          A fala é gerada pela síntese de voz do próprio aparelho, por meio da Web Speech API do navegador.
        </p>
      </section>
    </div>
  )
}
