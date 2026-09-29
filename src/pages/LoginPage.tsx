import { useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { AuthShell } from '@/components/AuthShell'
import { FormField, TextInput } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/" replace />

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const local: Record<string, string> = {}
    if (!email.includes('@')) local.email = 'Digite um email válido.'
    if (!password) local.password = 'Digite sua senha.'
    if (Object.keys(local).length) {
      setErrors(local)
      return
    }
    setBusy(true)
    setErrors({})
    try {
      await login(email, password)
      const from = (location.state as { from?: string } | null)?.from || '/'
      navigate(from, { replace: true })
    } catch {
      setErrors({ password: 'Email ou senha incorretos. Confira e tente novamente.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Bem-vindo ao tatame"
      title="Entrar na biblioteca"
      description="Use o acesso da família para continuar a jornada do Álexis."
    >
      <form className="stack-form" onSubmit={submit}>
        <FormField label="Email" error={errors.email}>
          <TextInput
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
            autoComplete="email"
            autoFocus
          />
        </FormField>
        <FormField label="Senha" error={errors.password}>
          <div className="password-field">
            <TextInput
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Sua senha"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </FormField>
        <div className="auth-row">
          <label className="checkbox-label">
            <input type="checkbox" /> Lembrar de mim
          </label>
          <Link to="/esqueci-senha">Esqueci minha senha</Link>
        </div>
        <Button type="submit" className="auth-submit" disabled={busy}>
          {busy ? (
            'Entrando...'
          ) : (
            <>
              <LogIn /> Entrar
            </>
          )}
        </Button>
      </form>
      <p className="auth-switch">
        Ainda não tem acesso? <Link to="/cadastro">Criar uma conta</Link>
      </p>
    </AuthShell>
  )
}
