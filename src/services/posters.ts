import pb from '@/lib/pocketbase/client'
import type { Poster } from '@/types/library'

export const initialArtwork: Record<string, string> = {
  'Montada Alta': '/posters/montada-alta.svg',
  'Da Montada para as Costas': '/posters/montada-para-costas.svg',
  'Estabilizar os Cem-Quilos': '/posters/cem-quilos.svg',
}

export function listPosters(chapterId?: string) {
  return pb.collection<Poster>('posters').getFullList({
    sort: 'order',
    filter: chapterId ? pb.filter('chapter = {:chapter}', { chapter: chapterId }) : '',
  })
}

export function getPoster(id: string) {
  return pb.collection<Poster>('posters').getOne(id)
}

export function posterImageUrl(poster: Poster, thumb?: string) {
  if (poster.image) {
    return pb.files.getURL(poster, poster.image, thumb ? { thumb } : undefined)
  }
  return initialArtwork[poster.title] || ''
}

export function savePoster(
  values: {
    title: string
    kid_text: string
    dad_tip: string
    chapter: string
    order: number
    image?: File | null
  },
  id?: string,
) {
  const data = new FormData()
  data.set('title', values.title)
  data.set('kid_text', values.kid_text)
  data.set('dad_tip', values.dad_tip)
  data.set('chapter', values.chapter)
  data.set('order', String(values.order))
  if (values.image) data.set('image', values.image)
  return id
    ? pb.collection<Poster>('posters').update(id, data)
    : pb.collection<Poster>('posters').create(data)
}

export function removePoster(id: string) {
  return pb.collection('posters').delete(id)
}

export async function ensureInitialArtwork() {
  if (!pb.authStore.isValid) return
  const posters = await listPosters()
  await Promise.all(
    posters.map(async (poster) => {
      const artwork = initialArtwork[poster.title]
      if (!artwork || poster.image) return
      try {
        const response = await fetch(artwork)
        if (!response.ok) return
        const blob = await response.blob()
        const slug = artwork.split('/').pop() || 'ilustracao.svg'
        const file = new File([blob], slug, { type: 'image/svg+xml' })
        const data = new FormData()
        data.set('image', file)
        await pb.collection<Poster>('posters').update(poster.id, data)
      } catch {
        // A arte local continua disponível como alternativa silenciosa.
      }
    }),
  )
}
