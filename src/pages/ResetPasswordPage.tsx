import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { AuthShell } from '@/components/AuthShell'
import { FormField, TextInput } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import pb from '@/lib/pocketbase/client'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const local: Record<string, string> = {}
    if (!token) local.form = 'Este link não é válido ou está incompleto.'
    if (password.length < 8) local.password = 'Use pelo menos 8 caracteres.'
    if (password !== confirm) local.confirm = 'As senhas não são iguais.'
    if (Object.keys(local).length) {
      setErrors(local)
      return
    }
    setBusy(true)
    try {
      await pb.collection('users').confirmPasswordReset(token, password, confirm)
      navigate('/login', { replace: true, state: { reset: true } })
    } catch {
      setErrors({ form: 'O link expirou ou já foi usado. Solicite um novo email.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Nova senha"
      title="Escolha uma senha segura"
      description="Use uma combinação fácil para você lembrar e difícil para outras pessoas adivinharem."
    >
      <form className="stack-form" onSubmit={submit}>
        {errors.form && <div className="global-error">{errors.form}</div>}
        <FormField label="Nova senha" error={errors.password}>
          <TextInput
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
          />
        </FormField>
        <FormField label="Confirmar nova senha" error={errors.confirm}>
          <TextInput
            type="password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
          />
        </FormField>
        <Button type="submit" className="auth-submit" disabled={busy}>
          {busy ? (
            'Salvando...'
          ) : (
            <>
              <KeyRound /> Salvar nova senha
            </>
          )}
        </Button>
        {!token && (
          <Button asChild variant="ghost">
            <Link to="/esqueci-senha">Pedir outro link</Link>
          </Button>
        )}
      </form>
    </AuthShell>
  )
}
