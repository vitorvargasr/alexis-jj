import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { RecordModel } from 'pocketbase'

import pb from '@/lib/pocketbase/client'

interface AuthContextValue {
  user: RecordModel | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RecordModel | null>(pb.authStore.record)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, record) => setUser(record), true)
    if (!pb.authStore.isValid) {
      setLoading(false)
      return unsubscribe
    }
    pb.collection('users')
      .authRefresh()
      .catch(() => pb.authStore.clear())
      .finally(() => setLoading(false))
    return unsubscribe
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (email, password) => {
        await pb.collection('users').authWithPassword(email, password)
      },
      logout: () => pb.authStore.clear(),
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth precisa estar dentro de AuthProvider')
  return context
}
