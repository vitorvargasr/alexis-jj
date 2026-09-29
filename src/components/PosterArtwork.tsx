import { useEffect, useState } from 'react'

import { EmptyArtwork } from '@/components/EmptyArtwork'
import { renderPdfPageToDataUrl } from '@/services/pdfArtworks'
import { getPosterPageNumber, posterImageUrl } from '@/services/posters'
import type { Poster } from '@/types/library'

interface PosterArtworkProps {
  poster: Poster
  thumb?: string
  alt?: string
  className?: string
  compact?: boolean
}

export function PosterArtwork({
  poster,
  thumb,
  alt = '',
  className = '',
  compact = false,
}: PosterArtworkProps) {
  const [dataUrl, setDataUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const directUrl = posterImageUrl(poster, thumb)
  const pageNumber = getPosterPageNumber(poster)

  useEffect(() => {
    if (directUrl) return // Já tem imagem direta ou svg estático
    if (!pageNumber) return

    let cancelled = false
    setLoading(true)

    renderPdfPageToDataUrl(pageNumber)
      .then((url) => {
        if (!cancelled && url) {
          setDataUrl(url)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [directUrl, pageNumber])

  const src = directUrl || dataUrl

  if (src) {
    return <img src={src} alt={alt || poster.title} className={className} loading="lazy" />
  }

  if (loading) {
    return (
      <div className={`artwork-loading-box ${className}`}>
        <div className="skeleton w-full h-full" style={{ minHeight: compact ? '80px' : '200px' }} />
      </div>
    )
  }

  return <EmptyArtwork compact={compact} />
}
