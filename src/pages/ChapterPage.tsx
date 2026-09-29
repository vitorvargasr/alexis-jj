import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Flame,
  Hammer,
  Play,
  Sparkles,
  Star,
} from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { EmptyArtwork } from '@/components/EmptyArtwork'
import { ProgressBar } from '@/components/ProgressBar'
import { Button } from '@/components/ui/button'
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
  const chapterNumber = chapters.findIndex((item) => item.id === id) + 1
  const firstPoster = chapterPosters[0]

  if (loading)
    return (
      <div className="page">
        <div className="skeleton hero-skeleton" />
      </div>
    )
  if (!chapter) return <Navigate to="/" replace />

  return (
    <div className="page chapter-page comic-issue-page">
      <Link to="/" className="back-link">
        <ArrowLeft /> Voltar para as histórias do Gibi
      </Link>

      <header className="chapter-hero comic-issue-hero fade-rise">
        <div className="chapter-hero-icon">{chapter.emoji || '📖'}</div>
        <div className="comic-issue-hero-content">
          <div className="comic-issue-meta">
            <span className="eyebrow comic-eyebrow">Edição #{chapterNumber} da Revista</span>
            {firstPoster && (
              <Button asChild size="sm" className="start-reading-btn">
                <Link to={`/poster/${firstPoster.id}`}>
                  <Play /> Começar a ler do quadro 1
                </Link>
              </Button>
            )}
          </div>
          <h1>
            {chapter.title.replace(/^Edição \d+\s*—\s*/, '').replace(/^Capítulo \d+\s*—\s*/, '')}
          </h1>
          <p>{chapter.description}</p>
          <div className="comic-issue-progress-box">
            <div className="progress-label-row">
              <span>Seu progresso nesta história:</span>
              <strong>
                {learned} de {chapterPosters.length} quadros
              </strong>
            </div>
            <ProgressBar learned={learned} total={chapterPosters.length} />
          </div>
        </div>
        <div className="chapter-hero-stars comic-hero-burst" aria-hidden="true">
          POW! ★
        </div>
      </header>

      <div className="section-heading posters-heading comic-heading">
        <div>
          <span className="eyebrow">Página a página</span>
          <h2>
            {chapterPosters.length}{' '}
            {chapterPosters.length === 1 ? 'quadrinho' : 'quadrinhos da história'}
          </h2>
        </div>
        {firstPoster && (
          <Button asChild variant="outline" className="read-all-btn">
            <Link to={`/poster/${firstPoster.id}`}>
              <BookOpen /> Abrir leitor de quadrinhos
            </Link>
          </Button>
        )}
      </div>

      {chapterPosters.length ? (
        <div className="poster-grid comic-panels-grid">
          {chapterPosters.map((poster, index) => {
            const progressItem = progress.find((item) => item.poster === poster.id)
            const artwork = posterImageUrl(poster, '480x0')
            const isPosicao = poster.kind === 'posicao'

            return (
              <Link
                key={poster.id}
                to={`/poster/${poster.id}`}
                className="poster-card comic-panel-card fade-rise"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="poster-thumbnail comic-panel-thumb">
                  {artwork ? (
                    <img src={artwork} alt={`Quadro: ${poster.title}`} />
                  ) : (
                    <EmptyArtwork compact />
                  )}
                  <span className="poster-number comic-panel-number">Quadro {index + 1}</span>
                  <span className="comic-type-tag">
                    {isPosicao ? <Flame /> : <Sparkles />}
                    {isPosicao ? 'Posição' : 'História'}
                  </span>
                  {progressItem?.learned && (
                    <span className="learned-ribbon">
                      <Star /> Concluído
                    </span>
                  )}
                </div>
                <div className="poster-card-copy comic-panel-copy">
                  <div>
                    <h3>{poster.title}</h3>
                    {poster.caption ? (
                      <p className="comic-panel-caption">{poster.caption}</p>
                    ) : isKid ? (
                      <p>{poster.kid_text}</p>
                    ) : (
                      <p className="dad-teaser">
                        <span>PARA O PAI</span> {poster.dad_tip.slice(0, 72)}
                        {poster.dad_tip.length > 72 ? '…' : ''}
                      </p>
                    )}
                  </div>
                  <div className="poster-card-footer comic-panel-footer">
                    <span className="stars" aria-label={`${progressItem?.stars || 0} estrelas`}>
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          className={star <= (progressItem?.stars || 0) ? 'filled' : ''}
                        />
                      ))}
                    </span>
                    <span className="read-panel-hint">
                      Ler quadro <ChevronRight />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="construction-empty comic-card">
          <Hammer />
          <h2>Esta história ainda não tem quadrinhos 🚧</h2>
          <p>
            {isKid
              ? 'O papai está desenhando e escrevendo novas páginas para esta edição.'
              : 'Adicione os primeiros quadros desta história pelo modo Gerenciar.'}
          </p>
          {!isKid && <Link to="/gerenciar">Adicionar quadrinho</Link>}
        </div>
      )}
    </div>
  )
}
