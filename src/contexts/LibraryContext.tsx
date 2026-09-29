import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { RecordModel, RecordSubscription } from 'pocketbase'

import { useAuth } from '@/contexts/AuthContext'
import { useRealtime } from '@/hooks/use-realtime'
import { listChapters } from '@/services/chapters'
import { ensureInitialArtwork, listPosters } from '@/services/posters'
import { listProgress } from '@/services/progress'
import {
  listBeltAchievements,
  listTrainingDays,
  listWeeklyGoals,
  setBeltAchievement,
  saveTrainingDay,
  saveWeeklyGoal,
} from '@/services/rewards'
import type {
  BeltAchievement,
  BeltLevel,
  Chapter,
  Poster,
  PosterProgress,
  TrainingDay,
  WeeklyGoal,
} from '@/types/library'
import { HOME_BELTS, getCurrentBelt, getBeltLevel, progressPercentage } from '@/lib/belts'

interface LibraryContextValue {
  chapters: Chapter[]
  posters: Poster[]
  progress: PosterProgress[]
  beltAchievements: BeltAchievement[]
  trainingDays: TrainingDay[]
  weeklyGoals: WeeklyGoal[]
  currentBelt: BeltLevel
  isCertificateUnlocked: boolean
  totalPanels: number
  learnedPanels: number
  loading: boolean
  reload: () => Promise<void>
  setProgressRecord: (record: PosterProgress) => void
  toggleBeltAchievement: (
    beltOrder: number,
    achieved: boolean,
    achievedAt?: string,
  ) => Promise<void>
  recordTrainingDay: (
    day: string,
    data: { trained?: boolean; stars?: number; note?: string },
  ) => Promise<void>
  recordWeeklyGoal: (weekStart: string, goal: string) => Promise<void>
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

function applyRealtime<T extends RecordModel>(items: T[], event: RecordSubscription<T>) {
  if (event.action === 'delete') return items.filter((item) => item.id !== event.record.id)
  const found = items.some((item) => item.id === event.record.id)
  return found
    ? items.map((item) => (item.id === event.record.id ? event.record : item))
    : [...items, event.record]
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [posters, setPosters] = useState<Poster[]>([])
  const [progress, setProgress] = useState<PosterProgress[]>([])
  const [beltAchievements, setBeltAchievements] = useState<BeltAchievement[]>([])
  const [trainingDays, setTrainingDays] = useState<TrainingDay[]>([])
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!user) return
    try {
      const [chapterRows, posterRows, progressRows, beltRows, trainingRows, goalRows] =
        await Promise.all([
          listChapters(),
          listPosters(),
          listProgress(user.id),
          listBeltAchievements(user.id),
          listTrainingDays(user.id),
          listWeeklyGoals(user.id),
        ])
      setChapters(chapterRows.sort((a, b) => a.order - b.order))
      setPosters(posterRows.sort((a, b) => a.order - b.order))
      setProgress(progressRows)
      setBeltAchievements(beltRows)
      setTrainingDays(trainingRows)
      setWeeklyGoals(goalRows)
    } catch {
      // Mantém os últimos dados quando a conexão oscila.
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void reload().then(() => ensureInitialArtwork().catch(() => {}))
  }, [reload])

  useRealtime<Chapter>(
    'chapters',
    (event) => {
      setChapters((current) => applyRealtime(current, event).sort((a, b) => a.order - b.order))
    },
    Boolean(user),
  )

  useRealtime<Poster>(
    'posters',
    (event) => {
      setPosters((current) => applyRealtime(current, event).sort((a, b) => a.order - b.order))
    },
    Boolean(user),
  )

  useRealtime<PosterProgress>(
    'poster_progress',
    (event) => {
      setProgress((current) => applyRealtime(current, event))
    },
    Boolean(user),
  )

  useRealtime<BeltAchievement>(
    'belt_achievements',
    (event) => {
      setBeltAchievements((current) => applyRealtime(current, event))
    },
    Boolean(user),
  )

  useRealtime<TrainingDay>(
    'training_days',
    (event) => {
      setTrainingDays((current) => applyRealtime(current, event))
    },
    Boolean(user),
  )

  useRealtime<WeeklyGoal>(
    'weekly_goals',
    (event) => {
      setWeeklyGoals((current) => applyRealtime(current, event))
    },
    Boolean(user),
  )

  const toggleBeltAchievement = useCallback(
    async (beltOrder: number, achieved: boolean, achievedAt?: string) => {
      if (!user) return
      const res = await setBeltAchievement(user.id, beltOrder, achieved, achievedAt)
      setBeltAchievements((prev) => {
        const filtered = prev.filter((b) => b.belt_order !== beltOrder)
        return res ? [...filtered, res] : filtered
      })
    },
    [user],
  )

  const recordTrainingDay = useCallback(
    async (day: string, data: { trained?: boolean; stars?: number; note?: string }) => {
      if (!user) return
      const res = await saveTrainingDay(user.id, day, data)
      setTrainingDays((prev) => {
        const filtered = prev.filter((d) => d.day !== day)
        return [...filtered, res]
      })
    },
    [user],
  )

  const recordWeeklyGoal = useCallback(
    async (weekStart: string, goal: string) => {
      if (!user) return
      const res = await saveWeeklyGoal(user.id, weekStart, goal)
      setWeeklyGoals((prev) => {
        const filtered = prev.filter((g) => g.week_start !== weekStart)
        return [...filtered, res]
      })
    },
    [user],
  )

  // Estatísticas de progresso
  const learnedIds = useMemo(
    () => new Set(progress.filter((item) => item.learned).map((item) => item.poster)),
    [progress],
  )
  const learnedPanels = learnedIds.size
  const totalPanels = posters.length

  // Se o usuário tem conquistas de faixa gravadas na Graduação de Casa, usa a mais alta.
  // Caso contrário, calcula dinamicamente com base nas leituras para manter compatibilidade retroativa.
  const currentBelt = useMemo<BeltLevel>(() => {
    if (beltAchievements.length > 0) {
      const orders = beltAchievements.map((b) => b.belt_order)
      return getCurrentBelt(orders)
    }
    const pct = progressPercentage(learnedPanels, totalPanels)
    return getBeltLevel(pct)
  }, [beltAchievements, learnedPanels, totalPanels])

  // Desbloqueia certificado quando completar TODOS os quadros de TODAS as edições
  const isCertificateUnlocked = useMemo(() => {
    return totalPanels > 0 && learnedPanels >= totalPanels
  }, [learnedPanels, totalPanels])

  const value = useMemo<LibraryContextValue>(
    () => ({
      chapters,
      posters,
      progress,
      beltAchievements,
      trainingDays,
      weeklyGoals,
      currentBelt,
      isCertificateUnlocked,
      totalPanels,
      learnedPanels,
      loading,
      reload,
      setProgressRecord: (record) => {
        setProgress((current) => {
          const exists = current.some((item) => item.id === record.id)
          return exists
            ? current.map((item) => (item.id === record.id ? record : item))
            : [...current, record]
        })
      },
      toggleBeltAchievement,
      recordTrainingDay,
      recordWeeklyGoal,
    }),
    [
      chapters,
      posters,
      progress,
      beltAchievements,
      trainingDays,
      weeklyGoals,
      currentBelt,
      isCertificateUnlocked,
      totalPanels,
      learnedPanels,
      loading,
      reload,
      toggleBeltAchievement,
      recordTrainingDay,
      recordWeeklyGoal,
    ],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) throw new Error('useLibrary precisa estar dentro de LibraryProvider')
  return context
}
