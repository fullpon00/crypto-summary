import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FearGreedMeter } from '../market/FearGreedMeter'

describe('FearGreedMeter', () => {
  it('renders value and label', () => {
    render(<FearGreedMeter value={37} label="Fear" previousValue={42} previousLabel="Fear" />)
    expect(screen.getByText('37')).toBeInTheDocument()
    expect(screen.getByText('Fear')).toBeInTheDocument()
  })

  it('renders previous value', () => {
    render(<FearGreedMeter value={37} label="Fear" previousValue={42} previousLabel="Fear" />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('shows negative delta when value decreased', () => {
    render(<FearGreedMeter value={37} label="Fear" previousValue={42} previousLabel="Fear" />)
    expect(screen.getByText('-5')).toBeInTheDocument()
  })
})
