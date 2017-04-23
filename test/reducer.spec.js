import { reducer } from '../src'
import {
  AUTHENTICATE_FAILED,
  AUTHENTICATE_SUCCEEDED,
  INVALIDATE_SESSION,
  RESTORE,
  RESTORE_FAILED
} from '../src/actionTypes'

describe('session reducer', () => {
  it('returns default state when initialized', () => {
    const expected = {
      authenticator: null,
      isAuthenticated: false,
      data: {}
    }
    const state = reducer(undefined, {})

    expect(state).toEqual(expected)
  })

  it('handles INVALIDATE_SESSION', () => {
    const currentState = { isAuthenticated: true, data: { token: 'abcdefg' }}
    const expected = {
      authenticator: null,
      isAuthenticated: false,
      data: {}
    }

    const state = reducer(currentState, { type: INVALIDATE_SESSION })

    expect(state).toEqual(expected)
  })

  it('handles AUTHENTICATE_SUCCEEDED', () => {
    const currentState = { isAuthenticated: false }
    const expected = {
      isAuthenticated: true,
      authenticator: 'test',
      data: { token: 'abcdefg' }
    }

    const state = reducer(currentState, {
      type: AUTHENTICATE_SUCCEEDED,
      authenticator: 'test',
      payload: {
        token: 'abcdefg'
      }
    })

    expect(state).toEqual(expected)
  })

  it('handles AUTHENTICATE_FAILED', () => {
    const currentState = { isAuthenticated: false, data: {} }
    const expected = { authenticator: null, isAuthenticated: false, data: {}}

    const state = reducer(currentState, {
      type: AUTHENTICATE_FAILED
    })

    expect(state).toEqual(expected)
  })

  it('handles RESTORE', () => {
    const currentState = reducer(undefined, {})
    const expected = {
      authenticator: 'credentials',
      isAuthenticated: true,
      data: { token: '1234' }
    }

    const state = reducer(currentState, {
      type: RESTORE,
      payload: {
        authenticator: 'credentials',
        token: '1234'
      }
    })

    expect(state).toEqual(expected)
  })

  it('handles RESTORE_FAILED', () => {
    const currentState = reducer(undefined, {})
    const expected = {
      authenticator: null,
      isAuthenticated: false,
      data: {}
    }

    const state = reducer(currentState, {
      type: RESTORE_FAILED
    })

    expect(state).toEqual(expected)
  })
})
