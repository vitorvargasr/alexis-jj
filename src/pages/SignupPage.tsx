import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'

import { AuthShell } from '@/components/AuthShell'
import { FormField, TextInput } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import pb from '@/lib/pocketbase/client'

export default function SignupPage() {
  const { user } = useAuth()
  const [values, setValues] = useState({ name: '', email: '', password: '', passwordConfirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  if (user) return <Navigate to="/" replace />

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const local: Record<string, string> = {}
    if (!values.name.trim()) local.name = 'Informe seu nome.'
    if (!values.email.includes('@')) local.email = 'Digite um email válido.'
    if (values.password.length < 8) local.password = 'A senha precisa ter pelo menos 8 caracteres.'
    if (values.password !== values.passwordConfirm)
      local.passwordConfirm = 'As senhas não são iguais.'
    if (Object.keys(local).length) {
      setErrors(local)
      return
    }
    setBusy(true)
    try {
      await pb.collection('users').create(values)
      await pb.collection('users').requestVerification(values.email)
      setSent(true)
    } catch (error) {
      setErrors(extractFieldErrors(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Novo acesso"
      title={sent ? 'Confira seu email' : 'Criar conta da família'}
      description={
        sent
          ? `Enviamos um link de verificação para ${values.email}.`
          : 'Crie o acesso que acompanhará o progresso do pequeno no tatame.'
      }
    >
      {sent ? (
        <div className="success-box">
          <div className="success-icon">✉️</div>
          <strong>Email enviado!</strong>
          <p>Abra o link para confirmar a conta. Depois, volte para entrar.</p>
          <Button asChild>
            <Link to="/login">Voltar para entrar</Link>
          </Button>
        </div>
      ) : (
        <form className="stack-form" onSubmit={submit}>
          <FormField label="Nome" error={errors.name}>
            <TextInput
              value={values.name}
              onChange={(event) => setValues({ ...values, name: event.target.value })}
              placeholder="Seu nome"
            />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <TextInput
              type="email"
              value={values.email}
              onChange={(event) => setValues({ ...values, email: event.target.value })}
              placeholder="seu@email.com"
            />
          </FormField>
          <FormField label="Senha" error={errors.password} hint="Pelo menos 8 caracteres">
            <TextInput
              type="password"
              value={values.password}
              onChange={(event) => setValues({ ...values, password: event.target.value })}
            />
          </FormField>
          <FormField label="Confirmar senha" error={errors.passwordConfirm}>
            <TextInput
              type="password"
              value={values.passwordConfirm}
              onChange={(event) => setValues({ ...values, passwordConfirm: event.target.value })}
            />
          </FormField>
          <Button type="submit" className="auth-submit" disabled={busy}>
            {busy ? (
              'Criando...'
            ) : (
              <>
                <UserPlus /> Criar conta
              </>
            )}
          </Button>
        </form>
      )}
      {!sent && (
        <p className="auth-switch">
          Já tem acesso? <Link to="/login">Entrar</Link>
        </p>
      )}
    </AuthShell>
  )
}
