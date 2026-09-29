import { useEffect, useState } from 'react'
import { CheckCircle2, LoaderCircle, XCircle } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

import { AuthShell } from '@/components/AuthShell'
import { Button } from '@/components/ui/button'
import pb from '@/lib/pocketbase/client'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }
    pb.collection('users')
      .confirmVerification(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <AuthShell
      eyebrow="Verificação de email"
      title={
        status === 'loading'
          ? 'Confirmando seu email...'
          : status === 'success'
            ? 'Email confirmado!'
            : 'Link inválido'
      }
      description={
        status === 'success'
          ? 'Tudo pronto para entrar na biblioteca do Álexis.'
          : status === 'error'
            ? 'Este link pode ter expirado ou já ter sido usado.'
            : 'Só um instante enquanto preparamos seu acesso.'
      }
    >
      <div className={`status-state ${status}`}>
        {status === 'loading' && <LoaderCircle className="spin" />}
        {status === 'success' && <CheckCircle2 />}
        {status === 'error' && <XCircle />}
        {status !== 'loading' && (
          <Button asChild>
            <Link to={status === 'success' ? '/login' : '/cadastro'}>
              {status === 'success' ? 'Entrar agora' : 'Criar uma conta'}
            </Link>
          </Button>
        )}
      </div>
    </AuthShell>
  )
}
