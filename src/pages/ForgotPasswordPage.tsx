import { useState } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AuthShell } from '@/components/AuthShell'
import { FormField, TextInput } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import pb from '@/lib/pocketbase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.includes('@')) {
      setError('Digite um email válido.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await pb.collection('users').requestPasswordReset(email)
      setSent(true)
    } catch {
      setError('Não foi possível enviar o email agora. Tente novamente.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Recuperar acesso"
      title={sent ? 'Email a caminho!' : 'Esqueceu a senha?'}
      description={
        sent
          ? 'Se o email estiver cadastrado, você receberá o link em instantes.'
          : 'Sem problema. Informe seu email para criar uma nova senha.'
      }
    >
      {sent ? (
        <div className="success-box">
          <div className="success-icon">📬</div>
          <strong>Confira sua caixa de entrada</strong>
          <p>O link de recuperação tem prazo de validade. Veja também a pasta de spam.</p>
          <Button asChild>
            <Link to="/login">Voltar para entrar</Link>
          </Button>
        </div>
      ) : (
        <form className="stack-form" onSubmit={submit}>
          <FormField label="Email da conta" error={error}>
            <TextInput
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              autoFocus
            />
          </FormField>
          <Button type="submit" className="auth-submit" disabled={busy}>
            {busy ? (
              'Enviando...'
            ) : (
              <>
                <Mail /> Enviar link
              </>
            )}
          </Button>
          <Button asChild variant="ghost">
            <Link to="/login">
              <ArrowLeft /> Voltar para entrar
            </Link>
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
