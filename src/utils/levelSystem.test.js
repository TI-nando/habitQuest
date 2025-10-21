import { describe, it, expect } from 'vitest'
import { 
  calculateLevelFromXP, 
  calculateXPForNextLevel,
  calculateLevelProgress,
  checkLevelUp
} from './levelSystem'

describe('Level System Utils', () => {
  describe('calculateLevelFromXP', () => {
    it('calculates correct level for given XP', () => {
      expect(calculateLevelFromXP(0)).toBe(1)
      expect(calculateLevelFromXP(100)).toBe(2)
      expect(calculateLevelFromXP(220)).toBe(3) // 100 + 120
      expect(calculateLevelFromXP(364)).toBe(4) // 100 + 120 + 144
    })
  })

  describe('calculateXPForNextLevel', () => {
    it('calculates XP needed for next level', () => {
      expect(calculateXPForNextLevel(1)).toBe(100)
      expect(calculateXPForNextLevel(2)).toBe(120)
      expect(calculateXPForNextLevel(3)).toBe(144)
    })
  })

  describe('calculateLevelProgress', () => {
    it('calculates progress within current level', () => {
      const progress = calculateLevelProgress(150, 2)
      expect(progress.current).toBe(50) // 150 - 100 (XP for level 1)
      expect(progress.needed).toBe(120) // XP needed for level 3
      expect(progress.percentage).toBe(41.67) // 50/120 * 100
    })
  })

  describe('checkLevelUp', () => {
    it('detects level up correctly', () => {
      const result = checkLevelUp(1, 150)
      expect(result.leveledUp).toBe(true)
      expect(result.newLevel).toBe(2)
      expect(result.levelsGained).toBe(1)
    })

    it('handles no level up', () => {
      const result = checkLevelUp(1, 50)
      expect(result.leveledUp).toBe(false)
      expect(result.newLevel).toBe(1)
      expect(result.levelsGained).toBe(0)
    })
  })
})