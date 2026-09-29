import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useMode } from '@/contexts/ModeContext'

export function DadOnlyRoute({ children }: { children: ReactNode }) {
  const { isKid } = useMode()
  return isKid ? <Navigate to="/" replace /> : children
}
