import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Star,
} from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { Confetti } from '@/components/Confetti'
import { EmptyArtwork } from '@/components/EmptyArtwork'
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
  const chapterProgress = progress.filter(
    (item) => item.learned && siblings.some((sibling) => sibling.id === item.poster),
  ).length

  const celebrate = async () => {
    if (saving) return
    setSaving(true)
    setCelebrating(false)
    try {
      const record = await earnStar(poster.id, user.id)
      setProgressRecord(record)
      setCelebrating(true)
      window.setTimeout(() => setCelebrating(false), 1500)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page viewer-page">
      {celebrating && <Confetti />}
      <div className="viewer-topline">
        <Link to={`/capitulo/${chapter.id}`} className="back-link">
          <ArrowLeft /> Voltar ao capítulo
        </Link>
        <span>
          {chapter.emoji} Capítulo {chapters.findIndex((item) => item.id === chapter.id) + 1}
        </span>
      </div>

      <div className="viewer-layout">
        <button
          className="viewer-arrow previous"
          onClick={() => move(-1)}
          disabled={currentIndex === 0}
          aria-label="Pôster anterior"
        >
          <ChevronLeft />
        </button>
        <section
          key={poster.id}
          className={`poster-view slide-page slide-${direction}`}
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
          <div className="paper-frame">
            <div className="tape tape-left" aria-hidden="true" />
            <div className="tape tape-right" aria-hidden="true" />
            {artwork ? (
              <img src={artwork} alt={`Pôster ilustrado: ${poster.title}`} />
            ) : (
              <EmptyArtwork />
            )}
            {currentProgress?.learned && (
              <div className="gold-ribbon">
                <Star /> Aprendido
              </div>
            )}
          </div>

          <div className="viewer-copy">
            {isKid ? (
              <>
                <div className="kid-title-row">
                  <div>
                    <span className="eyebrow">Missão do tatame</span>
                    <h1>{poster.title}</h1>
                  </div>
                  <span className={celebrating ? 'star-medal star-pop' : 'star-medal'}>★</span>
                </div>
                <div className="speech-bubble">
                  <MessageCircle />
                  <p>{poster.kid_text}</p>
                </div>
                <Button className="learn-button" onClick={celebrate} disabled={saving}>
                  <span className={celebrating ? 'star-pop' : ''}>
                    {saving ? 'Guardando...' : 'Consegui! ⭐'}
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
                      : 'Você pode conquistar até 3 estrelas'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="dad-view-title">
                  <span className="eyebrow">Pôster de treino</span>
                  <h1>{poster.title}</h1>
                </div>
                <section className="dad-tip-panel">
                  <div className="dad-tip-label">
                    <ShieldCheck /> PARA O PAI
                  </div>
                  <p>
                    {poster.dad_tip || 'Adicione uma orientação para este pôster em Gerenciar.'}
                  </p>
                </section>
                <section className="say-panel">
                  <span>
                    <MessageCircle /> Fale com o Álexis
                  </span>
                  <p>“{poster.kid_text}”</p>
                </section>
              </>
            )}
          </div>
        </section>
        <button
          className="viewer-arrow next"
          onClick={() => move(1)}
          disabled={currentIndex === siblings.length - 1}
          aria-label="Próximo pôster"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="viewer-mobile-nav">
        <Button variant="outline" onClick={() => move(-1)} disabled={currentIndex === 0}>
          <ChevronLeft /> Anterior
        </Button>
        <Button
          variant="outline"
          onClick={() => move(1)}
          disabled={currentIndex === siblings.length - 1}
        >
          Próximo <ChevronRight />
        </Button>
      </div>
      <div className="poster-pager">
        <strong>
          Pôster {currentIndex + 1} de {siblings.length}
        </strong>
        <span>·</span>
        <span>{chapter.title}</span>
        {isKid && (
          <small>
            {chapterProgress}/{siblings.length} aprendidos neste capítulo
          </small>
        )}
      </div>
    </div>
  )
}
