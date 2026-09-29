import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Download,
  Flame,
  ImagePlus,
  Palette,
  Sparkles,
  Star,
} from 'lucide-react'
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
  const { chapters, posters, progress, loading, currentBelt, beltAchievements } = useLibrary()
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
          <Link
            to="/colorir"
            className="strip-item hover:underline ml-auto font-black text-amber-700 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300"
          >
            <Palette className="w-4 h-4 text-amber-600" />
            <span>10 Desenhos para Colorir 🎨</span>
          </Link>
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
          <div className="comic-belt-header flex items-center justify-between">
            <div>
              <span className="comic-badge-pill">APP DENTRO DA REVISTA</span>
              <h3>Minha Evolução &amp; Atividades do Tatame</h3>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/colorir"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 text-orange-950 border-2 border-orange-400 font-extrabold text-sm shadow-sm hover:bg-orange-200 transition-all hover:scale-105"
              >
                <span>🎨 Colorir (10)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/conquistas"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 border-2 border-amber-400 font-extrabold text-sm shadow-sm hover:bg-amber-200 transition-all hover:scale-105"
              >
                <span>🏆 Minhas Conquistas</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BeltCard
              percentage={percentage}
              learned={learned}
              total={posters.length}
              belt={currentBelt}
            />

            {/* Card Desenhos para Colorir */}
            <div className="comic-card bg-orange-50/90 border-4 border-orange-300 rounded-3xl p-5 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-orange-900 bg-orange-200/80 px-2.5 py-0.5 rounded-full">
                    Novo · 10 Ilustrações
                  </span>
                  <span className="text-2xl">🎨 🖍️</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  Desenhos para Colorir
                </h3>
                <p className="text-sm text-slate-600 mt-1 font-medium leading-snug">
                  10 desenhos originais em alta resolução do gibi para imprimir e pintar como você
                  quiser no tatame de casa!
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/70 p-2 rounded-xl border border-orange-200">
                  <span>⬇️ Download individual e grátis</span>
                </div>
              </div>
              <div className="mt-4 pt-2">
                <Button
                  asChild
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-base shadow-md rounded-2xl py-5"
                >
                  <Link to="/colorir">Abrir Desenhos 🎨</Link>
                </Button>
              </div>
            </div>

            {/* Card de Acesso Rápido para Recompensas */}
            <div className="comic-card bg-amber-50/90 border-4 border-amber-300 rounded-3xl p-5 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                    Área Especial
                  </span>
                  <span className="text-2xl">🥋 ⭐</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  Minhas Conquistas &amp; Rotina
                </h3>
                <p className="text-sm text-slate-600 mt-1 font-medium leading-snug">
                  Veja sua <strong>Graduação de Casa</strong> com as 7 faixas, marque sua{' '}
                  <strong>Semana de Treino</strong> e desbloqueie o{' '}
                  <strong>Certificado do Lutador Corajoso</strong>!
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/70 p-2 rounded-xl border border-amber-200">
                  <span>🏅 {beltAchievements.length} de 7 faixas conquistadas</span>
                </div>
              </div>
              <div className="mt-4 pt-2">
                <Button
                  asChild
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-base shadow-md rounded-2xl py-5"
                >
                  <Link to="/conquistas">Abrir Minhas Conquistas 🏆</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seção no Modo Pai para acesso rápido aos Desenhos */}
      {!isKid && (
        <div className="comic-belt-wrapper fade-rise bg-orange-50/60 border-orange-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="comic-badge-pill bg-orange-500">NOVA ÁREA</span>
                <h3 className="text-xl font-black text-slate-900 m-0">
                  Desenhos para Colorir (10 Páginas)
                </h3>
              </div>
              <p className="text-sm text-slate-600 m-0 font-medium">
                Baixe e imprima as 10 páginas para o Álexis pintar em casa com lápis de cor ou giz
                de cera.
              </p>
            </div>
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl px-6 py-5"
            >
              <Link to="/colorir">
                <Download className="w-4 h-4 mr-1.5" /> Ver e Baixar Desenhos 🎨
              </Link>
            </Button>
          </div>
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
