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
import type { Chapter, Poster, PosterProgress } from '@/types/library'

interface LibraryContextValue {
  chapters: Chapter[]
  posters: Poster[]
  progress: PosterProgress[]
  loading: boolean
  reload: () => Promise<void>
  setProgressRecord: (record: PosterProgress) => void
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
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!user) return
    try {
      const [chapterRows, posterRows, progressRows] = await Promise.all([
        listChapters(),
        listPosters(),
        listProgress(user.id),
      ])
      setChapters(chapterRows.sort((a, b) => a.order - b.order))
      setPosters(posterRows.sort((a, b) => a.order - b.order))
      setProgress(progressRows)
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

  const value = useMemo<LibraryContextValue>(
    () => ({
      chapters,
      posters,
      progress,
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
    }),
    [chapters, posters, progress, loading, reload],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) throw new Error('useLibrary precisa estar dentro de LibraryProvider')
  return context
}
