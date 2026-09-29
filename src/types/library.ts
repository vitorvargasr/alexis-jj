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
  name: string
  color: string
  textColor: string
  min: number
  max: number
}
