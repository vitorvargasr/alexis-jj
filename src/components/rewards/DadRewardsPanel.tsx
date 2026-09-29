import { useState, useMemo } from 'react'
import { Award, Calendar, Check, Edit2, Plus, Sparkles, Target, Trash2 } from 'lucide-react'
import { HOME_BELTS } from '@/lib/belts'
import { useLibrary } from '@/contexts/LibraryContext'
import { Button } from '@/components/ui/button'

export function DadRewardsPanel() {
  const {
    beltAchievements,
    toggleBeltAchievement,
    trainingDays,
    recordTrainingDay,
    weeklyGoals,
    recordWeeklyGoal,
  } = useLibrary()

  const [activeSubTab, setActiveSubTab] = useState<'belts' | 'routine'>('belts')
  const [editingBelt, setEditingBelt] = useState<{ order: number; date: string } | null>(null)
  const [newTrainingDay, setNewTrainingDay] = useState<{
    day: string
    trained: boolean
    stars: number
    note: string
  }>({
    day: new Date().toISOString().slice(0, 10),
    trained: true,
    stars: 3,
    note: '',
  })
  const [currentWeekGoal, setCurrentWeekGoal] = useState<string>('')
  const [goalWeekStart, setGoalWeekStart] = useState<string>(() => {
    const d = new Date()
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const m = new Date(d.setDate(diff))
    return m.toISOString().slice(0, 10)
  })
  const [busy, setBusy] = useState(false)

  const achievementMap = useMemo(() => {
    const map = new Map<number, string>()
    beltAchievements.forEach((b) => {
      map.set(b.belt_order, b.achieved_at ? b.achieved_at.slice(0, 10) : '')
    })
    return map
  }, [beltAchievements])

  const handleToggleBelt = async (beltOrder: number) => {
    setBusy(true)
    try {
      const isAchieved = achievementMap.has(beltOrder)
      if (isAchieved) {
        await toggleBeltAchievement(beltOrder, false)
      } else {
        await toggleBeltAchievement(beltOrder, true, new Date().toISOString().slice(0, 10))
      }
    } finally {
      setBusy(false)
    }
  }

  const handleSaveBeltDate = async () => {
    if (!editingBelt) return
    setBusy(true)
    try {
      await toggleBeltAchievement(editingBelt.order, true, editingBelt.date)
      setEditingBelt(null)
    } finally {
      setBusy(false)
    }
  }

  const handleAddTrainingDay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTrainingDay.day) return
    setBusy(true)
    try {
      await recordTrainingDay(newTrainingDay.day, {
        trained: newTrainingDay.trained,
        stars: newTrainingDay.stars,
        note: newTrainingDay.note,
      })
      setNewTrainingDay((prev) => ({
        ...prev,
        note: '',
      }))
    } finally {
      setBusy(false)
    }
  }

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goalWeekStart || !currentWeekGoal.trim()) return
    setBusy(true)
    try {
      await recordWeeklyGoal(goalWeekStart, currentWeekGoal.trim())
      setCurrentWeekGoal('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Sub-abas do Modo Pai */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <Button
          variant={activeSubTab === 'belts' ? 'default' : 'outline'}
          onClick={() => setActiveSubTab('belts')}
          className="gap-2"
        >
          <Award className="w-4 h-4" /> Graduação de Casa (Faixas)
        </Button>
        <Button
          variant={activeSubTab === 'routine' ? 'default' : 'outline'}
          onClick={() => setActiveSubTab('routine')}
          className="gap-2"
        >
          <Calendar className="w-4 h-4" /> Semana de Treino &amp; Metas
        </Button>
      </div>

      {/* ABA 1: GERENCIAR FAIXAS */}
      {activeSubTab === 'belts' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900">
            <strong>Orientações para o Papai:</strong> Aqui você pode definir ou remover as faixas
            conquistadas pelo Álexis na <em>Graduação de Casa</em> e ajustar a data de graduação de
            cada uma. As alterações atualizam o widget da capa e o certificado do Lutador Corajoso.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HOME_BELTS.map((belt) => {
              const isAchieved = achievementMap.has(belt.order)
              const achievedDate = achievementMap.get(belt.order)

              return (
                <div
                  key={belt.order}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                    isAchieved
                      ? 'bg-white border-amber-400 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs"
                      style={{
                        background: belt.stripeColor
                          ? `linear-gradient(to bottom, ${belt.baseColor} 0%, ${belt.baseColor} 38%, ${belt.stripeColor} 38%, ${belt.stripeColor} 62%, ${belt.baseColor} 62%, ${belt.baseColor} 100%)`
                          : belt.baseColor,
                        color: belt.textColor,
                      }}
                    >
                      #{belt.order}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">Faixa {belt.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">
                        {isAchieved
                          ? `Conquistada em: ${achievedDate ? new Date(achievedDate + 'T00:00:00').toLocaleDateString('pt-BR') : 'Data não informada'}`
                          : 'Ainda não conquistada'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAchieved && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setEditingBelt({
                            order: belt.order,
                            date: achievedDate || new Date().toISOString().slice(0, 10),
                          })
                        }
                        title="Editar data"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button
                      variant={isAchieved ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleToggleBelt(belt.order)}
                      disabled={busy}
                    >
                      {isAchieved ? 'Desmarcar' : 'Conceder Faixa'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Modal / Popover para editar data da faixa */}
          {editingBelt && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 border-2 border-slate-300 shadow-xl">
                <h3 className="font-bold text-base text-slate-800">
                  Editar data da Faixa #{editingBelt.order}
                </h3>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Data da conquista:
                  </label>
                  <input
                    type="date"
                    value={editingBelt.date}
                    onChange={(e) =>
                      setEditingBelt((prev) => (prev ? { ...prev, date: e.target.value } : null))
                    }
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingBelt(null)}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSaveBeltDate} disabled={busy}>
                    Salvar Data
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ABA 2: GERENCIAR SEMANA DE TREINO & METAS */}
      {activeSubTab === 'routine' && (
        <div className="space-y-6">
          {/* Cadastrar / Editar Meta da Semana */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-base text-slate-800">
                Definir Meta Semanal para o Álexis
              </h3>
            </div>
            <form onSubmit={handleSaveGoal} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Início da semana (Segunda):
                </label>
                <input
                  type="date"
                  value={goalWeekStart}
                  onChange={(e) => setGoalWeekStart(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-xl text-sm"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Meta inspiradora:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Treinar 3 dias e praticar a guarda fechada"
                  value={currentWeekGoal}
                  onChange={(e) => setCurrentWeekGoal(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-xl text-sm"
                  required
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={busy} className="w-full">
                  Salvar Meta
                </Button>
              </div>
            </form>

            {weeklyGoals.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  Metas salvas:
                </span>
                <div className="space-y-1">
                  {weeklyGoals.slice(0, 4).map((g) => (
                    <div
                      key={g.id}
                      className="text-xs bg-slate-50 p-2 rounded-lg flex items-center justify-between"
                    >
                      <span>
                        <strong>
                          Semana {new Date(g.week_start + 'T00:00:00').toLocaleDateString('pt-BR')}:
                        </strong>{' '}
                        “{g.goal}”
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Adicionar / Ajustar Registro de Treino */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" />
              Lançar ou Atualizar Treino Diário
            </h3>

            <form onSubmit={handleAddTrainingDay} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Data:</label>
                <input
                  type="date"
                  value={newTrainingDay.day}
                  onChange={(e) => setNewTrainingDay({ ...newTrainingDay, day: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Avaliação (Estrelas):
                </label>
                <select
                  value={newTrainingDay.stars}
                  onChange={(e) =>
                    setNewTrainingDay({ ...newTrainingDay, stars: Number(e.target.value) })
                  }
                  className="w-full px-3 py-1.5 border rounded-xl text-sm"
                >
                  <option value={1}>1 estrela ⭐</option>
                  <option value={2}>2 estrelas ⭐⭐</option>
                  <option value={3}>3 estrelas ⭐⭐⭐ (Excelente)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  O que treinou:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Raspagem de gancho"
                  value={newTrainingDay.note}
                  onChange={(e) => setNewTrainingDay({ ...newTrainingDay, note: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-xl text-sm"
                />
              </div>

              <div className="flex items-end">
                <Button type="submit" disabled={busy} className="w-full">
                  Registrar Treino
                </Button>
              </div>
            </form>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Últimos treinos registrados ({trainingDays.length})
              </h4>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {trainingDays
                  .slice(-10)
                  .reverse()
                  .map((t) => (
                    <div key={t.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-800">
                          {new Date(t.day + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </strong>
                        <span className="ml-2 text-slate-600">{t.note || 'Treino geral'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 font-bold">{'★'.repeat(t.stars || 0)}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            t.trained
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t.trained ? 'Treinou' : 'Não treinou'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
