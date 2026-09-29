import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

import { getBeltLevel } from '@/lib/belts'

export function BeltCard({
  percentage,
  learned,
  total,
}: {
  percentage: number
  learned: number
  total: number
}) {
  const belt = getBeltLevel(percentage)
  const [shineKey, setShineKey] = useState(0)

  useEffect(() => {
    setShineKey((value) => value + 1)
  }, [belt.name])

  return (
    <section className="belt-card comic-card" aria-labelledby="belt-title">
      <div className="belt-copy">
        <span className="eyebrow">Sua jornada</span>
        <h2 id="belt-title">Minha Faixa</h2>
        <p>
          <strong>{learned}</strong> de {total} pôsteres aprendidos
        </p>
      </div>
      <div className="belt-visual-wrap">
        <div
          key={shineKey}
          className="belt-visual belt-shine"
          style={{ background: belt.color, color: belt.textColor }}
        >
          <span className="belt-knot" />
          <span>Faixa {belt.name}</span>
          <Sparkles aria-hidden="true" />
        </div>
        <div className="belt-track" aria-label={`${percentage}% da jornada concluída`}>
          <span style={{ width: `${percentage}%` }} />
        </div>
        <small>{percentage}% da jornada</small>
      </div>
    </section>
  )
}
