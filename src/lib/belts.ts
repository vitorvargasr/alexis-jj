import type { BeltLevel } from '@/types/library'

export const beltLevels: BeltLevel[] = [
  { name: 'Branca', color: '#FFFFFF', textColor: '#1E3A5F', min: 0, max: 25 },
  { name: 'Cinza', color: '#AEB7C2', textColor: '#1E3A5F', min: 26, max: 50 },
  { name: 'Amarela', color: '#F5C842', textColor: '#5C4300', min: 51, max: 75 },
  { name: 'Laranja', color: '#EE8A31', textColor: '#FFFFFF', min: 76, max: 99 },
  { name: 'Verde', color: '#2F9E6E', textColor: '#FFFFFF', min: 100, max: 100 },
]

export function getBeltLevel(percentage: number) {
  return (
    beltLevels.find((belt) => percentage >= belt.min && percentage <= belt.max) || beltLevels[0]
  )
}

export function progressPercentage(learned: number, total: number) {
  return total > 0 ? Math.round((learned / total) * 100) : 0
}
