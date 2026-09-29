import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  Award,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Compass,
  Dumbbell,
  HelpCircle,
  Home,
  Info,
  Lock,
  MessageCircle,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { Confetti } from '@/components/Confetti'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/AuthContext'
import { useMode } from '@/contexts/ModeContext'
import {
  DRILL_DAYS,
  DrillDay,
  GOLDEN_RULE,
  HOW_TO_USE_RULES,
  PROGRAM_MAP_WEEKS,
  QUICK_PARENT_GUIDE,
  SAFETY_ITEMS,
  WEEK_CHECKPOINTS,
  WeekCheckpoint,
} from '@/data/homeDrills'
import { listHomeDrillProgress, saveHomeDrillProgress } from '@/services/homeDrills'
import type { HomeDrillProgressRecord } from '@/types/library'

export default function HomeDrillsPage() {
  const { user } = useAuth()
  const { isKid } = useMode()

  // Estado de progresso
  const [progressMap, setProgressMap] = useState<Record<number, HomeDrillProgressRecord>>({})
  const [loading, setLoading] = useState(true)

  // Filtro/Navegação: 'overview' | 1 | 2 | 3 | 4 | 5 (semanas) | 'calendar' | 'rules' | 'parents'
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'semana1'
    | 'semana2'
    | 'semana3'
    | 'semana4'
    | 'semana5'
    | 'calendar'
    | 'rules'
    | 'parents'
  >('semana1')
  const [selectedDay, setSelectedDay] = useState<DrillDay>(DRILL_DAYS[0])
  const [checkpointModal, setCheckpointModal] = useState<WeekCheckpoint | null>(null)
  const [confettiActive, setConfettiActive] = useState(false)
  const [savingDay, setSavingDay] = useState<number | null>(null)

  // Carregar progresso inicial
  useEffect(() => {
    async function loadProgress() {
      if (!user) {
        setLoading(false)
        return
      }
      try {
        const list = await listHomeDrillProgress(user.id)
        const map: Record<number, HomeDrillProgressRecord> = {}
        for (const item of list) {
          map[item.day_number] = item
        }
        setProgressMap(map)
      } catch (err) {
        console.warn('Erro ao carregar dados do treino em casa:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProgress()
  }, [user])

  // Métricas de progresso
  const totalDays = 30
  const completedCount = Object.values(progressMap).filter((item) => item.done).length
  const progressPercent = Math.round((completedCount / totalDays) * 100)

  // Manipuladores de ação
  const handleToggleDone = async (dayNumber: number) => {
    const current = progressMap[dayNumber]
    const nextDone = !current?.done
    setSavingDay(dayNumber)
    try {
      const saved = await saveHomeDrillProgress(
        dayNumber,
        {
          done: nextDone,
          nota: current?.nota || 5,
          calm_checked: current?.calm_checked ?? true,
          painless_checked: current?.painless_checked ?? true,
          fun_checked: current?.fun_checked ?? true,
        },
        user?.id,
      )
      if (saved) {
        setProgressMap((prev) => ({ ...prev, [dayNumber]: saved }))
      }
      if (nextDone) {
        setConfettiActive(true)
        setTimeout(() => setConfettiActive(false), 3000)
      }
    } catch (err) {
      console.error('Falha ao alternar dia:', err)
    } finally {
      setSavingDay(null)
    }
  }

  const handleUpdateRating = async (dayNumber: number, rating: number) => {
    const current = progressMap[dayNumber]
    try {
      const saved = await saveHomeDrillProgress(
        dayNumber,
        {
          nota: rating,
        },
        user?.id,
      )
      if (saved) {
        setProgressMap((prev) => ({ ...prev, [dayNumber]: saved }))
      }
    } catch (err) {
      console.error('Falha ao atualizar nota:', err)
    }
  }

  const handleToggleCheck = async (
    dayNumber: number,
    field: 'calm_checked' | 'painless_checked' | 'fun_checked',
    val: boolean,
  ) => {
    const current = progressMap[dayNumber]
    try {
      const saved = await saveHomeDrillProgress(
        dayNumber,
        {
          [field]: val,
        },
        user?.id,
      )
      if (saved) {
        setProgressMap((prev) => ({ ...prev, [dayNumber]: saved }))
      }
    } catch (err) {
      console.error(`Falha ao atualizar check ${field}:`, err)
    }
  }

  // Filtragem dos dias de acordo com a semana
  const currentWeekNum =
    activeTab === 'semana1'
      ? 1
      : activeTab === 'semana2'
        ? 2
        : activeTab === 'semana3'
          ? 3
          : activeTab === 'semana4'
            ? 4
            : activeTab === 'semana5'
              ? 5
              : null

  const filteredDays = currentWeekNum
    ? DRILL_DAYS.filter((d) => d.week === currentWeekNum)
    : DRILL_DAYS

  // Informações da semana atual
  const activeWeekInfo = currentWeekNum
    ? PROGRAM_MAP_WEEKS.find((w) => w.week === currentWeekNum)
    : null

  const activeWeekCheckpoint =
    currentWeekNum && currentWeekNum <= 4
      ? WEEK_CHECKPOINTS.find((c) => c.week === currentWeekNum)
      : null

  const currentDayProgress = progressMap[selectedDay.day]

  return (
    <div className="page home-drills-page max-w-6xl mx-auto px-4 py-6">
      {confettiActive && <Confetti />}

      {/* Hero da Área - Estilo Revista em Quadrinhos */}
      <section className="comic-cover-hero fade-rise mb-8 bg-amber-50/90 border-4 border-slate-900 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_#1e3a5f] relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <Badge className="bg-amber-400 hover:bg-amber-400 text-slate-950 font-black border-2 border-slate-950 text-xs px-3 py-1 uppercase tracking-wider shadow-[2px_2px_0_#1e3a5f]">
            🏠 PROGRAMA PRÁTICO PARA CRIANÇAS E PAIS
          </Badge>
          <span className="text-xs md:text-sm font-black bg-white text-slate-900 border-2 border-slate-950 px-3 py-1 rounded-full shadow-[2px_2px_0_#1e3a5f]">
            30 DIAS DE DRILLS · 18 A 22 MINUTOS POR DIA
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Treino em Casa{' '}
              <span className="text-amber-600 underline decoration-wavy decoration-amber-400">
                Drills Kids
              </span>{' '}
              🏠
            </h1>
            <p className="mt-3 text-base md:text-lg text-slate-700 font-semibold leading-relaxed">
              Movimento, técnica, coordenação e confiança — sem precisar de tatame profissional!
              Para treinar melhor, não mais pesado.
            </p>
          </div>

          {/* Progresso Geral dos 30 Dias */}
          <div className="flex-shrink-0 bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0_#1e3a5f] min-w-[260px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-amber-700">
                Meu Desafio 30 Dias
              </span>
              <span className="text-lg font-black text-slate-900">{progressPercent}%</span>
            </div>
            <Progress
              value={progressPercent}
              className="h-4 bg-slate-100 border border-slate-300"
            />
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{completedCount} de 30 dias feitos</span>
              <span className="text-amber-700">{30 - completedCount} restantes</span>
            </div>
          </div>
        </div>

        {/* REGRA DE OURO */}
        <div className="mt-6 p-4 bg-amber-100/90 border-2 border-amber-400 rounded-2xl flex items-start gap-3 shadow-inner">
          <ShieldAlert className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm text-amber-950 font-bold leading-relaxed">
            <strong className="text-amber-900 uppercase tracking-wide mr-1">
              ⭐ Regra de Ouro:
            </strong>
            {GOLDEN_RULE}
          </div>
        </div>
      </section>

      {/* Barra de Navegação por Semanas e Recursos */}
      <nav
        aria-label="Navegação do Programa"
        className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin"
      >
        <button
          type="button"
          onClick={() => setActiveTab('semana1')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm whitespace-nowrap transition-all border-2 border-slate-900 ${
            activeTab === 'semana1'
              ? 'bg-amber-400 text-slate-950 shadow-[3px_3px_0_#1e3a5f] -translate-y-0.5'
              : 'bg-white text-slate-700 hover:bg-amber-50 shadow-[2px_2px_0_#1e3a5f]'
          }`}
        >
          Semana 1 (Dias 1-7)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('semana2')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm whitespace-nowrap transition-all border-2 border-slate-900 ${
            activeTab === 'semana2'
              ? 'bg-amber-400 text-slate-950 shadow-[3px_3px_0_#1e3a5f] -translate-y-0.5'
              : 'bg-white text-slate-700 hover:bg-amber-50 shadow-[2px_2px_0_#1e3a5f]'
          }`}
        >
          Semana 2 (Dias 8-14)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('semana3')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm whitespace-nowrap transition-all border-2 border-slate-900 ${
            activeTab === 'semana3'
              ? 'bg-amber-400 text-slate-950 shadow-[3px_3px_0_#1e3a5f] -translate-y-0.5'
              : 'bg-white text-slate-700 hover:bg-amber-50 shadow-[2px_2px_0_#1e3a5f]'
          }`}
        >
          Semana 3 (Dias 15-21)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('semana4')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm whitespace-nowrap transition-all border-2 border-slate-900 ${
            activeTab === 'semana4'
              ? 'bg-amber-400 text-slate-950 shadow-[3px_3px_0_#1e3a5f] -translate-y-0.5'
              : 'bg-white text-slate-700 hover:bg-amber-50 shadow-[2px_2px_0_#1e3a5f]'
          }`}
        >
          Semana 4 (Dias 22-28)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('semana5')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm whitespace-nowrap transition-all border-2 border-slate-900 ${
            activeTab === 'semana5'
              ? 'bg-amber-400 text-slate-950 shadow-[3px_3px_0_#1e3a5f] -translate-y-0.5'
              : 'bg-white text-slate-700 hover:bg-amber-50 shadow-[2px_2px_0_#1e3a5f]'
          }`}
        >
          Dias 29-30 (Teste Final 🏅)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm whitespace-nowrap transition-all border-2 border-slate-900 flex items-center gap-1.5 ${
            activeTab === 'calendar'
              ? 'bg-emerald-400 text-slate-950 shadow-[3px_3px_0_#1e3a5f] -translate-y-0.5'
              : 'bg-white text-slate-700 hover:bg-emerald-50 shadow-[2px_2px_0_#1e3a5f]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Meu Calendário</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm whitespace-nowrap transition-all border-2 border-slate-900 flex items-center gap-1.5 ${
            activeTab === 'rules'
              ? 'bg-sky-400 text-slate-950 shadow-[3px_3px_0_#1e3a5f] -translate-y-0.5'
              : 'bg-white text-slate-700 hover:bg-sky-50 shadow-[2px_2px_0_#1e3a5f]'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Regras &amp; Segurança</span>
        </button>

        {!isKid && (
          <button
            type="button"
            onClick={() => setActiveTab('parents')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm whitespace-nowrap transition-all border-2 border-slate-900 flex items-center gap-1.5 ${
              activeTab === 'parents'
                ? 'bg-indigo-400 text-slate-950 shadow-[3px_3px_0_#1e3a5f] -translate-y-0.5'
                : 'bg-white text-slate-700 hover:bg-indigo-50 shadow-[2px_2px_0_#1e3a5f]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Guia para Pais</span>
          </button>
        )}
      </nav>

      {/* CONTEÚDO 1: SEMANAS E DIAS DE TREINO */}
      {currentWeekNum && (
        <div className="space-y-6">
          {/* Cabeçalho da Semana Atual */}
          {activeWeekInfo && (
            <div className="comic-card bg-white border-3 border-slate-900 rounded-3xl p-5 shadow-[5px_5px_0_#1e3a5f] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase text-amber-700 tracking-wider">
                  {activeWeekInfo.daysRange}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                  {activeWeekInfo.title}
                </h2>
                <p className="text-sm text-slate-600 font-semibold mt-0.5">
                  {activeWeekInfo.description}
                </p>
              </div>

              {activeWeekCheckpoint && (
                <Button
                  onClick={() => setCheckpointModal(activeWeekCheckpoint)}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs md:text-sm rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0_#1e3a5f] cursor-pointer"
                >
                  <Award className="w-4 h-4 mr-1.5" /> Ver Checkpoint da Semana
                </Button>
              )}
            </div>
          )}

          {/* Grid de Seleção Rápida de Dias na Semana */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {filteredDays.map((d) => {
              const isDone = Boolean(progressMap[d.day]?.done)
              const isSelected = selectedDay.day === d.day
              return (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setSelectedDay(d)}
                  className={`p-3 rounded-2xl border-2 border-slate-900 text-left transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-[4px_4px_0_#1e3a5f] scale-102 font-black'
                      : isDone
                        ? 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200 shadow-[2px_2px_0_#1e3a5f]'
                        : 'bg-white text-slate-800 hover:bg-amber-50 shadow-[2px_2px_0_#1e3a5f]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">DIA {String(d.day).padStart(2, '0')}</span>
                    {isDone && <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />}
                  </div>
                  <div className="text-xs font-bold truncate mt-1">{d.title}</div>
                </button>
              )
            })}
          </div>

          {/* Cartão de Detalhes do Dia Selecionado */}
          <article className="comic-card bg-white border-4 border-slate-900 rounded-3xl overflow-hidden shadow-[8px_8px_0_#1e3a5f]">
            {/* Topo do Dia */}
            <div className="bg-amber-50/90 border-b-4 border-slate-900 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-amber-400 text-slate-950 font-black border-2 border-slate-950 text-xs px-2.5 py-0.5">
                    DIA {selectedDay.day}
                  </Badge>
                  <span className="text-xs font-bold text-slate-600">
                    ⏱️ {selectedDay.time} · Ritmo: {selectedDay.pace} · Equip:{' '}
                    {selectedDay.equipment}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900">
                  {selectedDay.title}
                </h3>
                <p className="text-sm md:text-base font-semibold text-slate-700 mt-1">
                  🎯 Foco: {selectedDay.focus}
                </p>
              </div>

              {/* Botão de Concluir o Dia */}
              <div className="flex-shrink-0 flex items-center gap-3">
                <Button
                  onClick={() => handleToggleDone(selectedDay.day)}
                  disabled={savingDay === selectedDay.day}
                  className={`font-black text-base md:text-lg px-6 py-6 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0_#1e3a5f] transition-all cursor-pointer ${
                    currentDayProgress?.done
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                  }`}
                >
                  {currentDayProgress?.done ? (
                    <>
                      <Check className="w-5 h-5 mr-2 stroke-[3]" /> Concluído! ✅
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2 fill-current" /> Concluir o Dia!
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="p-5 md:p-7 space-y-6">
              {/* Aquecimento */}
              <div className="p-4 bg-amber-50/80 border-2 border-amber-300 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-800 mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Aquecimento (4 Minutos)</span>
                </div>
                <p className="text-sm md:text-base font-bold text-slate-800">
                  {selectedDay.warmup}
                </p>
              </div>

              {/* 3 Exercícios Numerados */}
              <div>
                <h4 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-amber-600" />
                  <span>Exercícios do Dia</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedDay.exercises.map((ex) => (
                    <div
                      key={ex.number}
                      className="bg-slate-50 border-3 border-slate-900 rounded-2xl p-4 flex flex-col justify-between shadow-[3px_3px_0_#1e3a5f]"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center border-2 border-slate-900 shadow-[1px_1px_0_#1e3a5f]">
                            {ex.number}
                          </span>
                          <span className="font-black text-sm md:text-base text-slate-900">
                            {ex.name}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                          {ex.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t-2 border-dashed border-slate-300 text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                        {ex.reps}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DESAFIO / JOGO FINAL */}
              <div className="p-5 bg-gradient-to-r from-amber-100/90 to-orange-100/90 border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0_#1e3a5f]">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-900 mb-1">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>Desafio / Jogo Final</span>
                </div>
                <p className="text-base md:text-lg font-black text-slate-900 leading-snug">
                  {selectedDay.finalChallenge}
                </p>
              </div>

              {/* SINAL DE PROGRESSO & AVALIAÇÃO DA CRIANÇA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Sinal de Progresso */}
                <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0_#1e3a5f]">
                  <span className="text-xs font-black uppercase text-slate-500">
                    Sinal de Progresso
                  </span>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedDay.progressSignal}
                  </p>
                </div>

                {/* Avaliação do Dia (1 a 5 estrelas) */}
                <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0_#1e3a5f]">
                  <span className="text-xs font-black uppercase text-slate-500">Nota do Dia</span>
                  <div className="flex items-center gap-1.5 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isSelected = (currentDayProgress?.nota || 0) >= star
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleUpdateRating(selectedDay.day, star)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                          aria-label={`Avaliar com nota ${star}`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              isSelected
                                ? 'text-amber-500 fill-amber-400'
                                : 'text-slate-300 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      )
                    })}
                    <span className="text-xs font-black text-slate-700 ml-2">
                      {currentDayProgress?.nota ? `${currentDayProgress.nota} de 5` : 'Sem nota'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Checkboxes do PDF */}
              <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0_#1e3a5f] flex flex-wrap items-center justify-between gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-800">
                  <Checkbox
                    checked={currentDayProgress?.calm_checked ?? false}
                    onCheckedChange={(val) =>
                      handleToggleCheck(selectedDay.day, 'calm_checked', Boolean(val))
                    }
                  />
                  <span>Feito com calma</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-800">
                  <Checkbox
                    checked={currentDayProgress?.painless_checked ?? false}
                    onCheckedChange={(val) =>
                      handleToggleCheck(selectedDay.day, 'painless_checked', Boolean(val))
                    }
                  />
                  <span>Sem dor</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-slate-800">
                  <Checkbox
                    checked={currentDayProgress?.fun_checked ?? false}
                    onCheckedChange={(val) =>
                      handleToggleCheck(selectedDay.day, 'fun_checked', Boolean(val))
                    }
                  />
                  <span>Criança se divertiu</span>
                </label>
              </div>

              {/* PARA OS PAIS (Visível apenas no Modo Pai) */}
              {!isKid ? (
                <div className="p-5 bg-indigo-50/80 border-3 border-indigo-400 rounded-2xl shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-indigo-900 mb-1">
                    <Users className="w-4 h-4 text-indigo-700" />
                    <span>Para os Pais (Dica do Mestre Vítor)</span>
                  </div>
                  <p className="text-sm md:text-base font-semibold text-indigo-950 leading-relaxed">
                    {selectedDay.parentTip}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-slate-100 rounded-xl text-center text-xs font-bold text-slate-500">
                  🔒 Dica exclusiva dos pais escondida no Modo Criança
                </div>
              )}
            </div>
          </article>
        </div>
      )}

      {/* CONTEÚDO 2: MEU CALENDÁRIO VISUAL DE 30 DIAS */}
      {activeTab === 'calendar' && (
        <section aria-labelledby="calendar-title" className="space-y-6">
          <div className="comic-card bg-white border-4 border-slate-900 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_#1e3a5f]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                  Visão Geral do Desafio
                </span>
                <h2 id="calendar-title" className="text-2xl md:text-3xl font-black text-slate-900">
                  Meu Calendário de 30 Dias
                </h2>
                <p className="text-sm md:text-base text-slate-600 font-semibold mt-1">
                  Marque um dia quando o treino for concluído. Se pular um dia, apenas continue
                  depois — o objetivo é constância, não perfeição!
                </p>
              </div>
              <div className="bg-emerald-50 border-2 border-emerald-300 p-3 rounded-2xl text-center">
                <span className="text-xs font-black text-emerald-800 uppercase block">
                  Concluídos
                </span>
                <strong className="text-2xl font-black text-emerald-950">
                  {completedCount} / 30
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {DRILL_DAYS.map((d) => {
                const prog = progressMap[d.day]
                const isDone = Boolean(prog?.done)
                return (
                  <div
                    key={d.day}
                    onClick={() => {
                      setSelectedDay(d)
                      setActiveTab(
                        d.week === 1
                          ? 'semana1'
                          : d.week === 2
                            ? 'semana2'
                            : d.week === 3
                              ? 'semana3'
                              : d.week === 4
                                ? 'semana4'
                                : 'semana5',
                      )
                    }}
                    className={`p-3.5 rounded-2xl border-2 border-slate-900 cursor-pointer transition-all hover:-translate-y-1 ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-950 shadow-[3px_3px_0_#1e3a5f]'
                        : 'bg-white text-slate-800 hover:bg-amber-50 shadow-[2px_2px_0_#1e3a5f]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black">{String(d.day).padStart(2, '0')}</span>
                      {isDone ? (
                        <span className="text-xs font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-md">
                          Feito ✓
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Pendente</span>
                      )}
                    </div>
                    <div className="text-xs font-bold truncate mt-1 text-slate-700">{d.title}</div>
                    <div className="mt-2 text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                      <span>Nota:</span>
                      <strong className="text-amber-600">
                        {prog?.nota ? `${prog.nota} ★` : '—'}
                      </strong>
                    </div>
                  </div>
                )
              })}
            </div>

            {completedCount === 30 && (
              <div className="mt-8 p-6 bg-amber-100 border-3 border-amber-400 rounded-3xl text-center">
                <span className="text-4xl">🏆 🥋 🎉</span>
                <h3 className="text-2xl font-black text-amber-950 mt-2">
                  CONCLUÍ 30 DIAS DE MOVIMENTO, TÉCNICA E DISCIPLINA!
                </h3>
                <p className="text-sm md:text-base font-bold text-amber-900 mt-1 max-w-xl mx-auto">
                  Você completou todo o programa de drills em casa com muita dedicação e respeito. O
                  tatame agora é o seu reino!
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CONTEÚDO 3: REGRAS E SEGURANÇA */}
      {activeTab === 'rules' && (
        <section aria-labelledby="rules-title" className="space-y-6">
          <div className="comic-card bg-white border-4 border-slate-900 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_#1e3a5f]">
            <span className="text-xs font-black uppercase text-sky-700 tracking-wider">
              Orientações Oficiais
            </span>
            <h2 id="rules-title" className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
              Como Usar Estes 30 Dias &amp; Segurança em Casa
            </h2>
            <p className="text-sm md:text-base text-slate-600 font-semibold mb-6">
              O objetivo não é transformar a sala de casa em uma academia. A proposta é criar
              memória de movimento, melhorar coordenação e repetir fundamentos que ajudam a criança
              no treino formal.
            </p>

            <h3 className="text-lg font-black text-slate-900 mb-3">6 Regras de Uso:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {HOW_TO_USE_RULES.map((rule) => (
                <div
                  key={rule.number}
                  className="p-4 bg-slate-50 border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0_#1e3a5f]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center border border-slate-900">
                      {rule.number}
                    </span>
                    <h4 className="font-black text-sm md:text-base text-slate-900">{rule.title}</h4>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-3">Segurança Antes de Começar:</h3>
            <p className="text-xs md:text-sm text-rose-700 font-bold mb-3">
              Pare imediatamente se houver dor aguda, tontura, falta de ar fora do normal, pancada
              na cabeça ou mal-estar.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAFETY_ITEMS.map((item) => (
                <div
                  key={item.number}
                  className="p-4 bg-amber-50/70 border-2 border-amber-300 rounded-2xl"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                      {item.number}
                    </span>
                    <h4 className="font-black text-sm md:text-base text-slate-900">{item.title}</h4>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTEÚDO 4: GUIA RÁPIDO PARA OS PAIS (Disponível no Modo Pai) */}
      {activeTab === 'parents' && !isKid && (
        <section aria-labelledby="parents-title" className="space-y-6">
          <div className="comic-card bg-white border-4 border-slate-900 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_#1e3a5f]">
            <span className="text-xs font-black uppercase text-indigo-700 tracking-wider">
              Pedagogia do Treino em Casa
            </span>
            <h2 id="parents-title" className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
              Como Dar Instruções que Funcionam
            </h2>
            <p className="text-sm md:text-base text-slate-600 font-semibold mb-6">
              O professor ensina Jiu-Jitsu no tatame; em casa, o adulto facilita repetição,
              constância, segurança e diversão.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUICK_PARENT_GUIDE.map((tip) => (
                <div
                  key={tip.number}
                  className="p-4 bg-indigo-50/70 border-2 border-indigo-300 rounded-2xl shadow-[3px_3px_0_#1e3a5f]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                      {tip.number}
                    </span>
                    <h4 className="font-black text-sm md:text-base text-slate-900">{tip.title}</h4>
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MODAL DE CHECKPOINT DA SEMANA */}
      <Dialog
        open={Boolean(checkpointModal)}
        onOpenChange={(open) => !open && setCheckpointModal(null)}
      >
        <DialogContent className="max-w-2xl bg-amber-50/95 border-4 border-slate-900 rounded-3xl p-6 shadow-[10px_10px_0_#1e3a5f]">
          {checkpointModal && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-700">
                  <Award className="w-4 h-4" />
                  <span>Checkpoint da Semana {checkpointModal.week}</span>
                </div>
                <DialogTitle className="text-2xl font-black text-slate-900">
                  {checkpointModal.theme}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 my-2">
                <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl">
                  <h4 className="font-black text-sm text-slate-900 mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-amber-600" />
                    <span>Perguntas para a Criança:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs md:text-sm font-semibold text-slate-700">
                    {checkpointModal.kidQuestions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-black">★</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {!isKid && (
                  <div className="p-4 bg-indigo-50 border-2 border-indigo-300 rounded-2xl">
                    <h4 className="font-black text-sm text-indigo-950 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-700" />
                      <span>Avaliação dos Pais (Sem comparar com outras crianças):</span>
                    </h4>
                    <ul className="space-y-1 text-xs md:text-sm font-medium text-indigo-900">
                      {checkpointModal.parentEvaluationItems.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-2 border-t border-indigo-200 text-xs font-bold text-indigo-950">
                      💡 {checkpointModal.nextWeekTip}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setCheckpointModal(null)}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0_#1e3a5f]"
                >
                  Entendido! Continuar Treino
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
