import { useRef } from 'react'
import { Trophy, Printer, Lock, Sparkles, CheckCircle2 } from 'lucide-react'
import { useLibrary } from '@/contexts/LibraryContext'
import { HOME_BELTS } from '@/lib/belts'
import { Button } from '@/components/ui/button'

export function CourageCertificate() {
  const { isCertificateUnlocked, totalPanels, learnedPanels, beltAchievements } = useLibrary()
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const currentDateFormatted = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  // Conjunto de faixas já conquistadas
  const achievedSet = new Set(beltAchievements.map((b) => b.belt_order))

  return (
    <div className="space-y-4">
      {/* Botões de Ação e Status */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border-2 border-[#2D3748] shadow-sm print:hidden">
        <div>
          <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
            {isCertificateUnlocked ? 'Desbloqueado! 🏆' : 'Em Andamento 🔒'}
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
            Progresso das Histórias: {learnedPanels} de {totalPanels} quadros concluídos
          </p>
        </div>

        {isCertificateUnlocked ? (
          <Button
            onClick={handlePrint}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl border-2 border-[#2D3748] shadow-[0_2px_0_#2D3748] gap-2"
          >
            <Printer className="w-4 h-4" /> Imprimir / Salvar PDF
          </Button>
        ) : (
          <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300">
            <Lock className="w-4 h-4 text-slate-400" />
            Complete todas as histórias do gibi para liberar a impressão!
          </div>
        )}
      </div>

      {/* ÁREA DO CERTIFICADO COM ESTILO IDÊNTICO À REFERÊNCIA */}
      <div className="relative">
        {/* Banner de Bloqueio se não completou todas as histórias */}
        {!isCertificateUnlocked && (
          <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-slate-900/30 rounded-3xl flex flex-col items-center justify-center p-6 text-center print:hidden">
            <div className="bg-[#FFFDF7] border-4 border-[#2D3748] rounded-3xl p-6 max-w-md shadow-2xl space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 border-3 border-amber-500 flex items-center justify-center text-amber-600">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase">Certificado Bloqueado</h3>
              <p className="text-sm font-semibold text-slate-700">
                Complete todas as histórias e técnicas do gibi clicando em{' '}
                <strong>“Consegui! ⭐”</strong> para ganhar seu diploma oficial de Lutador Corajoso!
              </p>
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-300 text-xs font-bold text-amber-900">
                Faltam apenas {Math.max(0, totalPanels - learnedPanels)} quadrinhos para o Álexis
                conquistar!
              </div>
            </div>
          </div>
        )}

        {/* ESTRUTURA DO CERTIFICADO IMPRESSO */}
        <div
          ref={printRef}
          id="printable-certificate"
          className="certificate-container bg-[#FFFDF0] border-8 border-[#D4AF37] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(#F5E6B3 0.8px, transparent 0.8px), radial-gradient(#F5E6B3 0.8px, #FFFDF0 0.8px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        >
          {/* Moldura ornamental interna */}
          <div className="absolute inset-2 sm:inset-3 border-2 border-[#D4AF37] rounded-2xl pointer-events-none" />
          <div className="absolute inset-3 sm:inset-4 border border-dashed border-[#D4AF37] rounded-2xl pointer-events-none" />

          {/* Estrelas dos cantos */}
          <span className="absolute top-5 left-5 text-[#D4AF37] text-2xl font-black">★</span>
          <span className="absolute top-5 right-5 text-[#D4AF37] text-2xl font-black">★</span>
          <span className="absolute bottom-5 left-5 text-[#D4AF37] text-2xl font-black">★</span>
          <span className="absolute bottom-5 right-5 text-[#D4AF37] text-2xl font-black">★</span>

          <div className="relative z-10 text-center space-y-4 max-w-2xl mx-auto">
            {/* Troféu dourado no topo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100 border-3 border-[#D4AF37] flex items-center justify-center text-[#B45309] shadow-md">
                <Trophy className="w-9 h-9 sm:w-12 sm:h-12" />
              </div>
            </div>

            {/* Cabeçalho do Certificado */}
            <div>
              <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#B45309]">
                ★ CERTIFICADO DO ★
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-[#5C4300] tracking-tight uppercase drop-shadow-[0_2px_0_#FDE68A] mt-1">
                LUTADOR CORAJOSO
              </h1>
              <div className="inline-block bg-[#FDF2B5] text-[#78350F] font-black text-xs sm:text-sm uppercase tracking-wider px-4 py-1 rounded-full border border-[#D4AF37] mt-2 shadow-xs">
                Primeiras conquistas no Jiu-Jitsu
              </div>
            </div>

            {/* Ilustração central: Faixa com nós e louros */}
            <div className="py-2 flex items-center justify-center gap-4">
              <div className="hidden sm:block text-center text-[10px] font-black text-[#78350F] max-w-[90px] leading-tight">
                DISCIPLINA HOJE, GRANDES CONQUISTAS AMANHÃ!
              </div>

              {/* Faixa branca estilizada */}
              <div className="relative bg-white border-3 border-[#2D3748] rounded-xl px-8 py-3 shadow-md flex items-center justify-center">
                <span className="w-4 h-10 bg-slate-100 border border-slate-700 rounded-sm absolute left-1/2 -translate-x-1/2 shadow-xs" />
                <span className="font-black text-sm uppercase text-[#1E3A5F] tracking-widest relative z-10">
                  FAIXA BRANCA
                </span>
                <span className="absolute -top-3 -right-3 text-amber-500 text-lg">✨</span>
                <span className="absolute -bottom-3 -left-3 text-amber-500 text-lg">✨</span>
              </div>

              <div className="hidden sm:block text-center text-[10px] font-black text-[#78350F] max-w-[90px] leading-tight">
                PEQUENOS PASSOS, GRANDES LUTADORES! ❤️
              </div>
            </div>

            {/* Nome do aluno */}
            <div className="pt-2">
              <p className="text-xs uppercase font-extrabold tracking-wider text-[#78350F] mb-1">
                Este certificado é entregue a:
              </p>
              <div className="bg-[#FFF8DE] border-b-3 border-[#78350F] py-2 px-6 rounded-t-xl mx-auto max-w-lg">
                <span className="text-2xl sm:text-3xl font-black text-[#1E3A5F] uppercase tracking-wide">
                  Álexis
                </span>
              </div>
            </div>

            {/* Texto de reconhecimento oficial */}
            <p className="text-xs sm:text-sm font-medium text-[#451A03] leading-relaxed max-w-xl mx-auto px-2">
              Por sua coragem, disciplina, respeito e dedicação no tapete, celebramos cada passo da
              sua evolução. Que este certificado lembre que um verdadeiro lutador cresce com
              esforço, humildade e alegria.
            </p>

            {/* Seção MINHAS FAIXAS (as 7 faixas com as conquistadas coloridas) */}
            <div className="pt-2">
              <div className="text-xs font-black uppercase tracking-wider text-[#78350F] mb-3 flex items-center justify-center gap-1.5">
                <span>★</span>
                <span>MINHAS FAIXAS</span>
                <span>★</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-w-xl mx-auto">
                {HOME_BELTS.map((belt) => {
                  const achieved = achievedSet.has(belt.order)
                  return (
                    <div key={belt.order} className="flex flex-col items-center">
                      <div
                        className={`w-full h-7 rounded-lg border-2 border-[#2D3748] relative flex items-center justify-center text-[9px] font-black uppercase overflow-hidden shadow-xs ${
                          achieved ? '' : 'opacity-40 grayscale'
                        }`}
                        style={{
                          background: belt.stripeColor
                            ? `linear-gradient(to bottom, ${belt.baseColor} 0%, ${belt.baseColor} 36%, ${belt.stripeColor} 36%, ${belt.stripeColor} 64%, ${belt.baseColor} 64%, ${belt.baseColor} 100%)`
                            : belt.baseColor,
                          color: belt.textColor,
                        }}
                      >
                        {belt.tipColor && (
                          <span
                            style={{
                              position: 'absolute',
                              right: 0,
                              top: 0,
                              bottom: 0,
                              width: '12px',
                              background: belt.tipColor,
                            }}
                          />
                        )}
                        <span className="w-1.5 h-6 bg-white/70 border border-slate-700 rounded-xs absolute left-1/2 -translate-x-1/2" />
                        {achieved && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 absolute top-0.5 right-0.5" />
                        )}
                      </div>
                      <span className="text-[9px] font-extrabold text-[#78350F] mt-1 text-center leading-tight">
                        {belt.shortName}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Data e Assinatura */}
            <div className="pt-4 grid grid-cols-2 gap-6 max-w-lg mx-auto text-center border-t border-dashed border-[#D4AF37]">
              <div>
                <span className="text-[10px] uppercase font-black text-[#78350F] block">Data:</span>
                <div className="font-serif font-bold text-xs sm:text-sm text-slate-800 border-b border-slate-400 pb-1 mt-1">
                  {currentDateFormatted}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-black text-[#78350F] block">
                  Assinatura:
                </span>
                <div className="font-serif italic font-bold text-sm sm:text-base text-slate-900 border-b border-slate-400 pb-1 mt-1">
                  Papai Vítor 🥋
                </div>
              </div>
            </div>

            {/* Rodapé: RESPEITO ★ DISCIPLINA ★ AMIZADE ★ EVOLUÇÃO */}
            <div className="pt-2">
              <div className="inline-block bg-[#FDE68A] text-[#78350F] font-black text-[10px] sm:text-xs uppercase tracking-widest px-4 py-1 rounded-full border border-[#D4AF37]">
                RESPEITO ★ DISCIPLINA ★ AMIZADE ★ EVOLUÇÃO
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
