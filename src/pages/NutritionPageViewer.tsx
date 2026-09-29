import { useState } from 'react'
import {
  Apple,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Flame,
  Heart,
  Info,
  Printer,
  Salad,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useMode } from '@/contexts/ModeContext'
import { NUTRITION_PAGES, NutritionPage } from '@/data/nutritionPages'

export default function NutritionPageViewer() {
  const { isKid } = useMode()
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [downloadedMap, setDownloadedMap] = useState<Record<number, boolean>>({})
  const [previewCard, setPreviewCard] = useState<NutritionPage | null>(null)

  const currentPage = NUTRITION_PAGES[currentPageIndex]

  const handlePrint = (page: NutritionPage) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const bulletsHtml = page.bullets
      .map(
        (b) => `
        <div style="margin-bottom: 8px; text-align: left; background: #f8fafc; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1;">
          <strong style="color: #1e3a5f;">${b.number}. ${b.title}:</strong>
          <span style="color: #334155; font-size: 11pt;"> ${b.text}</span>
        </div>
      `,
      )
      .join('')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${page.title} - Alimentação e Performance Álexis</title>
          <style>
            @page { size: portrait; margin: 12mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              color: #0f172a;
              margin: 0;
              padding: 0;
            }
            .card {
              border: 3px solid #1e3a5f;
              border-radius: 16px;
              padding: 24px;
              background: #fffdfa;
            }
            .header {
              border-bottom: 2px dashed #94a3b8;
              padding-bottom: 12px;
              margin-bottom: 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            h1 {
              margin: 0;
              font-size: 24pt;
              color: #1e3a5f;
            }
            .subtitle {
              font-size: 13pt;
              font-weight: bold;
              color: #ea580c;
              margin: 4px 0 0 0;
            }
            .badge {
              background: #fde047;
              border: 2px solid #0f172a;
              padding: 4px 10px;
              border-radius: 999px;
              font-weight: 900;
              font-size: 11pt;
            }
            .lead {
              font-size: 12pt;
              line-height: 1.5;
              color: #334155;
              margin-bottom: 16px;
              font-style: italic;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            .tip {
              margin-top: 16px;
              padding: 12px;
              background: #fef3c7;
              border: 2px solid #f59e0b;
              border-radius: 10px;
              font-size: 11pt;
              font-weight: bold;
              color: #78350f;
            }
            .footer {
              margin-top: 16px;
              text-align: center;
              font-size: 10pt;
              font-weight: bold;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div>
                <h1>🍎 ${page.title}</h1>
                <p class="subtitle">${page.subtitle}</p>
              </div>
              <div class="badge">CARD #${page.badgeNumber}</div>
            </div>
            <p class="lead">${page.lead}</p>
            <div class="grid">
              ${bulletsHtml}
            </div>
            <div class="tip">
              💡 DICA PARA OS PAIS: ${page.dadTip}
            </div>
            <div class="footer">
              Alimentação &amp; Performance · Jiu-Jitsu Infantil do Álexis · Gibi Oficial
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handleDownloadCard = (page: NutritionPage) => {
    // Baixar como arquivo de texto/sumário formatado para impressão ou estudo
    const content = `=====================================================
JIU-JITSU DO ÁLEXIS: ALIMENTAÇÃO E PERFORMANCE
TEMA: ${page.title.toUpperCase()} (Card #${page.badgeNumber})
Subtítulo: ${page.subtitle}
=====================================================

${page.lead}

PONTOS PRINCIPAIS:
${page.bullets.map((b) => `${b.number}. ${b.title}: ${b.text}`).join('\n')}

DICA PARA OS PAIS:
${page.dadTip}

MENSAGEM DE OURO:
${page.summary}
=====================================================`

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `alimentacao-${String(page.order).padStart(2, '0')}-${page.title.toLowerCase().replace(/\s+/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setDownloadedMap((prev) => ({ ...prev, [page.pageNumber]: true }))
  }

  return (
    <div className="page nutrition-page max-w-6xl mx-auto px-4 py-6">
      {/* Cabeçalho Gibi */}
      <section className="comic-cover-hero fade-rise mb-8 bg-amber-50/90 border-4 border-slate-900 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_#1e3a5f] relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <Badge className="bg-emerald-400 hover:bg-emerald-400 text-slate-950 font-black border-2 border-slate-950 text-xs px-3 py-1 uppercase tracking-wider shadow-[2px_2px_0_#1e3a5f]">
            🍎 NUTRIÇÃO &amp; ENERGIA DO TATAME
          </Badge>
          <span className="text-xs md:text-sm font-black bg-white text-slate-900 border-2 border-slate-950 px-3 py-1 rounded-full shadow-[2px_2px_0_#1e3a5f]">
            10 CARDS COMPLETOS DE ALIMENTAÇÃO
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Alimentação &amp;{' '}
              <span className="text-emerald-600 underline decoration-wavy decoration-emerald-400">
                Performance
              </span>{' '}
              🍎
            </h1>
            <p className="mt-3 text-base md:text-lg text-slate-700 font-semibold leading-relaxed">
              Guia ilustrado de alimentação saudável para os pequenos campeões do Jiu-Jitsu! Aprenda
              como comida de verdade gera ossos fortes, mais disposição e recuperação rápida.
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-3 bg-white p-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0_#1e3a5f]">
            <div className="w-14 h-14 rounded-xl bg-emerald-100 border-2 border-slate-900 flex items-center justify-center text-3xl shadow-inner">
              🥗
            </div>
            <div>
              <div className="text-xs font-black uppercase text-emerald-700">Comida de Verdade</div>
              <div className="text-sm font-bold text-slate-900">Energia que Funciona</div>
              <div className="text-xs text-slate-500 font-medium">10 páginas em quadrinho</div>
            </div>
          </div>
        </div>

        {/* Faixa decorativa */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-400 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm font-bold text-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>
              Navegue pelas páginas, baixe o resumo individual ou imprima em formato limpo!
            </span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-900 hover:text-emerald-700 transition-colors underline font-black"
          >
            ← Voltar para a capa do Gibi
          </Link>
        </div>
      </section>

      {/* Mini-seletor das 10 Páginas */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-3 scrollbar-thin">
        {NUTRITION_PAGES.map((page, idx) => {
          const isCurrent = idx === currentPageIndex
          return (
            <button
              key={page.pageNumber}
              type="button"
              onClick={() => setCurrentPageIndex(idx)}
              className={`px-3.5 py-2 rounded-2xl font-black text-xs md:text-sm whitespace-nowrap transition-all border-2 border-slate-900 flex items-center gap-1.5 cursor-pointer ${
                isCurrent
                  ? 'bg-emerald-400 text-slate-950 shadow-[3px_3px_0_#1e3a5f] -translate-y-0.5'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 shadow-[2px_2px_0_#1e3a5f]'
              }`}
            >
              <span>#{page.order}</span>
              <span>{page.title}</span>
            </button>
          )
        })}
      </div>

      {/* Cartão Ativo em Destaque */}
      <article className="comic-card bg-white border-4 border-slate-900 rounded-3xl overflow-hidden shadow-[8px_8px_0_#1e3a5f] mb-8">
        {/* Cabeçalho do Card */}
        <div className="bg-gradient-to-r from-emerald-50 via-amber-50 to-orange-50 border-b-4 border-slate-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-emerald-400 text-slate-950 font-black border-2 border-slate-950 text-xs px-2.5 py-0.5 shadow-[1px_1px_0_#1e3a5f]">
                PÁGINA {currentPage.order} DE 10
              </Badge>
              <Badge variant="outline" className="border-2 border-slate-900 font-black text-xs">
                CARD #{currentPage.badgeNumber}
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {currentPage.title}
            </h2>
            <p className="text-base md:text-lg font-bold text-emerald-800 mt-0.5">
              {currentPage.subtitle}
            </p>
          </div>

          {/* Ações de Impressão e Download */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={() => handlePrint(currentPage)}
              className="bg-white hover:bg-slate-100 text-slate-900 font-black border-2 border-slate-950 rounded-2xl py-5 px-4 shadow-[3px_3px_0_#1e3a5f] flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </Button>

            <Button
              onClick={() => handleDownloadCard(currentPage)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl py-5 px-5 border-2 border-slate-950 shadow-[3px_3px_0_#1e3a5f] flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Baixar Resumo</span>
            </Button>
          </div>
        </div>

        {/* Corpo do Card */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Lead explicativo */}
          <div className="p-4 bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl">
            <p className="text-base md:text-lg text-slate-800 font-semibold leading-relaxed">
              {currentPage.lead}
            </p>
          </div>

          {/* 6 Blocos de Informação em Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPage.bullets.map((b) => (
              <div
                key={b.number}
                className="bg-slate-50 border-3 border-slate-900 rounded-2xl p-4 flex flex-col justify-between shadow-[3px_3px_0_#1e3a5f]"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-full bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center border-2 border-slate-950 shadow-[1px_1px_0_#1e3a5f]">
                      {b.number}
                    </span>
                    <h3 className="font-black text-base text-slate-900">{b.title}</h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                    {b.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mensagem Resumo */}
          <div className="p-4 bg-amber-100/90 border-2 border-amber-400 rounded-2xl text-center shadow-inner">
            <p className="text-sm md:text-base font-black text-amber-950">
              ⭐ {currentPage.summary}
            </p>
          </div>

          {/* Dica para os pais (com controle de visibilidade no modo criança) */}
          {!isKid ? (
            <div className="p-5 bg-indigo-50 border-3 border-indigo-400 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-indigo-900 mb-1">
                <Info className="w-4 h-4 text-indigo-700" />
                <span>Dica para os Pais (Modo Pai)</span>
              </div>
              <p className="text-sm md:text-base font-bold text-indigo-950 leading-relaxed">
                {currentPage.dadTip}
              </p>
            </div>
          ) : (
            <div className="p-3 bg-slate-100 rounded-xl text-center text-xs font-bold text-slate-500">
              🔒 Dica nutricional exclusiva para os pais disponível no Modo Pai
            </div>
          )}

          {/* Botões de Navegação Anterior / Próximo */}
          <div className="pt-4 border-t-2 border-dashed border-slate-300 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className="bg-white text-slate-900 font-black border-2 border-slate-900 rounded-2xl px-4 py-5 shadow-[2px_2px_0_#1e3a5f] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Página Anterior
            </Button>

            <span className="text-xs font-bold text-slate-500">
              {currentPageIndex + 1} de {NUTRITION_PAGES.length}
            </span>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setCurrentPageIndex((prev) => Math.min(NUTRITION_PAGES.length - 1, prev + 1))
              }
              disabled={currentPageIndex === NUTRITION_PAGES.length - 1}
              className="bg-white text-slate-900 font-black border-2 border-slate-900 rounded-2xl px-4 py-5 shadow-[2px_2px_0_#1e3a5f] disabled:opacity-40"
            >
              Próxima Página <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </article>

      {/* Grid com Todos os 10 Cards para visualização rápida */}
      <section aria-labelledby="all-cards-title">
        <div className="flex items-center justify-between mb-4">
          <h2 id="all-cards-title" className="text-xl font-black text-slate-900">
            Todos os 10 Cards da Coleção
          </h2>
          <span className="text-xs font-bold text-slate-600">Clique para abrir</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {NUTRITION_PAGES.map((page, idx) => {
            const isCurrent = idx === currentPageIndex
            return (
              <button
                key={page.pageNumber}
                type="button"
                onClick={() => {
                  setCurrentPageIndex(idx)
                  window.scrollTo({ top: 320, behavior: 'smooth' })
                }}
                className={`p-3.5 rounded-2xl border-2 border-slate-900 text-left transition-all ${
                  isCurrent
                    ? 'bg-emerald-400 text-slate-950 shadow-[4px_4px_0_#1e3a5f] font-black'
                    : 'bg-white text-slate-800 hover:bg-emerald-50 shadow-[2px_2px_0_#1e3a5f]'
                }`}
              >
                <div className="text-xs font-black uppercase text-emerald-800">
                  Card #{page.badgeNumber}
                </div>
                <div className="font-black text-sm text-slate-900 mt-0.5 truncate">
                  {page.title}
                </div>
                <div className="text-xs text-slate-600 line-clamp-1 mt-1 font-semibold">
                  {page.subtitle}
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
