import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Check, Star, Target, Flame, Trophy } from 'lucide-react'
import { useLibrary } from '@/contexts/LibraryContext'
import { Button } from '@/components/ui/button'

const DAY_LABELS = [
  { key: 1, name: 'Segunda', color: '#FF7B72', bg: 'bg-[#FFEBE9]', border: 'border-[#FF7B72]' },
  {
    key: 2,
    name: 'Terça',
    nameFull: 'Terça-feira',
    color: '#F59E0B',
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#F59E0B]',
  },
  { key: 3, name: 'Quarta', color: '#10B981', bg: 'bg-[#ECFDF5]', border: 'border-[#10B981]' },
  { key: 4, name: 'Quinta', color: '#F43F5E', bg: 'bg-[#FFF1F2]', border: 'border-[#F43F5E]' },
  { key: 5, name: 'Sexta', color: '#F59E0B', bg: 'bg-[#FFFBEB]', border: 'border-[#F59E0B]' },
  { key: 6, name: 'Sábado', color: '#06B6D4', bg: 'bg-[#ECFEFF]', border: 'border-[#06B6D4]' },
  { key: 0, name: 'Domingo', color: '#EC4899', bg: 'bg-[#FDF2F8]', border: 'border-[#EC4899]' },
]

// Calcula a segunda-feira da semana de uma determinada data
function getMonday(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // ajusta quando domingo
  const monday = new Date(date.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}

function formatDateISO(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function WeeklyRoutine() {
  const { trainingDays, weeklyGoals, recordTrainingDay, recordWeeklyGoal } = useLibrary()
  const [currentMonday, setCurrentMonday] = useState<Date>(() => getMonday(new Date()))
  const [savingDay, setSavingDay] = useState<string | null>(null)
  const [isEditingGoal, setIsEditingGoal] = useState(false)

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentMonday)
      d.setDate(currentMonday.getDate() + i)
      const iso = formatDateISO(d)
      const dayOfWeek = d.getDay()
      const conf = DAY_LABELS.find((l) => l.key === dayOfWeek) || DAY_LABELS[0]
      return {
        date: d,
        iso,
        label: conf.name,
        color: conf.color,
        bg: conf.bg,
        border: conf.border,
      }
    })
  }, [currentMonday])

  const weekStartISO = formatDateISO(currentMonday)
  const currentGoalRecord = weeklyGoals.find((g) => g.week_start.startsWith(weekStartISO))
  const [goalText, setGoalText] = useState<string>(currentGoalRecord?.goal || '')

  // Atualiza campo quando week muda
  useMemo(() => {
    setGoalText(currentGoalRecord?.goal || '')
    setIsEditingGoal(false)
  }, [currentGoalRecord, weekStartISO])

  const daysMap = useMemo(() => {
    const map = new Map<string, { trained: boolean; stars: number; note: string }>()
    trainingDays.forEach((t) => {
      const iso = t.day.slice(0, 10)
      map.set(iso, {
        trained: t.trained,
        stars: t.stars || 0,
        note: t.note || '',
      })
    })
    return map
  }, [trainingDays])

  // Contagem de dias treinados na semana exibida
  const trainedCount = useMemo(() => {
    return weekDays.filter((wd) => daysMap.get(wd.iso)?.trained).length
  }, [weekDays, daysMap])

  const prevWeek = () => {
    setCurrentMonday((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() - 7)
      return d
    })
  }

  const nextWeek = () => {
    setCurrentMonday((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() + 7)
      return d
    })
  }

  const handleToggleTrained = async (iso: string) => {
    const current = daysMap.get(iso)
    const nextTrained = !current?.trained
    setSavingDay(iso)
    try {
      await recordTrainingDay(iso, {
        trained: nextTrained,
        stars: nextTrained ? Math.max(current?.stars || 0, 1) : 0,
        note: current?.note || '',
      })
    } finally {
      setSavingDay(null)
    }
  }

  const handleStarClick = async (iso: string, starVal: number) => {
    const current = daysMap.get(iso)
    const newStars = current?.stars === starVal ? starVal - 1 : starVal
    setSavingDay(iso)
    try {
      await recordTrainingDay(iso, {
        trained: newStars > 0 ? true : (current?.trained ?? false),
        stars: newStars,
        note: current?.note || '',
      })
    } finally {
      setSavingDay(null)
    }
  }

  const handleNoteBlur = async (iso: string, note: string) => {
    const current = daysMap.get(iso)
    if (current?.note === note) return
    await recordTrainingDay(iso, {
      trained: current?.trained ?? false,
      stars: current?.stars ?? 0,
      note,
    })
  }

  const handleSaveGoal = async () => {
    await recordWeeklyGoal(weekStartISO, goalText)
    setIsEditingGoal(false)
  }

  // Formatação do intervalo da semana (ex: 12/05 a 18/05)
  const sunday = new Date(currentMonday)
  sunday.setDate(sunday.getDate() + 6)
  const weekLabel = `${currentMonday.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} a ${sunday.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`

  return (
    <div className="bg-[#FFFDF7] border-4 border-[#2D3748] rounded-3xl p-4 sm:p-6 shadow-[0_8px_0_#2D3748]">
      {/* Header temático estilo Gibi */}
      <div className="text-center mb-6">
        <div className="inline-block bg-[#E0592A] text-white font-black text-xs sm:text-sm uppercase tracking-wider px-3 py-1 rounded-full border-2 border-[#2D3748] shadow-[0_2px_0_#2D3748] mb-2">
          Treine, marque e acompanhe sua evolução
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#E0592A] tracking-tight uppercase drop-shadow-[0_2px_0_#FCD34D]">
          Minha Semana de Treino
        </h2>

        {/* Seletor de semanas */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <Button
            variant="outline"
            size="icon"
            onClick={prevWeek}
            className="rounded-full border-2 border-[#2D3748] hover:bg-amber-100"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="bg-white px-4 py-1.5 rounded-full border-2 border-[#2D3748] shadow-sm font-black text-xs sm:text-sm text-slate-800">
            📅 Semana: <span className="text-[#E0592A]">{weekLabel}</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextWeek}
            className="rounded-full border-2 border-[#2D3748] hover:bg-amber-100"
            aria-label="Próxima semana"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Resumo motivacional */}
        <div className="mt-3 inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full border border-amber-300 font-extrabold text-xs sm:text-sm">
          <Flame className="w-4 h-4 text-[#E0592A]" />
          <span>
            {trainedCount === 0
              ? 'Comece a semana marcando seu primeiro treino no tatame! 💪'
              : trainedCount === 7
                ? 'Incrível! 7 dias de treino! Um verdadeiro guerreiro! 🏆'
                : `Você treinou ${trainedCount} dia${trainedCount > 1 ? 's' : ''} essa semana! 💪`}
          </span>
        </div>
      </div>

      {/* Tabela dos Dias da Semana */}
      <div className="space-y-3 max-w-2xl mx-auto mb-6">
        {weekDays.map((wd) => {
          const record = daysMap.get(wd.iso)
          const isTrained = Boolean(record?.trained)
          const stars = record?.stars || 0
          const note = record?.note || ''
          const isBusy = savingDay === wd.iso

          return (
            <div
              key={wd.iso}
              className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border-3 border-[#2D3748] transition-all ${
                isTrained
                  ? 'bg-amber-50 shadow-[0_3px_0_#2D3748]'
                  : 'bg-white shadow-[0_2px_0_#CBD5E1]'
              }`}
            >
              {/* Badge do Dia */}
              <div className="flex items-center gap-2 sm:w-36">
                <div
                  className="px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm text-white uppercase border-2 border-[#2D3748] shadow-xs text-center w-28 shrink-0"
                  style={{ backgroundColor: wd.color }}
                >
                  {wd.label}
                </div>
                <span className="text-[11px] font-bold text-slate-400 sm:hidden">
                  {wd.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>

              {/* O que treinou hoje (campo de anotação) */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="O que treinei hoje? (ex: raspagem, rolamento...)"
                  defaultValue={note}
                  key={note}
                  onBlur={(e) => handleNoteBlur(wd.iso, e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-slate-300 bg-white/80 focus:bg-white focus:border-[#2D3748] outline-none font-medium text-slate-800 placeholder:text-slate-400"
                  maxLength={150}
                />
              </div>

              {/* Checkbox "Treinei?" e 3 Estrelas */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {/* Botão Treinei? */}
                <button
                  type="button"
                  onClick={() => handleToggleTrained(wd.iso)}
                  disabled={isBusy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-black text-xs transition-transform active:scale-95 ${
                    isTrained
                      ? 'bg-emerald-500 text-white border-[#2D3748] shadow-[0_2px_0_#2D3748]'
                      : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      isTrained
                        ? 'bg-white text-emerald-600 border-white'
                        : 'bg-white border-slate-400'
                    }`}
                  >
                    {isTrained && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>Treinei?</span>
                </button>

                {/* 3 Estrelas de Avaliação */}
                <div className="flex items-center gap-1 bg-amber-50/80 px-2 py-1 rounded-xl border border-amber-200">
                  {[1, 2, 3].map((starVal) => {
                    const filled = starVal <= stars
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => handleStarClick(wd.iso, starVal)}
                        disabled={isBusy}
                        className="p-0.5 hover:scale-125 transition-transform text-amber-400 active:scale-95"
                        title={`Avaliar com ${starVal} estrela${starVal > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            filled
                              ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                              : 'text-slate-300 hover:text-amber-300'
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Meta da semana */}
      <div className="bg-[#EBF8FF] border-3 border-[#2D3748] rounded-2xl p-4 max-w-2xl mx-auto shadow-[0_4px_0_#2D3748]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center text-red-500 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-black text-sm text-sky-950 uppercase">
                Minha meta da semana:
              </span>
              {!isEditingGoal && (
                <button
                  onClick={() => setIsEditingGoal(true)}
                  className="text-xs font-bold text-sky-700 hover:underline"
                >
                  Editar meta
                </button>
              )}
            </div>
            {isEditingGoal ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  placeholder="Ex: Treinar 3 vezes e aprender a passagem de guarda..."
                  className="flex-1 px-3 py-1.5 border-2 border-[#2D3748] rounded-xl text-xs sm:text-sm bg-white font-medium text-slate-800"
                  maxLength={180}
                />
                <Button
                  onClick={handleSaveGoal}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Salvar
                </Button>
              </div>
            ) : (
              <p className="text-xs sm:text-sm font-semibold text-slate-700 italic bg-white/70 p-2.5 rounded-xl border border-sky-200">
                {currentGoalRecord?.goal
                  ? `“${currentGoalRecord.goal}”`
                  : 'Clique em "Editar meta" para definir a meta com o papai! 🎯'}
              </p>
            )}
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-sky-200 text-right">
          <span className="text-xs font-bold text-sky-800">
            “Quem mantém a rotina evolui um passo por vez!” ❤️
          </span>
        </div>
      </div>

      {/* Rodapé motivacional */}
      <div className="mt-6 flex flex-wrap items-center justify-around gap-2 text-center text-xs font-black text-slate-600">
        <span>⭐ Pequenos treinos, grandes histórias!</span>
        <span>🥋 Jiu-Jitsu forma pessoas incríveis!</span>
      </div>
    </div>
  )
}
