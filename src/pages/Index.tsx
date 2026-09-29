import { ArrowRight, BookOpen, ChevronRight, Flame, ImagePlus, Sparkles, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import { BeltCard } from '@/components/BeltCard'
import { PosterArtwork } from '@/components/PosterArtwork'
import { ProgressBar } from '@/components/ProgressBar'
import { Button } from '@/components/ui/button'
import { useLibrary } from '@/contexts/LibraryContext'
import { useMode } from '@/contexts/ModeContext'
import { progressPercentage } from '@/lib/belts'
import { chapterCoverUrl } from '@/services/chapters'

export default function Index() {
  const { chapters, posters, progress, loading } = useLibrary()
  const { isKid } = useMode()
  const learnedIds = new Set(progress.filter((item) => item.learned).map((item) => item.poster))
  const learned = learnedIds.size
  const percentage = progressPercentage(learned, posters.length)
  const nextPoster = posters.find((poster) => !learnedIds.has(poster.id)) || posters[0]
  const nextChapter = nextPoster
    ? chapters.find((chapter) => chapter.id === nextPoster.chapter)
    : undefined

  if (loading) return <LibrarySkeleton />

  return (
    <div className="page home-page comic-home-page">
      {/* Capa de Revista em Quadrinhos / Gibi */}
      <section className="comic-cover-hero fade-rise">
        <div className="comic-cover-header">
          <div className="comic-logo-badge">REVISTA OFICIAL · EDIÇÃO INFANTIL</div>
          <div className="comic-price-tag">★ GRÁTIS ★</div>
        </div>

        <div className="comic-cover-main">
          <div className="comic-cover-title-group">
            <span className="comic-masthead-sub">AS AVENTURAS NO TATAME DE</span>
            <h1 className="comic-masthead-title">
              JIU-JITSU DO <span className="highlight">ÁLEXIS</span>
            </h1>
            <p className="comic-masthead-desc">
              {isKid
                ? 'Histórias em quadrinhos divertidas onde você aprende os segredos do Jiu-Jitsu com o papai e seu amigo de treino!'
                : `Gibi pedagógico do Álexis: ${chapters.length} edições · ${posters.length} quadros/técnicas · ${learned} concluídos`}
            </p>
          </div>

          <div className="comic-burst" aria-hidden="true">
            <span>POW!</span>
            <small>NOVA EDIÇÃO</small>
          </div>
        </div>

        <div className="comic-cover-strip">
          <div className="strip-item">
            <Sparkles />
            <span>Álexis &amp; Papai Vítor</span>
          </div>
          <div className="strip-item">
            <Flame />
            <span>Amigo de treino Léo</span>
          </div>
          <div className="strip-item">
            <Star />
            <span>Aprenda as posições</span>
          </div>
        </div>
      </section>

      {/* Cartão de Continuar Leitura em Destaque */}
      {nextPoster && (
        <Link
          to={`/poster/${nextPoster.id}`}
          className="continue-card comic-continue-card fade-rise"
        >
          <div className="continue-image">
            <PosterArtwork poster={nextPoster} thumb="480x0" compact />
            <span className="comic-action-badge">Lê agora!</span>
          </div>
          <div className="continue-copy">
            <span className="continue-label">
              <Sparkles /> {isKid ? 'Continuar sua história' : 'Próximo quadro para treinar'}
            </span>
            <h2>{nextPoster.title}</h2>
            <p>{nextChapter?.title || 'História em quadrinhos'}</p>
            {nextPoster.caption && <span className="continue-caption">“{nextPoster.caption}”</span>}
            <strong>
              {isKid ? 'Abrir gibi e ler' : 'Abrir quadro'} <ArrowRight />
            </strong>
          </div>
          <div className="continue-star" aria-hidden="true">
            ★
          </div>
        </Link>
      )}

      {/* App de acompanhamento de evolução / faixa dentro do gibi */}
      {isKid && (
        <div className="comic-belt-wrapper fade-rise">
          <div className="comic-belt-header">
            <span className="comic-badge-pill">APP DENTRO DA REVISTA</span>
            <h3>Minha Evolução no Jiu-Jitsu</h3>
          </div>
          <BeltCard percentage={percentage} learned={learned} total={posters.length} />
        </div>
      )}

      {/* Lista de Histórias / Edições da Revista */}
      <section className="chapters-section comic-issues-section" aria-labelledby="issues-title">
        <div className="section-heading comic-section-heading">
          <div>
            <span className="eyebrow comic-eyebrow">Prateleira de Histórias</span>
            <h2 id="issues-title">Edições da Revista</h2>
          </div>
          <span className="chapter-count comic-count">
            <BookOpen /> {chapters.length} histórias disponíveis
          </span>
        </div>

        {chapters.length ? (
          <div className="chapters-grid comic-issues-grid">
            {chapters.map((chapter, index) => {
              const chapterPosters = posters.filter((poster) => poster.chapter === chapter.id)
              const chapterLearned = chapterPosters.filter((poster) =>
                learnedIds.has(poster.id),
              ).length
              const cover = chapterCoverUrl(chapter)
              const firstPoster = chapterPosters[0]
              const isCompleted =
                chapterPosters.length > 0 && chapterLearned === chapterPosters.length

              return (
                <Link
                  key={chapter.id}
                  to={`/capitulo/${chapter.id}`}
                  className="chapter-card comic-issue-card fade-rise"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="chapter-cover comic-issue-cover">
                    {cover ? (
                      <img src={cover} alt={`Capa de ${chapter.title}`} />
                    ) : firstPoster ? (
                      <PosterArtwork poster={firstPoster} thumb="480x0" />
                    ) : (
                      <div className="chapter-placeholder">
                        <span>{chapter.emoji || '🥋'}</span>
                        <i>Edição do gibi</i>
                      </div>
                    )}
                    <span className="chapter-badge comic-issue-number">
                      Edição #{chapter.order || index + 1}
                    </span>
                    {isCompleted && (
                      <span className="complete-badge comic-complete-badge">
                        <Star /> História Lida!
                      </span>
                    )}
                  </div>
                  <div className="chapter-card-body">
                    <div className="chapter-title-row">
                      <span className="chapter-emoji">{chapter.emoji || '🥋'}</span>
                      <h3>
                        {chapter.title
                          .replace(/^Edição \d+\s*—\s*/, '')
                          .replace(/^Capítulo \d+\s*—\s*/, '')}
                      </h3>
                      <ChevronRight />
                    </div>
                    <p>{chapter.description}</p>
                    <div className="comic-card-footer">
                      <span className="comic-panels-count">
                        {chapterPosters.length}{' '}
                        {chapterPosters.length === 1 ? 'quadrinho' : 'quadrinhos'}
                      </span>
                      <ProgressBar learned={chapterLearned} total={chapterPosters.length} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="library-empty comic-card">
            <ImagePlus />
            <h3>O gibi está esperando a primeira história!</h3>
            <p>Abra o Modo Pai para criar a primeira edição com quadros e ilustrações.</p>
            {!isKid && (
              <Button asChild>
                <Link to="/gerenciar">Ir para Gerenciar Gibi</Link>
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
    <div className="page skeleton-page" aria-label="Carregando gibi">
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
