import pb from '@/lib/pocketbase/client'
import type { HomeDrillProgressRecord } from '@/types/library'

export async function listHomeDrillProgress(userId?: string): Promise<HomeDrillProgressRecord[]> {
  const uid = userId || pb.authStore.record?.id
  if (!uid) return []

  try {
    const list = await pb.collection('home_drill_progress').getFullList<HomeDrillProgressRecord>({
      filter: `user="${uid}"`,
      sort: 'day_number',
    })
    return list
  } catch (err) {
    console.warn('Erro ao carregar progresso dos drills em casa:', err)
    return []
  }
}

export async function saveHomeDrillProgress(
  dayNumber: number,
  data: {
    done?: boolean
    nota?: number
    calm_checked?: boolean
    painless_checked?: boolean
    fun_checked?: boolean
    notes?: string
  },
  userId?: string,
): Promise<HomeDrillProgressRecord | null> {
  const uid = userId || pb.authStore.record?.id
  if (!uid) return null

  try {
    // Procura registro existente do usuário para este dia
    let existing: HomeDrillProgressRecord | null = null
    try {
      existing = await pb
        .collection('home_drill_progress')
        .getFirstListItem<HomeDrillProgressRecord>(`user="${uid}" && day_number=${dayNumber}`)
    } catch {
      // Nenhum existente
    }

    const payload: Record<string, any> = {
      user: uid,
      day_number: dayNumber,
      ...data,
    }

    if (data.done !== undefined) {
      payload.done = data.done
      if (data.done) {
        payload.done_at = new Date().toISOString()
      }
    }

    if (existing) {
      const updated = await pb
        .collection('home_drill_progress')
        .update<HomeDrillProgressRecord>(existing.id, payload)
      return updated
    } else {
      const created = await pb
        .collection('home_drill_progress')
        .create<HomeDrillProgressRecord>(payload)
      return created
    }
  } catch (err) {
    console.error(`Erro ao salvar progresso do dia ${dayNumber}:`, err)
    throw err
  }
}
