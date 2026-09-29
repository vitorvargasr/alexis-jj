import pb from '@/lib/pocketbase/client'
import type { Chapter } from '@/types/library'

export function listChapters() {
  return pb.collection<Chapter>('chapters').getFullList({ sort: 'order' })
}

export function getChapter(id: string) {
  return pb.collection<Chapter>('chapters').getOne(id)
}

export function chapterCoverUrl(chapter: Chapter, thumb = '480x320') {
  return chapter.cover ? pb.files.getURL(chapter, chapter.cover, { thumb }) : ''
}

export function saveChapter(
  values: {
    title: string
    description: string
    emoji: string
    order: number
    cover?: File | null
  },
  id?: string,
) {
  const data = new FormData()
  data.set('title', values.title)
  data.set('description', values.description)
  data.set('emoji', values.emoji)
  data.set('order', String(values.order))
  if (values.cover) data.set('cover', values.cover)
  return id
    ? pb.collection<Chapter>('chapters').update(id, data)
    : pb.collection<Chapter>('chapters').create(data)
}

export function removeChapter(id: string) {
  return pb.collection('chapters').delete(id)
}

export function updateChapterOrder(id: string, order: number) {
  return pb.collection<Chapter>('chapters').update(id, { order })
}
