import pb from '@/lib/pocketbase/client'
import { posterPageMap, renderPdfPageToDataUrl } from '@/services/pdfArtworks'
import type { Poster } from '@/types/library'

export const initialArtwork: Record<string, string> = {
  'O Chamado para o Tatame': '/posters/dia-a-dia-chamado.svg',
  'Cumprimento com o Amigo Léo': '/posters/dia-a-dia-cumprimento.svg',
  'Montada Alta': '/posters/montada-alta.svg',
  'Da Montada para as Costas': '/posters/montada-para-costas.svg',
  'Estabilizar os Cem-Quilos': '/posters/cem-quilos.svg',
  'Celebração e Abraço no Tatame': '/posters/dia-a-dia-vitoria.svg',
  'A Vitória do Aprendizado e o Abraço': '/posters/dia-a-dia-vitoria.svg',
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

export function getPosterPageNumber(poster: Poster): number | undefined {
  return posterPageMap[poster.title]
}

export function savePoster(
  values: {
    title: string
    kid_text: string
    dad_tip: string
    caption?: string
    kind?: 'historia' | 'posicao'
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
  if (values.caption !== undefined) data.set('caption', values.caption)
  if (values.kind) data.set('kind', values.kind)
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

  // Assegurar também que se a História 1 tiver apenas 2 quadros semeados antigos,
  // criamos os novos quadros da história se ainda não existirem no backend
  const chapters = await pb.collection('chapters').getFullList({ sort: 'order' })
  const chapter1 = chapters[0]
  if (chapter1) {
    const existingTitles = new Set(posters.map((p) => p.title))
    const initialStoryPanels = [
      {
        title: 'O Chamado para o Tatame',
        order: 1,
        kind: 'historia' as const,
        caption:
          'Sábado de manhã! Álexis acorda animado, amarra a faixa e chama o papai para o treino.',
        kid_text:
          'Coloque o kimono, ajuste a faixa e respire fundo: hoje é dia de aventura no tatame!',
        dad_tip:
          'Incentive o hábito com leveza e alegria. Ajude o Álexis a colocar o kimono e valorize o entusiasmo dele antes de qualquer técnica.',
      },
      {
        title: 'Cumprimento com o Amigo Léo',
        order: 2,
        kind: 'historia' as const,
        caption:
          'No tatame, o amigo de treino Léo já está esperando. Antes de rolar: "OSS!" e um toque de punhos com respeito.',
        kid_text:
          'No Jiu-Jitsu, o respeito vem em primeiro lugar! Cumprimente seu parceiro com um "OSS" bem firme.',
        dad_tip:
          'Ensine que no tatame não há adversários perigosos, mas parceiros de aprendizado mútuo. Reforce o cumprimento e o cuidado com o amigo.',
      },
      {
        title: 'Celebração e Abraço no Tatame',
        order: 6,
        kind: 'historia' as const,
        caption:
          'Fim do treino! O papai reúne Álexis e Léo num abraço cheio de orgulho: "Vocês deram um show de Jiu-Jitsu!".',
        kid_text:
          'Parabéns, campeão! Mais um treino concluído, amizade fortalecida e você está mais perto da próxima faixa!',
        dad_tip:
          'Celebre cada pequeno progresso. Elogie a dedicação, a atitude respeitosa e a coragem de tentar posições novas.',
      },
    ]

    for (const panel of initialStoryPanels) {
      if (!existingTitles.has(panel.title)) {
        try {
          const artwork = initialArtwork[panel.title]
          let file: File | undefined
          if (artwork) {
            const resp = await fetch(artwork)
            if (resp.ok) {
              const blob = await resp.blob()
              file = new File([blob], `${panel.title}.svg`, { type: 'image/svg+xml' })
            }
          }
          await savePoster({
            title: panel.title,
            kid_text: panel.kid_text,
            dad_tip: panel.dad_tip,
            caption: panel.caption,
            kind: panel.kind,
            chapter: chapter1.id,
            order: panel.order,
            image: file,
          })
        } catch {
          // Ignorar se houver restrição ou offline
        }
      }
    }
  }

  // Enviar imagens do PDF em lote controlado em segundo plano
  // para persistir de vez os quadros no PocketBase
  const withoutImage = posters.filter((p) => !p.image && posterPageMap[p.title])
  const queue = withoutImage.slice(0, 15)
  for (const p of queue) {
    const pageNum = posterPageMap[p.title]
    if (!pageNum) continue
    try {
      const dataUrl = await renderPdfPageToDataUrl(pageNum)
      if (!dataUrl) continue
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      const file = new File([blob], `pagina-${pageNum}.jpg`, { type: 'image/jpeg' })
      const data = new FormData()
      data.set('image', file)
      await pb.collection<Poster>('posters').update(p.id, data)
    } catch {
      // Ignora se der erro ou sem conexão
    }
  }
}
