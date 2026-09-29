import { ArrowRight, BookOpen, ChevronRight, ImagePlus, Sparkles, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import { BeltCard } from '@/components/BeltCard'
import { EmptyArtwork } from '@/components/EmptyArtwork'
import { ProgressBar } from '@/components/ProgressBar'
import { Button } from '@/components/ui/button'
import { useLibrary } from '@/contexts/LibraryContext'
import { useMode } from '@/contexts/ModeContext'
import { progressPercentage } from '@/lib/belts'
import { chapterCoverUrl } from '@/services/chapters'
import { posterImageUrl } from '@/services/posters'

export default function Index() {
  const { chapters, posters, progress, loading } = useLibrary()
  const { isKid } = useMode()
  const learnedIds = new Set(progress.filter((item) => item.learned).map((item) => item.poster))
  const learned = learnedIds.size
  const percentage = progressPercentage(learned, posters.length)
  const nextPoster = posters.find((poster) => !learnedIds.has(poster.id))
  const nextChapter = nextPoster
    ? chapters.find((chapter) => chapter.id === nextPoster.chapter)
    : undefined

  if (loading) return <LibrarySkeleton />

  return (
    <div className="page home-page">
      <section className="home-hero fade-rise">
        <div>
          <span className="eyebrow">{isKid ? 'Seu tatame de aventuras' : 'Visão da família'}</span>
          <h1>
            {isKid ? (
              <>
                Oi, Álexis! <span className="wave">👋</span>
              </>
            ) : (
              'Biblioteca do Álexis'
            )}
          </h1>
          <p>
            {isKid
              ? 'O que vamos treinar hoje?'
              : `${posters.length} pôsteres · ${chapters.length} capítulos · ${learned} aprendidos`}
          </p>
        </div>
        <div className="hero-doodle" aria-hidden="true">
          <span>⭐</span>
          <span>🥋</span>
          <span>✦</span>
        </div>
      </section>

      {nextPoster && (
        <Link to={`/poster/${nextPoster.id}`} className="continue-card fade-rise">
          <div className="continue-image">
            {posterImageUrl(nextPoster, '480x0') ? (
              <img src={posterImageUrl(nextPoster, '480x0')} alt="" />
            ) : (
              <EmptyArtwork compact />
            )}
          </div>
          <div className="continue-copy">
            <span className="continue-label">
              <Sparkles /> {isKid ? 'Continuar de onde parou' : 'Próximo pôster para ensinar'}
            </span>
            <h2>{nextPoster.title}</h2>
            <p>{nextChapter?.title}</p>
            <strong>
              {isKid ? 'Vamos treinar!' : 'Abrir pôster'} <ArrowRight />
            </strong>
          </div>
          <div className="continue-star" aria-hidden="true">
            ★
          </div>
        </Link>
      )}

      {isKid && <BeltCard percentage={percentage} learned={learned} total={posters.length} />}

      <section className="chapters-section" aria-labelledby="chapters-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Biblioteca ilustrada</span>
            <h2 id="chapters-title">Capítulos</h2>
          </div>
          <span className="chapter-count">
            <BookOpen /> {chapters.length} capítulos
          </span>
        </div>

        {chapters.length ? (
          <div className="chapters-grid">
            {chapters.map((chapter, index) => {
              const chapterPosters = posters.filter((poster) => poster.chapter === chapter.id)
              const chapterLearned = chapterPosters.filter((poster) =>
                learnedIds.has(poster.id),
              ).length
              const cover = chapterCoverUrl(chapter)
              const firstArtwork = chapterPosters
                .map((poster) => posterImageUrl(poster, '480x0'))
                .find(Boolean)
              return (
                <Link
                  key={chapter.id}
                  to={`/capitulo/${chapter.id}`}
                  className="chapter-card fade-rise"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="chapter-cover">
                    {cover || firstArtwork ? (
                      <img src={cover || firstArtwork} alt={`Capa de ${chapter.title}`} />
                    ) : (
                      <div className="chapter-placeholder">
                        <span>{chapter.emoji || '🥋'}</span>
                        <i>Em construção</i>
                      </div>
                    )}
                    <span className="chapter-badge">Capítulo {index + 1}</span>
                    {chapterPosters.length > 0 && chapterLearned === chapterPosters.length && (
                      <span className="complete-badge">
                        <Star /> Completo!
                      </span>
                    )}
                  </div>
                  <div className="chapter-card-body">
                    <div className="chapter-title-row">
                      <span className="chapter-emoji">{chapter.emoji || '🥋'}</span>
                      <h3>{chapter.title.replace(/^Capítulo \d+\s*—\s*/, '')}</h3>
                      <ChevronRight />
                    </div>
                    <p>{chapter.description}</p>
                    <ProgressBar learned={chapterLearned} total={chapterPosters.length} />
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="library-empty comic-card">
            <ImagePlus />
            <h3>A biblioteca está pronta para a primeira aventura!</h3>
            <p>Abra o Modo Pai e adicione o primeiro capítulo com uma ilustração.</p>
            {!isKid && (
              <Button asChild>
                <Link to="/gerenciar">Ir para Gerenciar</Link>
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

function LibrarySkeleton() {
  return (
    <div className="page skeleton-page" aria-label="Carregando biblioteca">
      <div className="skeleton hero-skeleton" />
      <div className="skeleton continue-skeleton" />
      <div className="skeleton-grid">
        <div className="skeleton card-skeleton" />
        <div className="skeleton card-skeleton" />
        <div className="skeleton card-skeleton" />
      </div>
    </div>
  )
}
