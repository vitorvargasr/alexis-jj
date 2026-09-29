import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Flame,
  MessageCircle,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { Confetti } from '@/components/Confetti'
import { EmptyArtwork } from '@/components/EmptyArtwork'
import { PosterArtwork } from '@/components/PosterArtwork'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useLibrary } from '@/contexts/LibraryContext'
import { useMode } from '@/contexts/ModeContext'
import { earnStar } from '@/services/progress'
import { posterImageUrl } from '@/services/posters'

export default function PosterPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { chapters, posters, progress, loading, setProgressRecord } = useLibrary()
  const { isKid } = useMode()
  const [celebrating, setCelebrating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const touchStart = useRef<number | null>(null)

  const poster = posters.find((item) => item.id === id)
  const chapter = poster ? chapters.find((item) => item.id === poster.chapter) : undefined
  const siblings = poster
    ? posters.filter((item) => item.chapter === poster.chapter).sort((a, b) => a.order - b.order)
    : []
  const currentIndex = siblings.findIndex((item) => item.id === id)
  const currentProgress = progress.find((item) => item.poster === id)
  const isLastPanel = currentIndex === siblings.length - 1

  const move = useCallback(
    (delta: number) => {
      const target = siblings[currentIndex + delta]
      if (!target) return
      setDirection(delta > 0 ? 'next' : 'prev')
      navigate(`/poster/${target.id}`)
    },
    [siblings, currentIndex, navigate],
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') move(-1)
      if (event.key === 'ArrowRight') move(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [move])

  if (loading)
    return (
      <div className="page viewer-page">
        <div className="skeleton viewer-skeleton" />
      </div>
    )
  if (!poster || !chapter || !user) return <Navigate to="/" replace />

  const artwork = posterImageUrl(poster)
  const learnedSiblings = siblings.filter((s) =>
    progress.some((p) => p.poster === s.id && p.learned),
  ).length
  const allLearned = siblings.length > 0 && learnedSiblings === siblings.length

  const celebrate = async () => {
    if (saving) return
    setSaving(true)
    setCelebrating(false)
    try {
      const record = await earnStar(poster.id, user.id)
      setProgressRecord(record)
      setCelebrating(true)
      window.setTimeout(() => setCelebrating(false), 2400)
    } finally {
      setSaving(false)
    }
  }

  const isPosicao = poster.kind === 'posicao'

  return (
    <div className="page viewer-page comic-reader-page">
      {celebrating && <Confetti />}
      <div className="viewer-topline">
        <Link to={`/capitulo/${chapter.id}`} className="back-link">
          <ArrowLeft /> Voltar para a história
        </Link>
        <span className="comic-issue-tag">
          {chapter.emoji || '📖'} {chapter.title.replace(/^Edição \d+\s*—\s*/, '')}
        </span>
      </div>

      <div className="viewer-layout">
        <button
          className="viewer-arrow previous"
          onClick={() => move(-1)}
          disabled={currentIndex === 0}
          aria-label="Quadro anterior"
        >
          <ChevronLeft />
        </button>

        <section
          key={poster.id}
          className={`poster-view slide-page slide-${direction} comic-panel-view`}
          onTouchStart={(event) => {
            touchStart.current = event.touches[0].clientX
          }}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return
            const distance = event.changedTouches[0].clientX - touchStart.current
            if (Math.abs(distance) > 55) move(distance < 0 ? 1 : -1)
            touchStart.current = null
          }}
        >
          {/* Quadro do Gibi com moldura forte, balão e legenda estilo gibi */}
          <div className="paper-frame comic-frame">
            <div className="comic-corner-tag">
              {isPosicao ? (
                <>
                  <Flame /> Posição de Jiu-Jitsu
                </>
              ) : (
                <>
                  <Sparkles /> História do Álexis
                </>
              )}
            </div>

            {/* Número do quadro estilo revista */}
            <div className="comic-panel-badge">
              Quadro {currentIndex + 1} de {siblings.length}
            </div>

            {artwork ? (
              <img src={artwork} alt={`Quadro do Gibi: ${poster.title}`} />
            ) : (
              <PosterArtwork poster={poster} />
            )}

            {currentProgress?.learned && (
              <div className="gold-ribbon">
                <Star /> Aprendido!
              </div>
            )}
          </div>

          <div className="viewer-copy comic-viewer-copy">
            {isKid ? (
              <>
                <div className="kid-title-row">
                  <div>
                    <span className="eyebrow comic-eyebrow">
                      {isPosicao ? '🥋 Aprenda no tatame' : '📖 O dia a dia com o papai'}
                    </span>
                    <h1>{poster.title}</h1>
                  </div>
                  <span className={celebrating ? 'star-medal star-pop' : 'star-medal'}>★</span>
                </div>

                {/* Balão de narração / legenda do gibi */}
                {poster.caption && (
                  <div className="comic-caption-box">
                    <span className="comic-narrator-tag">NARRAÇÃO DO GIBI</span>
                    <p>{poster.caption}</p>
                  </div>
                )}

                {/* Balão de fala alegre */}
                <div className="speech-bubble comic-speech-bubble">
                  <MessageCircle />
                  <p>{poster.kid_text || poster.caption}</p>
                </div>

                {/* Botão de conquista / estrela */}
                <Button
                  className="learn-button comic-learn-button"
                  onClick={celebrate}
                  disabled={saving}
                >
                  <span className={celebrating ? 'star-pop' : ''}>
                    {saving
                      ? 'Guardando...'
                      : currentProgress?.learned
                        ? 'Praticar de novo! ⭐'
                        : 'Consegui! ⭐'}
                  </span>
                </Button>

                <div
                  className="earned-stars"
                  aria-label={`${currentProgress?.stars || 0} de 3 estrelas`}
                >
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={star <= (currentProgress?.stars || 0) ? 'filled' : ''}
                    />
                  ))}
                  <span>
                    {currentProgress?.stars
                      ? `${currentProgress.stars} estrela${currentProgress.stars > 1 ? 's' : ''} conquistada${currentProgress.stars > 1 ? 's' : ''}!`
                      : 'Toque para marcar e ganhar estrelas'}
                  </span>
                </div>

                {/* Se for o último quadro e tudo foi lido/treinado, mostra comemoração final de história */}
                {isLastPanel && (
                  <div className="comic-story-celebration fade-rise">
                    <div className="celebration-badge">
                      <PartyPopper /> Fim desta aventura!
                    </div>
                    <h3>Você completou esta história do gibi! 🎉</h3>
                    <p>
                      O Álexis e o papai têm muito orgulho de você no tatame. Veja a evolução da sua
                      faixa!
                    </p>
                    <div className="celebration-actions">
                      <Button asChild className="celebrate-home-btn">
                        <Link to="/">Ver minha faixa na capa ⭐</Link>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const target = siblings[0]
                          if (target) navigate(`/poster/${target.id}`)
                        }}
                      >
                        Ler história de novo 🔄
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="dad-view-title">
                  <span className="eyebrow">
                    {isPosicao ? 'Quadro de técnica / posição' : 'Quadro narrativo da história'}
                  </span>
                  <h1>{poster.title}</h1>
                </div>

                {poster.caption && (
                  <section className="dad-caption-panel">
                    <span className="dad-caption-tag">LEGENDA DO QUADRINHO</span>
                    <p>{poster.caption}</p>
                  </section>
                )}

                <section className="dad-tip-panel">
                  <div className="dad-tip-label">
                    <ShieldCheck /> ORIENTAÇÃO PARA O PAPAI
                  </div>
                  <p>
                    {poster.dad_tip || 'Adicione uma orientação para este quadro em Gerenciar.'}
                  </p>
                </section>

                <section className="say-panel">
                  <span>
                    <MessageCircle /> Como falar com o Álexis neste quadro
                  </span>
                  <p>“{poster.kid_text || poster.caption}”</p>
                </section>
              </>
            )}
          </div>
        </section>

        <button
          className="viewer-arrow next"
          onClick={() => move(1)}
          disabled={currentIndex === siblings.length - 1}
          aria-label="Próximo quadro"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="viewer-mobile-nav">
        <Button variant="outline" onClick={() => move(-1)} disabled={currentIndex === 0}>
          <ChevronLeft /> Quadro anterior
        </Button>
        <Button
          variant="outline"
          onClick={() => move(1)}
          disabled={currentIndex === siblings.length - 1}
        >
          Próximo quadro <ChevronRight />
        </Button>
      </div>

      <div className="poster-pager comic-pager">
        <strong>
          Página / Quadro {currentIndex + 1} de {siblings.length}
        </strong>
        <span>·</span>
        <span>{chapter.title}</span>
        {isKid && (
          <small>
            {learnedSiblings}/{siblings.length} quadros concluídos nesta história
            {allLearned && ' · História Concluída! 🏆'}
          </small>
        )}
      </div>
    </div>
  )
}
