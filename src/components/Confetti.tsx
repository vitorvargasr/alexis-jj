const confetti = Array.from({ length: 30 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  delay: `${(index % 7) * 0.05}s`,
  color: ['#F5B301', '#2F9E6E', '#E0592A', '#1E3A5F', '#8C5CC4'][index % 5],
  rotate: `${(index * 29) % 180}deg`,
}))

export function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {confetti.map((piece, index) => (
        <span
          key={index}
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            background: piece.color,
            transform: `rotate(${piece.rotate})`,
          }}
        />
      ))}
    </div>
  )
}
