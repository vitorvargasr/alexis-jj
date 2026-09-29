import { useState } from 'react'
import { Check, Download, Eye, Palette, Printer, Sparkles } from 'lucide-react'
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
import { COLORING_DRAWINGS, type ColoringDrawing } from '@/data/coloringPages'

export default function ColoringPagesPage() {
  const [previewDrawing, setPreviewDrawing] = useState<ColoringDrawing | null>(null)
  const [downloadedMap, setDownloadedMap] = useState<Record<string, boolean>>({})

  const handleDownload = async (drawing: ColoringDrawing) => {
    try {
      const response = await fetch(drawing.url)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = drawing.downloadName || `${drawing.id}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)

      setDownloadedMap((prev) => ({ ...prev, [drawing.id]: true }))
    } catch {
      // Fallback para link direto com atributo download
      const a = document.createElement('a')
      a.href = drawing.url
      a.download = drawing.downloadName || `${drawing.id}.png`
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setDownloadedMap((prev) => ({ ...prev, [drawing.id]: true }))
    }
  }

  const handlePrint = (drawing: ColoringDrawing) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${drawing.title} - Álexis Jiu-Jitsu</title>
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
            <h1>🎨 ${drawing.title}</h1>
            <p>Jiu-Jitsu Infantil do Álexis · Gibi Oficial</p>
          </div>
          <img src="${window.location.origin}${drawing.url}" onload="window.print();window.close();" alt="${drawing.title}" />
          <div class="footer">Desenho #${drawing.order} para colorir · Oss! 🥋</div>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="page coloring-page max-w-6xl mx-auto px-4 py-6">
      {/* Cabeçalho estilo Gibi / Quadrinho */}
      <section className="comic-cover-hero fade-rise mb-8 bg-amber-50/90 border-4 border-slate-900 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_#1e3a5f] relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <Badge className="bg-amber-400 hover:bg-amber-400 text-slate-950 font-black border-2 border-slate-950 text-xs px-3 py-1 uppercase tracking-wider shadow-[2px_2px_0_#1e3a5f]">
            🎨 ATIVIDADE DO TATAME EM CASA
          </Badge>
          <span className="text-xs md:text-sm font-black bg-white text-slate-900 border-2 border-slate-950 px-3 py-1 rounded-full shadow-[2px_2px_0_#1e3a5f]">
            10 DESENHOS OFICIAIS · DOWNLOAD GRÁTIS
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Desenhos para{' '}
              <span className="text-amber-600 underline decoration-wavy decoration-amber-400">
                Colorir
              </span>{' '}
              🎨
            </h1>
            <p className="mt-3 text-base md:text-lg text-slate-700 font-semibold leading-relaxed">
              Baixe individualmente as 10 ilustrações em alta resolução do gibi do Álexis! Imprima
              no papel para pintar com lápis de cor, giz de cera ou canetinha.
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-3 bg-white p-4 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0_#1e3a5f]">
            <div className="w-14 h-14 rounded-xl bg-amber-100 border-2 border-slate-900 flex items-center justify-center text-3xl shadow-inner">
              🥋
            </div>
            <div>
              <div className="text-xs font-black uppercase text-amber-700">Para Todos</div>
              <div className="text-sm font-bold text-slate-900">Modo Criança e Papai</div>
              <div className="text-xs text-slate-500 font-medium">Download direto sem bloqueio</div>
            </div>
          </div>
        </div>

        {/* Faixa decorativa */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-400 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm font-bold text-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Pinte o kimono, a faixa e o tatame com as cores que quiser!</span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-900 hover:text-amber-600 transition-colors underline font-black"
          >
            ← Voltar para as histórias do Gibi
          </Link>
        </div>
      </section>

      {/* Grid com os 10 Desenhos */}
      <section aria-labelledby="coloring-grid-title">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-700">
              Galeria Completa
            </span>
            <h2 id="coloring-grid-title" className="text-2xl font-black text-slate-900">
              Escolha seu Desenho Favorito
            </h2>
          </div>
          <span className="text-xs md:text-sm font-bold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full">
            10 ilustrações
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLORING_DRAWINGS.map((drawing) => {
            const isDownloaded = Boolean(downloadedMap[drawing.id])
            return (
              <article
                key={drawing.id}
                className="group comic-card bg-white border-4 border-slate-900 rounded-3xl overflow-hidden shadow-[6px_6px_0_#1e3a5f] hover:shadow-[8px_8px_0_#1e3a5f] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                {/* Imagem / Prévia com moldura */}
                <div>
                  <div className="relative bg-slate-50 border-b-4 border-slate-900 aspect-[4/3] flex items-center justify-center p-4 overflow-hidden">
                    <img
                      src={drawing.url}
                      alt={drawing.title}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain filter contrast-105 group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Número do desenho em badge de quadrinho */}
                    <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full border-2 border-slate-950 shadow-[2px_2px_0_#1e3a5f]">
                      #{drawing.order}
                    </span>

                    {/* Botão de zoom / visualização rápida */}
                    <button
                      type="button"
                      onClick={() => setPreviewDrawing(drawing)}
                      aria-label={`Ver desenho ${drawing.title} em tamanho grande`}
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

                  {/* Informações */}
                  <div className="p-4 md:p-5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                      {drawing.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 font-medium mt-1.5 leading-relaxed line-clamp-2">
                      {drawing.description}
                    </p>
                  </div>
                </div>

                {/* Ações: Download direto + Imprimir */}
                <div className="p-4 md:p-5 pt-0 flex items-center gap-2">
                  <Button
                    onClick={() => handleDownload(drawing)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-2xl py-5 border-2 border-slate-950 shadow-[3px_3px_0_#1e3a5f] hover:shadow-[4px_4px_0_#1e3a5f] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Baixar ⬇️</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handlePrint(drawing)}
                    title="Imprimir direto na impressora"
                    aria-label={`Imprimir ${drawing.title}`}
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
      <Dialog
        open={Boolean(previewDrawing)}
        onOpenChange={(open) => !open && setPreviewDrawing(null)}
      >
        <DialogContent className="max-w-3xl bg-amber-50/95 border-4 border-slate-900 rounded-3xl p-6 shadow-[10px_10px_0_#1e3a5f]">
          {previewDrawing && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-700">
                  <Palette className="w-4 h-4" />
                  <span>Desenho #{previewDrawing.order} · Pronto para pintar</span>
                </div>
                <DialogTitle className="text-2xl font-black text-slate-900">
                  {previewDrawing.title}
                </DialogTitle>
                <DialogDescription className="text-sm font-semibold text-slate-600">
                  {previewDrawing.description}
                </DialogDescription>
              </DialogHeader>

              <div className="my-4 bg-white border-3 border-slate-900 rounded-2xl p-4 flex items-center justify-center max-h-[60vh] overflow-hidden shadow-inner">
                <img
                  src={previewDrawing.url}
                  alt={previewDrawing.title}
                  className="max-h-[55vh] max-w-full object-contain filter contrast-105"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handlePrint(previewDrawing)}
                  className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 font-black border-2 border-slate-950 rounded-2xl py-5 px-5 shadow-[3px_3px_0_#1e3a5f] flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Agora</span>
                </Button>

                <Button
                  onClick={() => handleDownload(previewDrawing)}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base rounded-2xl py-5 px-6 border-2 border-slate-950 shadow-[4px_4px_0_#1e3a5f] flex items-center gap-2"
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
