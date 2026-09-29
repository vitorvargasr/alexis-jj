import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import type { AppMode } from '@/types/library'

interface ModeContextValue {
  mode: AppMode
  isKid: boolean
  setMode: (mode: AppMode) => void
}

const ModeContext = createContext<ModeContextValue | null>(null)
const STORAGE_KEY = 'alexis-app-mode'

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'dad' ? 'dad' : 'kid'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
    document.documentElement.dataset.mode = mode
  }, [mode])

  const value = useMemo(() => ({ mode, isKid: mode === 'kid', setMode: setModeState }), [mode])

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}

export function useMode() {
  const context = useContext(ModeContext)
  if (!context) throw new Error('useMode precisa estar dentro de ModeProvider')
  return context
}
