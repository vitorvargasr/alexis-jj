import type { RecordModel } from 'pocketbase'

export interface Chapter extends RecordModel {
  title: string
  description: string
  emoji: string
  order: number
  cover: string
}

export interface Poster extends RecordModel {
  title: string
  kid_text: string
  dad_tip: string
  caption?: string
  kind?: 'historia' | 'posicao'
  image: string
  chapter: string
  order: number
}

export interface PosterProgress extends RecordModel {
  poster: string
  user: string
  learned: boolean
  stars: number
}

export type AppMode = 'kid' | 'dad'

export interface BeltLevel {
  order: number
  name: string
  shortName: string
  baseColor: string
  stripeColor?: string
  tipColor?: string
  textColor: string
  description: string
}

export interface BeltAchievement extends RecordModel {
  user: string
  belt_order: number
  achieved_at?: string
}

export interface TrainingDay extends RecordModel {
  user: string
  day: string // 'YYYY-MM-DD'
  trained: boolean
  stars: number // 0-3
  note?: string
}

export interface WeeklyGoal extends RecordModel {
  user: string
  week_start: string // 'YYYY-MM-DD' (segunda-feira da semana)
  goal: string
}

export interface HomeDrillProgressRecord extends RecordModel {
  user: string
  day_number: number // 1 a 30
  done: boolean
  done_at?: string
  nota?: number // 1 a 5
  calm_checked?: boolean
  painless_checked?: boolean
  fun_checked?: boolean
  notes?: string
}
