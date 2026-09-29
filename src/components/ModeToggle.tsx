import { useEffect, useRef, useState } from 'react'
import { Check, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useMode } from '@/contexts/ModeContext'
import { cn } from '@/lib/utils'

export function ModeToggle() {
  const { isKid, setMode } = useMode()
  const [open, setOpen] = useState(false)
  const [armed, setArmed] = useState(false)
  const [holding, setHolding] = useState(false)
  const [holdDone, setHoldDone] = useState(false)
  const timer = useRef<number | null>(null)

  const clearTimer = () => {
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = null
    setHolding(false)
  }

  useEffect(() => clearTimer, [])

  const chooseDad = () => {
    if (!isKid) return
    setOpen(true)
    setArmed(false)
    setHoldDone(false)
  }

  const startHold = () => {
    if (!armed) {
      setArmed(true)
      return
    }
    setHolding(true)
    timer.current = window.setTimeout(() => {
      setHoldDone(true)
      setMode('dad')
      setOpen(false)
      setArmed(false)
      setHolding(false)
    }, 900)
  }

  return (
    <>
      <div className="mode-toggle" aria-label="Escolher modo de uso">
        <button
          type="button"
          className={cn('mode-option', isKid && 'active')}
          onClick={() => setMode('kid')}
          aria-pressed={isKid}
        >
          <span aria-hidden="true">🧒</span>
          <span className="mode-label">Modo Criança</span>
        </button>
        <button
          type="button"
          className={cn('mode-option', !isKid && 'active')}
          onClick={chooseDad}
          aria-pressed={!isKid}
        >
          <span aria-hidden="true">👨</span>
          <span className="mode-label">Modo Pai</span>
        </button>
      </div>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value)
          if (!value) clearTimer()
        }}
      >
        <DialogContent className="mode-confirm-dialog">
          <DialogHeader>
            <div className="dialog-icon" aria-hidden="true">
              <ShieldCheck />
            </div>
            <DialogTitle>Voltar para o modo do papai?</DialogTitle>
            <DialogDescription>
              Faça dois passos para confirmar. Assim o Álexis não muda de modo sem querer.
            </DialogDescription>
          </DialogHeader>
          <div className="confirm-steps" aria-label="Progresso da confirmação">
            <span className={cn(armed && 'done')}>
              <Check /> 1. Toque
            </span>
            <span className={cn(holdDone && 'done')}>
              <Check /> 2. Segure
            </span>
          </div>
          <Button
            className={cn('hold-confirm', holding && 'holding')}
            onPointerDown={startHold}
            onPointerUp={clearTimer}
            onPointerLeave={clearTimer}
            onClick={() => {
              if (!armed) setArmed(true)
            }}
          >
            {armed ? 'Segure para confirmar' : 'Toque para começar'}
            {armed && <span className="hold-progress" />}
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Continuar no Modo Criança
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
