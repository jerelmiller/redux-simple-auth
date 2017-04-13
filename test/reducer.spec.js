import { reducer } from '../src'

describe('session reducer', () => {
  it('returns default state when initialized', () => {
    const expected = { isAuthenticated: false, data: {}}
    const state = reducer(undefined, {})

    expect(state).toEqual(expected)
  })
})
