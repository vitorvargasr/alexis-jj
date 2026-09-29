import { useState } from 'react'
import { CheckCircle2, KeyRound, XCircle } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

import { AuthShell } from '@/components/AuthShell'
import { FormField, TextInput } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import pb from '@/lib/pocketbase/client'

export default function ConfirmEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'form' | 'success' | 'error'>(token ? 'form' : 'error')
  const [busy, setBusy] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!password) return
    setBusy(true)
    try {
      await pb.collection('users').confirmEmailChange(token, password)
      pb.authStore.clear()
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Troca de email"
      title={
        status === 'form'
          ? 'Confirme sua identidade'
          : status === 'success'
            ? 'Email atualizado!'
            : 'Não foi possível confirmar'
      }
      description={
        status === 'form'
          ? 'Digite sua senha atual para concluir a troca de email com segurança.'
          : status === 'success'
            ? 'Entre novamente usando seu novo endereço de email.'
            : 'O link expirou, já foi usado ou a senha está incorreta.'
      }
    >
      {status === 'form' ? (
        <form className="stack-form" onSubmit={submit}>
          <FormField label="Senha atual">
            <TextInput
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoFocus
            />
          </FormField>
          <Button type="submit" className="auth-submit" disabled={busy || !password}>
            <KeyRound /> {busy ? 'Confirmando...' : 'Confirmar novo email'}
          </Button>
        </form>
      ) : (
        <div className={`status-state ${status}`}>
          {status === 'success' ? <CheckCircle2 /> : <XCircle />}
          <Button asChild>
            <Link to="/login">Voltar para entrar</Link>
          </Button>
        </div>
      )}
    </AuthShell>
  )
}
