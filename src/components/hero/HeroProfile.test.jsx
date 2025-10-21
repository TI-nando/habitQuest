import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeroProfile from './HeroProfile'

const mockHeroData = {
  name: 'Test Hero',
  level: 5,
  gold: 150,
  energy: 80,
  maxEnergy: 100,
  avatar: '🧙‍♂️'
}

const mockGetXPProgress = vi.fn(() => ({
  current: 75,
  needed: 100,
  percentage: 75
}))

describe('HeroProfile', () => {
  it('renders hero information correctly', () => {
    render(
      <HeroProfile 
        heroData={mockHeroData} 
        getXPProgress={mockGetXPProgress}
      />
    )

    expect(screen.getByText('Test Hero')).toBeInTheDocument()
    expect(screen.getByText('Nível 5')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument() // Gold
    expect(screen.getByText('80/100')).toBeInTheDocument() // Energy
  })

  it('displays XP progress correctly', () => {
    render(
      <HeroProfile 
        heroData={mockHeroData} 
        getXPProgress={mockGetXPProgress}
      />
    )

    expect(screen.getByText('75')).toBeInTheDocument()
    expect(screen.getByText('/100 XP')).toBeInTheDocument()
  })

  it('shows hero avatar', () => {
    render(
      <HeroProfile 
        heroData={mockHeroData} 
        getXPProgress={mockGetXPProgress}
      />
    )

    expect(screen.getByText('🧙‍♂️')).toBeInTheDocument()
  })
})