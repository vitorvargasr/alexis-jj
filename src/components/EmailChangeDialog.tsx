import { useState } from 'react'
import { MailCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormField, TextInput } from '@/components/FormField'
import pb from '@/lib/pocketbase/client'

export function EmailChangeDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (!email || !email.includes('@')) {
      setError('Digite um email válido.')
      return
    }
    setBusy(true)
    try {
      await pb.collection('users').requestEmailChange(email)
      setSent(true)
    } catch {
      setError('Não foi possível enviar o link. Confira o email e tente novamente.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="dialog-icon">
            <MailCheck />
          </div>
          <DialogTitle>Trocar email</DialogTitle>
          <DialogDescription>
            Enviaremos um link de confirmação para o novo endereço.
          </DialogDescription>
        </DialogHeader>
        {sent ? (
          <div className="success-box">
            <strong>Link enviado!</strong>
            <p>Abra o email recebido para concluir a troca. Sua sessão será encerrada.</p>
            <Button onClick={() => onOpenChange(false)}>Entendi</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="stack-form">
            <FormField label="Novo email" error={error}>
              <TextInput
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="novo@email.com"
                autoFocus
              />
            </FormField>
            <Button type="submit" disabled={busy}>
              {busy ? 'Enviando...' : 'Enviar link de confirmação'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
