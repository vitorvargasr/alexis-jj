import {
  Apple,
  ArrowRight,
  Award,
  BookOpen,
  ChevronRight,
  Download,
  Flame,
  Home,
  ImagePlus,
  Palette,
  Shield,
  Sparkles,
  Star,
  Trophy,
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
            to="/treino-em-casa"
            className="strip-item hover:underline font-black text-amber-900 bg-amber-200/90 px-3 py-1 rounded-full border border-amber-400"
          >
            <Home className="w-4 h-4 text-amber-700" />
            <span>Treino em Casa 30 Dias 🏠</span>
          </Link>
          <Link
            to="/colorir"
            className="strip-item hover:underline font-black text-orange-900 bg-orange-100/90 px-3 py-1 rounded-full border border-orange-300"
          >
            <Palette className="w-4 h-4 text-orange-600" />
            <span>Colorir 🎨</span>
          </Link>
          <Link
            to="/campeonato"
            className="strip-item hover:underline font-black text-amber-950 bg-amber-300/90 px-3 py-1 rounded-full border border-amber-500 shadow-sm"
          >
            <Trophy className="w-4 h-4 text-amber-800" />
            <span>Campeonato 🏆</span>
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
                to="/campeonato"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-200 text-amber-950 border-2 border-amber-500 font-extrabold text-sm shadow-sm hover:bg-amber-300 transition-all hover:scale-105"
              >
                <span>🏆 Campeonato (20)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/colorir"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 text-orange-950 border-2 border-orange-400 font-extrabold text-sm shadow-sm hover:bg-orange-200 transition-all hover:scale-105"
              >
                <span>🎨 Colorir</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/conquistas"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 border-2 border-amber-400 font-extrabold text-sm shadow-sm hover:bg-amber-200 transition-all hover:scale-105"
              >
                <span>🏆 Conquistas</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <BeltCard
              percentage={percentage}
              learned={learned}
              total={posters.length}
              belt={currentBelt}
            />

            {/* Card Treino em Casa 30 Dias */}
            <div className="comic-card bg-amber-50/90 border-4 border-amber-400 rounded-3xl p-5 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full">
                    Programa Oficial · 30 Dias
                  </span>
                  <span className="text-2xl">🏠 ⏱️</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Treino em Casa (Drills Kids)
                </h3>
                <p className="text-sm text-slate-700 mt-1 font-medium leading-snug">
                  18 a 22 minutos diários com aquecimento, 3 exercícios, jogo final e desafios por
                  semana!
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-950 bg-white/80 p-2 rounded-xl border border-amber-300">
                  <span>⭐ Regra de ouro: segurança e consistência</span>
                </div>
              </div>
              <div className="mt-4 pt-2">
                <Button
                  asChild
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base shadow-md rounded-2xl py-5 border-2 border-slate-900"
                >
                  <Link to="/treino-em-casa">Iniciar Treino em Casa 🏠</Link>
                </Button>
              </div>
            </div>

            {/* Card Desenhos para Colorir */}
            <div className="comic-card bg-orange-50/90 border-4 border-orange-300 rounded-3xl p-5 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-orange-900 bg-orange-200/80 px-2.5 py-0.5 rounded-full">
                    10 Ilustrações
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
                  <span>⬇️ Download e impressão individual</span>
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

            {/* Card Alimentação & Performance */}
            <div className="comic-card bg-emerald-50/90 border-4 border-emerald-300 rounded-3xl p-5 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-200 px-2.5 py-0.5 rounded-full">
                    Novo Extra · 10 Cards
                  </span>
                  <span className="text-2xl">🍎 🥗</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Alimentação &amp; Performance
                </h3>
                <p className="text-sm text-slate-700 mt-1 font-medium leading-snug">
                  Minerais, carboidratos, pré-treino leve, água e energia de verdade para os
                  pequenos atletas.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-900 bg-white/80 p-2 rounded-xl border border-emerald-200">
                  <span>📄 Navegação por página e impressão limpa</span>
                </div>
              </div>
              <div className="mt-4 pt-2">
                <Button
                  asChild
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-md rounded-2xl py-5"
                >
                  <Link to="/alimentacao">Ver Guia Alimentação 🍎</Link>
                </Button>
              </div>
            </div>

            {/* Card Lesão Zero & Fortalecimento */}
            <div className="comic-card bg-sky-50/90 border-4 border-sky-300 rounded-3xl p-5 flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-sky-900 bg-sky-200 px-2.5 py-0.5 rounded-full">
                    Extra · 9 Pranchas
                  </span>
                  <span className="text-2xl">🛡️ 🥋</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Lesão Zero &amp; Fortalecimento
                </h3>
                <p className="text-sm text-slate-700 mt-1 font-medium leading-snug">
                  Pranchas ilustradas de aquecimento articular, core, cervical protegida e segurança
                  no tatame.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-sky-900 bg-white/80 p-2 rounded-xl border border-sky-200">
                  <span>⬇️ 9 imagens oficiais para baixar</span>
                </div>
              </div>
              <div className="mt-4 pt-2">
                <Button
                  asChild
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black text-base shadow-md rounded-2xl py-5"
                >
                  <Link to="/lesao-zero">Abrir Lesão Zero 🛡️</Link>
                </Button>
              </div>
            </div>

            {/* Card Preparação para o Campeonato */}
            <div className="comic-card bg-gradient-to-br from-amber-50 to-yellow-50 border-4 border-amber-500 rounded-3xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="absolute -right-3 -top-3 w-16 h-16 bg-amber-300/40 rounded-full blur-md" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-950 bg-amber-400 px-2.5 py-0.5 rounded-full shadow-sm">
                    NOVO EXTRA · 20 PRANCHAS
                  </span>
                  <span className="text-2xl">🏆 🥇</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Preparação para o Campeonato
                </h3>
                <p className="text-sm text-slate-700 mt-1 font-medium leading-snug">
                  Manual ilustrado completo: 30 dias antes, semana final, regras de pontos,
                  aquecimento e apoio da família!
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-950 bg-white/90 p-2 rounded-xl border border-amber-300">
                  <span>✨ 20 pranchas em alta resolução para ver e baixar</span>
                </div>
              </div>
              <div className="mt-4 pt-2">
                <Button
                  asChild
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base shadow-md rounded-2xl py-5 border-2 border-slate-900"
                >
                  <Link to="/campeonato">Abrir Campeonato 🏆</Link>
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

      {/* Seção no Modo Pai para acesso rápido aos Novos Recursos */}
      {!isKid && (
        <div className="comic-belt-wrapper fade-rise bg-amber-50/70 border-amber-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="comic-badge-pill bg-amber-500 text-slate-950 font-black">
                  EXTRAS DO GIBI
                </span>
                <h3 className="text-xl font-black text-slate-900 m-0">
                  Campeonato, Treino em Casa, Alimentação &amp; Lesão Zero
                </h3>
              </div>
              <p className="text-sm text-slate-700 m-0 font-medium">
                Acesse o manual ilustrado de Preparação para o Campeonato (20 pranchas com guia
                completo para pais e atletas), além dos Drills em Casa, Guia de Nutrição e
                Fortalecimento.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                asChild
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl px-4 py-5 border-2 border-slate-900 shadow-[3px_3px_0_#1e3a5f]"
              >
                <Link to="/campeonato">
                  <Trophy className="w-4 h-4 mr-1.5" /> Campeonato 🏆
                </Link>
              </Button>
              <Button
                asChild
                className="bg-amber-100 hover:bg-amber-200 text-slate-950 font-black rounded-2xl px-4 py-5 border-2 border-slate-900"
              >
                <Link to="/treino-em-casa">
                  <Home className="w-4 h-4 mr-1.5" /> Treino em Casa 🏠
                </Link>
              </Button>
              <Button
                asChild
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl px-4 py-5"
              >
                <Link to="/alimentacao">
                  <Apple className="w-4 h-4 mr-1.5" /> Alimentação 🍎
                </Link>
              </Button>
              <Button
                asChild
                className="bg-sky-500 hover:bg-sky-600 text-white font-black rounded-2xl px-4 py-5"
              >
                <Link to="/lesao-zero">
                  <Shield className="w-4 h-4 mr-1.5" /> Lesão Zero 🛡️
                </Link>
              </Button>
            </div>
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
