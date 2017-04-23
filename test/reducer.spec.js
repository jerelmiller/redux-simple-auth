import { reducer } from '../src'
import { INVALIDATE_SESSION } from '../src/actionTypes'

describe('session reducer', () => {
  it('returns default state when initialized', () => {
    const expected = { isAuthenticated: false, data: {}}
    const state = reducer(undefined, {})

    expect(state).toEqual(expected)
  })

  it('handles INVALIDATE_SESSION', () => {
    const currentState = { isAuthenticated: true }
    const expected = { isAuthenticated: false }

    const state = reducer(currentState, { type: INVALIDATE_SESSION })

    expect(state).toEqual(expected)
  })
})
