import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: ReactNode
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration-one" aria-hidden="true">
        ✦
      </div>
      <div className="auth-decoration auth-decoration-two" aria-hidden="true">
        🥋
      </div>
      <section className="auth-card">
        <Link to="/login" className="auth-brand" aria-label="Jiu-Jitsu do Álexis">
          <span className="brand-mark">🥋</span>
          <span>
            Jiu-Jitsu do <strong>Álexis</strong>
          </span>
        </Link>
        <div className="auth-heading">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {children}
      </section>
      <p className="auth-note">Um cantinho feito com carinho para aprender, brincar e evoluir.</p>
    </main>
  )
}
