export function ProgressBar({ learned, total }: { learned: number; total: number }) {
  const percentage = total ? Math.round((learned / total) * 100) : 0
  return (
    <div className="card-progress">
      <div className="progress-copy">
        <span>
          {learned}/{total} aprendidos
        </span>
        <span>{percentage}%</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
