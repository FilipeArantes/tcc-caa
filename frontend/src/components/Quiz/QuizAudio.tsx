import { Pause, Play } from 'lucide-react'
import { useRef, useState } from 'react'
import { useQuizContext } from './useQuizContext'

const BOTAO =
  'flex h-acao items-center gap-3 rounded-2xl border-2 border-primary bg-surface px-8 ' +
  'text-entrada font-bold text-primary transition-colors hover:bg-primary-soft active:bg-primary-soft'

export function QuizAudio() {
  const { state } = useQuizContext()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [tocando, setTocando] = useState(false)

  if (state.pergunta?.audio_url == null) {
    return null
  }

  function alternar() {
    const audio = audioRef.current

    if (audio === null) {
      return
    }

    if (audio.paused) {
      window.speechSynthesis?.cancel()
      audio.currentTime = 0
      void audio.play()
      return
    }

    audio.pause()
  }

  return (
    <>
      <audio
        key={state.pergunta.id}
        ref={audioRef}
        src={state.pergunta.audio_url}
        preload="auto"
        onPlay={() => setTocando(true)}
        onPause={() => setTocando(false)}
        onEnded={() => setTocando(false)}
      />
      <button type="button" className={BOTAO} onClick={alternar}>
        {tocando ? (
          <Pause size={32} strokeWidth={2.5} aria-hidden="true" />
        ) : (
          <Play size={32} strokeWidth={2.5} aria-hidden="true" />
        )}
        <span>{tocando ? 'Pausar' : 'Ouvir som'}</span>
      </button>
    </>
  )
}
