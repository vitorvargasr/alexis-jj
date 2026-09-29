import pb from '@/lib/pocketbase/client'
import type { BeltAchievement, TrainingDay, WeeklyGoal } from '@/types/library'

/* ==================== BELT ACHIEVEMENTS ==================== */

export async function listBeltAchievements(userId?: string): Promise<BeltAchievement[]> {
  try {
    const filter = userId ? `user = "${userId}"` : ''
    const records = await pb.collection('belt_achievements').getFullList<BeltAchievement>({
      filter,
      sort: 'belt_order',
      requestKey: null,
    })
    return records
  } catch (error) {
    console.error('Erro ao listar conquistas de faixas:', error)
    return []
  }
}

export async function setBeltAchievement(
  userId: string,
  beltOrder: number,
  achieved: boolean,
  achievedAt?: string,
): Promise<BeltAchievement | null> {
  try {
    // Procura existente
    const existing = await pb
      .collection('belt_achievements')
      .getFirstListItem<BeltAchievement>(`user = "${userId}" && belt_order = ${beltOrder}`, {
        requestKey: null,
      })
      .catch(() => null)

    if (!achieved) {
      if (existing) {
        await pb.collection('belt_achievements').delete(existing.id)
      }
      return null
    }

    const payload = {
      user: userId,
      belt_order: beltOrder,
      achieved_at: achievedAt || new Date().toISOString().slice(0, 10),
    }

    if (existing) {
      return await pb.collection('belt_achievements').update<BeltAchievement>(existing.id, payload)
    }
    return await pb.collection('belt_achievements').create<BeltAchievement>(payload)
  } catch (error) {
    console.error('Erro ao atualizar conquista de faixa:', error)
    throw error
  }
}

/* ==================== TRAINING DAYS ==================== */

export async function listTrainingDays(
  userId: string,
  startDate?: string,
  endDate?: string,
): Promise<TrainingDay[]> {
  try {
    const filters = [`user = "${userId}"`]
    if (startDate) filters.push(`day >= "${startDate}"`)
    if (endDate) filters.push(`day <= "${endDate}"`)

    const records = await pb.collection('training_days').getFullList<TrainingDay>({
      filter: filters.join(' && '),
      sort: 'day',
      requestKey: null,
    })
    return records
  } catch (error) {
    console.error('Erro ao listar dias de treino:', error)
    return []
  }
}

export async function saveTrainingDay(
  userId: string,
  day: string, // YYYY-MM-DD
  data: { trained?: boolean; stars?: number; note?: string },
): Promise<TrainingDay> {
  try {
    const existing = await pb
      .collection('training_days')
      .getFirstListItem<TrainingDay>(`user = "${userId}" && day = "${day}"`, {
        requestKey: null,
      })
      .catch(() => null)

    const payload = {
      user: userId,
      day,
      trained: data.trained ?? false,
      stars: data.stars ?? 0,
      note: data.note ?? '',
    }

    if (existing) {
      return await pb.collection('training_days').update<TrainingDay>(existing.id, payload)
    }
    return await pb.collection('training_days').create<TrainingDay>(payload)
  } catch (error) {
    console.error('Erro ao salvar dia de treino:', error)
    throw error
  }
}

/* ==================== WEEKLY GOALS ==================== */

export async function getWeeklyGoal(userId: string, weekStart: string): Promise<WeeklyGoal | null> {
  try {
    return await pb
      .collection('weekly_goals')
      .getFirstListItem<WeeklyGoal>(`user = "${userId}" && week_start = "${weekStart}"`, {
        requestKey: null,
      })
  } catch {
    return null
  }
}

export async function listWeeklyGoals(userId: string): Promise<WeeklyGoal[]> {
  try {
    return await pb.collection('weekly_goals').getFullList<WeeklyGoal>({
      filter: `user = "${userId}"`,
      sort: '-week_start',
      requestKey: null,
    })
  } catch (error) {
    console.error('Erro ao listar metas semanais:', error)
    return []
  }
}

export async function saveWeeklyGoal(
  userId: string,
  weekStart: string,
  goal: string,
): Promise<WeeklyGoal> {
  try {
    const existing = await pb
      .collection('weekly_goals')
      .getFirstListItem<WeeklyGoal>(`user = "${userId}" && week_start = "${weekStart}"`, {
        requestKey: null,
      })
      .catch(() => null)

    const payload = {
      user: userId,
      week_start: weekStart,
      goal,
    }

    if (existing) {
      return await pb.collection('weekly_goals').update<WeeklyGoal>(existing.id, payload)
    }
    return await pb.collection('weekly_goals').create<WeeklyGoal>(payload)
  } catch (error) {
    console.error('Erro ao salvar meta da semana:', error)
    throw error
  }
}
