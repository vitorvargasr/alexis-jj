import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-emoji">🥋</div>
      <span className="eyebrow">Erro 404</span>
      <h1>Essa posição não está no nosso treino</h1>
      <p>A página que você procurou mudou de lugar ou não existe.</p>
      <Button asChild>
        <Link to="/">
          <ArrowLeft /> Voltar para a biblioteca
        </Link>
      </Button>
    </main>
  )
}
