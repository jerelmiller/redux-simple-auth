import { reducer } from '../src'
import {
  AUTHENTICATE_SUCCEEDED,
  INVALIDATE_SESSION
} from '../src/actionTypes'

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

  it('handles AUTHENTICATE_SUCCEEDED', () => {
    const currentState = { isAuthenticated: false }
    const expected = { isAuthenticated: true, data: { token: 'abcdefg' }}

    const state = reducer(currentState, {
      type: AUTHENTICATE_SUCCEEDED,
      payload: {
        token: 'abcdefg'
      }
    })

    expect(state).toEqual(expected)
  })
})
