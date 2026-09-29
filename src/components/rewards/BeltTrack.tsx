import { useState } from 'react'
import { Check, Calendar, Sparkles, Award } from 'lucide-react'
import { HOME_BELTS } from '@/lib/belts'
import { useLibrary } from '@/contexts/LibraryContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Confetti } from '@/components/Confetti'

export function BeltTrack({ onCelebration }: { onCelebration?: () => void }) {
  const { beltAchievements, toggleBeltAchievement } = useLibrary()
  const [selectedBelt, setSelectedBelt] = useState<number | null>(null)
  const [achievedDate, setAchievedDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [busy, setBusy] = useState(false)
  const [localConfetti, setLocalConfetti] = useState(false)

  const achievementMap = new Map<number, { achieved: boolean; date?: string }>()
  beltAchievements.forEach((item) => {
    achievementMap.set(item.belt_order, {
      achieved: true,
      date: item.achieved_at ? item.achieved_at.slice(0, 10) : undefined,
    })
  })

  const openClaimModal = (order: number) => {
    const existing = achievementMap.get(order)
    setSelectedBelt(order)
    setAchievedDate(existing?.date || new Date().toISOString().slice(0, 10))
  }

  const handleConfirmClaim = async () => {
    if (!selectedBelt) return
    setBusy(true)
    try {
      await toggleBeltAchievement(selectedBelt, true, achievedDate)
      setSelectedBelt(null)
      setLocalConfetti(true)
      onCelebration?.()
      setTimeout(() => setLocalConfetti(false), 3000)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative bg-[#FFFDF7] border-4 border-[#2D3748] rounded-3xl p-4 sm:p-6 shadow-[0_8px_0_#2D3748] overflow-hidden">
      {localConfetti && <Confetti />}

      {/* Header temático do gibi */}
      <div className="text-center mb-6">
        <div className="inline-block bg-[#E0592A] text-white font-black text-xs sm:text-sm uppercase tracking-wider px-3 py-1 rounded-full border-2 border-[#2D3748] shadow-[0_2px_0_#2D3748] mb-2">
          A cada treino, uma conquista!
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#E0592A] tracking-tight uppercase drop-shadow-[0_2px_0_#FCD34D]">
          Minha Graduação de Casa
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs font-bold text-slate-600">
          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
            Aluno: <strong>Álexis</strong>
          </span>
          <span className="bg-sky-100 text-sky-900 px-2 py-0.5 rounded-full border border-sky-300">
            Professor(a): <strong>Papai Vítor</strong>
          </span>
        </div>
      </div>

      {/* Frases motivacionais dos balões */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
        <div className="bg-[#FFF4E5] border-2 border-[#F59E0B] rounded-2xl p-2.5 text-center shadow-sm">
          <span className="block text-xs font-black text-[#B45309] leading-snug">
            “Disciplina hoje, grandes conquistas amanhã!” 🥋
          </span>
        </div>
        <div className="bg-[#EBF8FF] border-2 border-[#3B82F6] rounded-2xl p-2.5 text-center shadow-sm">
          <span className="block text-xs font-black text-[#1D4ED8] leading-snug">
            “Pequenos passos fazem grandes faixas!” ⭐
          </span>
        </div>
        <div className="bg-[#ECFDF5] border-2 border-[#10B981] rounded-2xl p-2.5 text-center shadow-sm">
          <span className="block text-xs font-black text-[#047857] leading-snug">
            “Sonhe, treine, evolua, conquiste!” 🏆
          </span>
        </div>
      </div>

      {/* Trilha das 7 faixas com desenho do gibi */}
      <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
        {HOME_BELTS.map((belt) => {
          const status = achievementMap.get(belt.order)
          const isAchieved = Boolean(status?.achieved)
          const dateStr = status?.date
            ? new Date(status.date + 'T00:00:00').toLocaleDateString('pt-BR')
            : null

          return (
            <div
              key={belt.order}
              className={`relative flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl border-3 transition-all ${
                isAchieved
                  ? 'bg-amber-50/90 border-[#2D3748] shadow-[0_4px_0_#2D3748]'
                  : 'bg-slate-50/70 border-dashed border-slate-300 opacity-90'
              }`}
            >
              {/* Número da faixa na trilha */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 border-[#2D3748] shadow-sm ${
                    isAchieved ? 'bg-[#E0592A] text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {belt.order}
                </div>

                {/* Ilustração e Nome da faixa */}
                <div className="flex-1 sm:w-64">
                  <div
                    className="h-9 rounded-xl border-2 border-[#2D3748] shadow-inner relative flex items-center justify-center font-black text-xs sm:text-sm px-3 uppercase tracking-wide overflow-hidden"
                    style={{
                      background: belt.stripeColor
                        ? `linear-gradient(to bottom, ${belt.baseColor} 0%, ${belt.baseColor} 36%, ${belt.stripeColor} 36%, ${belt.stripeColor} 64%, ${belt.baseColor} 64%, ${belt.baseColor} 100%)`
                        : belt.baseColor,
                      color: belt.textColor,
                    }}
                  >
                    {/* Tarja preta quando existir (ex: ponta preta) */}
                    {belt.tipColor && (
                      <span
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: '28px',
                          background: belt.tipColor,
                          borderLeft: '2px solid white',
                        }}
                      />
                    )}
                    {/* Nó central desenhado */}
                    <span className="w-3.5 h-7 bg-white/70 border border-slate-700 rounded-sm absolute left-1/2 -translate-x-1/2 shadow-xs" />
                    <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                      {belt.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 mt-0.5 block text-center sm:text-left">
                    {belt.description}
                  </span>
                </div>
              </div>

              {/* Data ou Botão de Conquistar */}
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <div className="text-center sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Data de Conquista
                  </span>
                  <div className="px-3 py-1 min-w-[100px] rounded-full border border-dashed border-amber-400 bg-white font-mono text-xs font-bold text-slate-800">
                    {dateStr || '___ / ___ / ___'}
                  </div>
                </div>

                {isAchieved ? (
                  <button
                    onClick={() => openClaimModal(belt.order)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white font-black text-xs border-2 border-[#2D3748] shadow-[0_2px_0_#2D3748] hover:bg-emerald-600 transition-transform active:scale-95"
                    title="Editar data da conquista"
                  >
                    <Check className="w-3.5 h-3.5" /> Conquistada!
                  </button>
                ) : (
                  <Button
                    onClick={() => openClaimModal(belt.order)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-[#2D3748] shadow-[0_2px_0_#2D3748] hover:scale-105 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> Conquistei!
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Rodapé motivacional da imagem */}
      <div className="mt-6 text-center">
        <div className="inline-block bg-[#E0592A] text-white font-black text-sm uppercase tracking-wider px-5 py-2 rounded-2xl border-2 border-[#2D3748] shadow-[0_4px_0_#2D3748]">
          ✨ Treino feito vira conquista visível! 🥋
        </div>
      </div>

      {/* Modal para marcar ou editar data */}
      <Dialog open={selectedBelt !== null} onOpenChange={(open) => !open && setSelectedBelt(null)}>
        <DialogContent className="sm:max-w-md bg-[#FFFDF7] border-4 border-[#2D3748] rounded-3xl">
          <DialogHeader>
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-100 border-2 border-amber-500 flex items-center justify-center text-amber-600">
              <Award className="w-6 h-6" />
            </div>
            <DialogTitle className="text-center text-2xl font-black text-slate-800">
              {selectedBelt
                ? `Faixa ${HOME_BELTS.find((b) => b.order === selectedBelt)?.name}`
                : 'Faixa'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-center text-sm font-medium text-slate-600">
              Parabéns Álexis! Você treinou duro, teve disciplina e respeito no tatame de casa.
              Quando você conquistou esta faixa?
            </p>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="achieved-date"
                className="text-xs font-bold text-slate-700 flex items-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5" /> Data da conquista:
              </label>
              <input
                id="achieved-date"
                type="date"
                value={achievedDate}
                onChange={(e) => setAchievedDate(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#2D3748] rounded-xl font-bold text-slate-800 bg-white"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSelectedBelt(null)}
              disabled={busy}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmClaim}
              disabled={busy}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl border-2 border-[#2D3748] shadow-[0_2px_0_#2D3748]"
            >
              {busy ? 'Salvando...' : 'Salvar Conquista! 🎉'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
