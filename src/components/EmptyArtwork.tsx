import { ImagePlus, Paintbrush } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useMode } from '@/contexts/ModeContext'

export function EmptyArtwork({ compact = false }: { compact?: boolean }) {
  const { isKid } = useMode()
  return (
    <div className={compact ? 'empty-art compact' : 'empty-art'}>
      <div className="sketch-tools" aria-hidden="true">
        <Paintbrush />
        <span>✦</span>
        <ImagePlus />
      </div>
      <p>{isKid ? 'A ilustração está sendo desenhada! 🎨' : 'Ilustração ainda não enviada.'}</p>
      {!isKid && !compact && <Link to="/gerenciar">Adicionar em Gerenciar</Link>}
    </div>
  )
}
