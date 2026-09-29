import type { BeltLevel } from '@/types/library'

/**
 * As 7 faixas infantis de Jiu-Jitsu mostradas nas imagens de referência:
 * 1. Branca
 * 2. Cinza e Branca (cinza com listra central branca)
 * 3. Cinza
 * 4. Cinza e Preta (cinza com listra/tarja preta)
 * 5. Amarela e Branca (amarela com listra central branca)
 * 6. Amarela
 * 7. Amarela e Preta (amarela com ponteira/tarja preta)
 */
export const HOME_BELTS: BeltLevel[] = [
  {
    order: 1,
    name: 'Branca',
    shortName: 'Branca',
    baseColor: '#FFFFFF',
    textColor: '#1E3A5F',
    description: 'O início corajoso da jornada no tatame!',
  },
  {
    order: 2,
    name: 'Cinza e Branca',
    shortName: 'Cinza/Branca',
    baseColor: '#9CA3AF',
    stripeColor: '#FFFFFF',
    textColor: '#1E3A5F',
    description: 'Primeira grande conquista de casa!',
  },
  {
    order: 3,
    name: 'Cinza',
    shortName: 'Cinza',
    baseColor: '#6B7280',
    textColor: '#FFFFFF',
    description: 'Firmeza e foco em cada posição!',
  },
  {
    order: 4,
    name: 'Cinza e Preta',
    shortName: 'Cinza/Preta',
    baseColor: '#6B7280',
    tipColor: '#111827',
    textColor: '#FFFFFF',
    description: 'Evolução constante com respeito!',
  },
  {
    order: 5,
    name: 'Amarela e Branca',
    shortName: 'Amarela/Branca',
    baseColor: '#F5C842',
    stripeColor: '#FFFFFF',
    textColor: '#5C4300',
    description: 'Brilhando cada vez mais no treino!',
  },
  {
    order: 6,
    name: 'Amarela',
    shortName: 'Amarela',
    baseColor: '#F5C842',
    textColor: '#5C4300',
    description: 'Dedicação e amor pelo Jiu-Jitsu!',
  },
  {
    order: 7,
    name: 'Amarela e Preta',
    shortName: 'Amarela/Preta',
    baseColor: '#F5C842',
    tipColor: '#111827',
    textColor: '#5C4300',
    description: 'Campeão da disciplina e da amizade!',
  },
]

export const beltLevels = HOME_BELTS

/**
 * Retorna a faixa atual a partir das conquistas salvas ou do fallback de leitura
 */
export function getCurrentBelt(achievedOrders: number[]): BeltLevel {
  if (!achievedOrders || achievedOrders.length === 0) {
    return HOME_BELTS[0]
  }
  const maxOrder = Math.max(...achievedOrders)
  return HOME_BELTS.find((b) => b.order === maxOrder) || HOME_BELTS[0]
}

/**
 * Fallback para percentual quando ainda não há marcações manuais
 */
export function getBeltLevel(percentage: number): BeltLevel {
  if (percentage <= 14) return HOME_BELTS[0]
  if (percentage <= 28) return HOME_BELTS[1]
  if (percentage <= 42) return HOME_BELTS[2]
  if (percentage <= 57) return HOME_BELTS[3]
  if (percentage <= 71) return HOME_BELTS[4]
  if (percentage <= 85) return HOME_BELTS[5]
  return HOME_BELTS[6]
}

export function progressPercentage(learned: number, total: number) {
  return total > 0 ? Math.round((learned / total) * 100) : 0
}
