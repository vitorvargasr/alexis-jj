import pb from '@/lib/pocketbase/client'
import type { PosterProgress } from '@/types/library'

export function listProgress(userId: string) {
  return pb.collection<PosterProgress>('poster_progress').getFullList({
    filter: pb.filter('user = {:user}', { user: userId }),
    sort: 'updated',
  })
}

export async function earnStar(posterId: string, userId: string) {
  try {
    const current = await pb
      .collection<PosterProgress>('poster_progress')
      .getFirstListItem(
        pb.filter('poster = {:poster} && user = {:user}', { poster: posterId, user: userId }),
      )
    return pb.collection<PosterProgress>('poster_progress').update(current.id, {
      learned: true,
      stars: Math.min(3, Number(current.stars || 0) + 1),
    })
  } catch (error) {
    if (typeof error === 'object' && error && 'status' in error && error.status !== 404) throw error
    return pb.collection<PosterProgress>('poster_progress').create({
      poster: posterId,
      user: userId,
      learned: true,
      stars: 1,
    })
  }
}
