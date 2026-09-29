import { useState } from 'react'
import { Check, Download, Eye, Heart, Printer, Shield, ShieldAlert, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useMode } from '@/contexts/ModeContext'
import { INJURY_PREVENTION_CARDS, InjuryPreventionCard } from '@/data/injuryPrevention'

export default function InjuryPreventionPage() {
  const { isKid } = useMode()
  const [previewCard, setPreviewCard] = useState<InjuryPreventionCard | null>(null)
  const [downloadedMap, setDownloadedMap] = useState<Record<string, boolean>>({})

  const handleDownload = async (card: InjuryPreventionCard) => {
    try {
      const response = await fetch(card.url)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = card.downloadName || `${card.id}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)

      setDownloadedMap((prev) => ({ ...prev, [card.id]: true }))
    } catch {
      const a = document.createElement('a')
      a.href = card.url
      a.download = card.downloadName || `${card.id}.png`
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setDownloadedMap((prev) => ({ ...prev, [card.id]: true }))
    }
  }

  const handlePrint = (card: InjuryPreventionCard) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${card.title} - Lesão Zero Álexis Jiu-Jitsu</title>
          <style>
            @page { size: portrait; margin: 10mm; }
            body {
              margin: 0;
              font-family: sans-serif;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 98vh;
            }
            .header {
              margin-bottom: 12px;
            }
            h1 {
              font-size: 20pt;
              margin: 0;
              color: #1e3a5f;
            }
            p {
              margin: 4px 0 12px;
              font-size: 11pt;
              color: #475569;
            }
            img {
              max-width: 90vw;
              max-height: 80vh;
              object-fit: contain;
              border: 3px solid #1e3a5f;
              border-radius: 12px;
            }
            .footer {
              margin-top: 10px;
              font-size: 10pt;
              font-weight: bold;
              color: #1e3a5f;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🛡️ ${card.title}</h1>
            <p>Jiu-Jitsu Infantil do Álexis · Lesão Zero &amp; Fortalecimento</p>
          </div>
          <img src="${window.location.origin}${card.url}" onload="window.print();window.close();" alt="${card.title}" />
          <div class="footer">Prancha #${card.order} · Oss! 🥋</div>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="page injury-prevention-page max-w-6xl mx-auto px-4 py-6">
      {/* Cabeçalho Gibi */}
      <section className="comic-cover-hero fade-rise mb-8 bg-sky-50/90 border-4 border-slate-900 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_#1e3a5f] relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <Badge className="bg-sky-400 hover:bg-sky-400 text-slate-950 font-black border-2 border-slate-950 text-xs px-3 py-1 uppercase tracking-wider shadow-[2px_2px_0_#1e3a5f]">
            🛡️ SAÚDE &amp; PREVENÇÃO NO TATAME
          </Badge>
          <span className="text-xs md:text-sm font-black bg-white text-slate-900 border-2 border-slate-950 px-3 py-1 rounded-full shadow-[2px_2px_0_#1e3a5f]">
            9 PRANCHAS ILUSTRADAS · EXTRAÍDAS EM ALTA QUALIDADE
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Lesão Zero &amp;{' '}
              <span className="text-sky-600 underline decoration-wavy decoration-sky-400">
                Fortalecimento
              </span>{' '}
              🛡️
            </h1>
            <p className="mt-3 text-base md:text-lg text-slate-700 font-semibold leading-relaxed">
              Guia completo de postura, aquecimento específico, estabilidade do core, proteção de
              pescoço e fortalecimento seguro para os pequenos praticantes de Jiu-Jitsu.
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-3 bg-white p-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0_#1e3a5f]">
            <div className="w-14 h-14 rounded-xl bg-sky-100 border-2 border-slate-900 flex items-center justify-center text-3xl shadow-inner">
              🥋
            </div>
            <div>
              <div className="text-xs font-black uppercase text-sky-700">Proteção Total</div>
              <div className="text-sm font-bold text-slate-900">Treinar Sempre Bem</div>
              <div className="text-xs text-slate-500 font-medium">9 pranchas técnicas</div>
            </div>
          </div>
        </div>

        {/* Faixa decorativa */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-400 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm font-bold text-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>
              Veja cada prancha em tamanho gigante, baixe ou imprima para consultar em casa!
            </span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-900 hover:text-sky-600 transition-colors underline font-black"
          >
            ← Voltar para a capa do Gibi
          </Link>
        </div>
      </section>

      {/* Regra de ouro da segurança */}
      <div className="mb-8 p-4 bg-amber-100/90 border-3 border-amber-400 rounded-2xl flex items-start gap-3 shadow-[4px_4px_0_#1e3a5f]">
        <ShieldAlert className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
        <div className="text-xs md:text-sm text-amber-950 font-bold leading-relaxed">
          <strong className="text-amber-900 uppercase tracking-wide mr-1">Princípio Maior:</strong>
          Jiu-Jitsu infantil é inteligência, técnica e respeito. Ao menor desconforto ou dor, pare
          imediatamente e avise o professor ou o papai. Bater com antecedência (tap) é a marca dos
          verdadeiros campeões!
        </div>
      </div>

      {/* Grid com os 9 Cards */}
      <section aria-labelledby="cards-grid-title">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-sky-700">
              Galeria de Fortalecimento
            </span>
            <h2 id="cards-grid-title" className="text-2xl font-black text-slate-900">
              Pranchas de Treino Seguro
            </h2>
          </div>
          <span className="text-xs md:text-sm font-bold bg-sky-100 text-sky-900 border border-sky-300 px-3 py-1 rounded-full">
            9 Pranchas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INJURY_PREVENTION_CARDS.map((card) => {
            const isDownloaded = Boolean(downloadedMap[card.id])
            return (
              <article
                key={card.id}
                className="group comic-card bg-white border-4 border-slate-900 rounded-3xl overflow-hidden shadow-[6px_6px_0_#1e3a5f] hover:shadow-[8px_8px_0_#1e3a5f] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="relative bg-slate-50 border-b-4 border-slate-900 aspect-[4/3] flex items-center justify-center p-4 overflow-hidden">
                    <img
                      src={card.url}
                      alt={card.title}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Número do card */}
                    <span className="absolute top-3 left-3 bg-sky-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full border-2 border-slate-950 shadow-[2px_2px_0_#1e3a5f]">
                      #{card.order}
                    </span>

                    {/* Tag temática */}
                    <span className="absolute top-3 right-12 bg-white/95 text-slate-800 font-black text-[11px] px-2.5 py-0.5 rounded-full border-2 border-slate-950 shadow-[1px_1px_0_#1e3a5f]">
                      {card.badgeEmoji} {card.tag}
                    </span>

                    {/* Botão de zoom */}
                    <button
                      type="button"
                      onClick={() => setPreviewCard(card)}
                      aria-label={`Ver prancha ${card.title} em tamanho grande`}
                      className="absolute top-3 right-3 bg-white/95 hover:bg-white text-slate-900 p-2 rounded-full border-2 border-slate-950 shadow-[2px_2px_0_#1e3a5f] transition-all hover:scale-110"
                      title="Ver em tamanho grande"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {isDownloaded && (
                      <span className="absolute bottom-3 left-3 bg-emerald-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full border-2 border-slate-950 flex items-center gap-1 shadow-[2px_2px_0_#1e3a5f]">
                        <Check className="w-3.5 h-3.5" /> Baixado!
                      </span>
                    )}
                  </div>

                  <div className="p-4 md:p-5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 font-medium mt-1.5 leading-relaxed line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="p-4 md:p-5 pt-0 flex items-center gap-2">
                  <Button
                    onClick={() => handleDownload(card)}
                    className="flex-1 bg-sky-400 hover:bg-sky-500 text-slate-950 font-black text-sm rounded-2xl py-5 border-2 border-slate-950 shadow-[3px_3px_0_#1e3a5f] hover:shadow-[4px_4px_0_#1e3a5f] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Baixar ⬇️</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handlePrint(card)}
                    title="Imprimir direto na impressora"
                    aria-label={`Imprimir ${card.title}`}
                    className="bg-white hover:bg-slate-100 text-slate-900 font-black border-2 border-slate-950 rounded-2xl py-5 px-3 shadow-[3px_3px_0_#1e3a5f] cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Modal de Prévia Ampliada */}
      <Dialog open={Boolean(previewCard)} onOpenChange={(open) => !open && setPreviewCard(null)}>
        <DialogContent className="max-w-3xl bg-sky-50/95 border-4 border-slate-900 rounded-3xl p-6 shadow-[10px_10px_0_#1e3a5f]">
          {previewCard && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs font-black uppercase text-sky-800">
                  <Shield className="w-4 h-4" />
                  <span>
                    Prancha #{previewCard.order} · {previewCard.tag}
                  </span>
                </div>
                <DialogTitle className="text-2xl font-black text-slate-900">
                  {previewCard.title}
                </DialogTitle>
                <DialogDescription className="text-sm font-semibold text-slate-600">
                  {previewCard.description}
                </DialogDescription>
              </DialogHeader>

              <div className="my-4 bg-white border-3 border-slate-900 rounded-2xl p-4 flex items-center justify-center max-h-[60vh] overflow-hidden shadow-inner">
                <img
                  src={previewCard.url}
                  alt={previewCard.title}
                  className="max-h-[55vh] max-w-full object-contain"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handlePrint(previewCard)}
                  className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 font-black border-2 border-slate-950 rounded-2xl py-5 px-5 shadow-[3px_3px_0_#1e3a5f] flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Agora</span>
                </Button>

                <Button
                  onClick={() => handleDownload(previewCard)}
                  className="w-full sm:w-auto bg-sky-400 hover:bg-sky-500 text-slate-950 font-black text-base rounded-2xl py-5 px-6 border-2 border-slate-950 shadow-[4px_4px_0_#1e3a5f] flex items-center gap-2"
                >
                  <Download className="w-5 h-5 stroke-[2.5]" />
                  <span>Baixar Arquivo Original (PNG)</span>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
