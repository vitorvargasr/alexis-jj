import { ArrowLeft, ChevronRight, Hammer, Star } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { EmptyArtwork } from '@/components/EmptyArtwork'
import { ProgressBar } from '@/components/ProgressBar'
import { useLibrary } from '@/contexts/LibraryContext'
import { useMode } from '@/contexts/ModeContext'
import { posterImageUrl } from '@/services/posters'

export default function ChapterPage() {
  const { id } = useParams()
  const { chapters, posters, progress, loading } = useLibrary()
  const { isKid } = useMode()
  const chapter = chapters.find((item) => item.id === id)
  const chapterPosters = posters
    .filter((poster) => poster.chapter === id)
    .sort((a, b) => a.order - b.order)
  const learnedIds = new Set(progress.filter((item) => item.learned).map((item) => item.poster))
  const learned = chapterPosters.filter((poster) => learnedIds.has(poster.id)).length

  if (loading)
    return (
      <div className="page">
        <div className="skeleton hero-skeleton" />
      </div>
    )
  if (!chapter) return <Navigate to="/" replace />

  return (
    <div className="page chapter-page">
      <Link to="/" className="back-link">
        <ArrowLeft /> Voltar para os capítulos
      </Link>
      <header className="chapter-hero fade-rise">
        <div className="chapter-hero-icon">{chapter.emoji || '🥋'}</div>
        <div>
          <span className="eyebrow">
            Capítulo {chapters.findIndex((item) => item.id === chapter.id) + 1}
          </span>
          <h1>{chapter.title.replace(/^Capítulo \d+\s*—\s*/, '')}</h1>
          <p>{chapter.description}</p>
          <ProgressBar learned={learned} total={chapterPosters.length} />
        </div>
        <div className="chapter-hero-stars" aria-hidden="true">
          ✦ ★ ✦
        </div>
      </header>

      <div className="section-heading posters-heading">
        <div>
          <span className="eyebrow">Passo a passo</span>
          <h2>
            {chapterPosters.length} {chapterPosters.length === 1 ? 'pôster' : 'pôsteres'}
          </h2>
        </div>
      </div>

      {chapterPosters.length ? (
        <div className="poster-grid">
          {chapterPosters.map((poster, index) => {
            const progressItem = progress.find((item) => item.poster === poster.id)
            const artwork = posterImageUrl(poster, '480x0')
            return (
              <Link
                key={poster.id}
                to={`/poster/${poster.id}`}
                className="poster-card fade-rise"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="poster-thumbnail">
                  {artwork ? (
                    <img src={artwork} alt={`Ilustração: ${poster.title}`} />
                  ) : (
                    <EmptyArtwork compact />
                  )}
                  <span className="poster-number">{index + 1}</span>
                  {progressItem?.learned && (
                    <span className="learned-ribbon">
                      <Star /> Aprendido
                    </span>
                  )}
                </div>
                <div className="poster-card-copy">
                  <div>
                    <h3>{poster.title}</h3>
                    {isKid ? (
                      <p>{poster.kid_text}</p>
                    ) : (
                      <p className="dad-teaser">
                        <span>PARA O PAI</span> {poster.dad_tip.slice(0, 72)}
                        {poster.dad_tip.length > 72 ? '…' : ''}
                      </p>
                    )}
                  </div>
                  <div className="poster-card-footer">
                    <span className="stars" aria-label={`${progressItem?.stars || 0} estrelas`}>
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          className={star <= (progressItem?.stars || 0) ? 'filled' : ''}
                        />
                      ))}
                    </span>
                    <ChevronRight />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="construction-empty comic-card">
          <Hammer />
          <h2>Este capítulo ainda está em construção 🚧</h2>
          <p>
            {isKid
              ? 'O papai está preparando novas aventuras para você.'
              : 'Adicione o primeiro pôster deste capítulo pela área de gerenciamento.'}
          </p>
          {!isKid && <Link to="/gerenciar">Adicionar pôster</Link>}
        </div>
      )}
    </div>
  )
}
