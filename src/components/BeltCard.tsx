import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles, Trophy } from 'lucide-react'

import { getBeltLevel } from '@/lib/belts'
import type { BeltLevel } from '@/types/library'

export function BeltCard({
  percentage,
  learned,
  total,
  belt,
}: {
  percentage: number
  learned: number
  total: number
  belt?: BeltLevel
}) {
  const currentBelt = belt || getBeltLevel(percentage)
  const [shineKey, setShineKey] = useState(0)

  useEffect(() => {
    setShineKey((value) => value + 1)
  }, [currentBelt.name])

  return (
    <section className="belt-card comic-card" aria-labelledby="belt-title">
      <div className="belt-copy">
        <span className="eyebrow">Sua jornada</span>
        <h2 id="belt-title">Minha Faixa</h2>
        <p>
          <strong>{learned}</strong> de {total} quadrinhos concluídos
        </p>
      </div>
      <div className="belt-visual-wrap">
        <div
          key={shineKey}
          className="belt-visual belt-shine"
          style={{
            background: currentBelt.stripeColor
              ? `linear-gradient(to bottom, ${currentBelt.baseColor} 0%, ${currentBelt.baseColor} 38%, ${currentBelt.stripeColor} 38%, ${currentBelt.stripeColor} 62%, ${currentBelt.baseColor} 62%, ${currentBelt.baseColor} 100%)`
              : currentBelt.baseColor,
            color: currentBelt.textColor,
            border:
              currentBelt.baseColor === '#FFFFFF'
                ? '2px solid #D1D5DB'
                : '2px solid rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {currentBelt.tipColor && (
            <span
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '32px',
                background: currentBelt.tipColor,
                borderLeft: '2px solid #FFF',
              }}
            />
          )}
          <span className="belt-knot" />
          <span style={{ position: 'relative', zIndex: 1, fontWeight: 800 }}>
            Faixa {currentBelt.name}
          </span>
          <Sparkles aria-hidden="true" style={{ position: 'relative', zIndex: 1 }} />
        </div>
        <div className="belt-track" aria-label={`${percentage}% da jornada concluída`}>
          <span style={{ width: `${percentage}%` }} />
        </div>
        <div className="flex items-center justify-between w-full mt-2">
          <small>{percentage}% da jornada no gibi</small>
          <Link
            to="/conquistas"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 underline underline-offset-2"
          >
            <Trophy className="w-3.5 h-3.5" /> Ver Graduação de Casa{' '}
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </section>
  )
}
