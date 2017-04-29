import { AUTHENTICATE, FETCH, INVALIDATE_SESSION } from '../src/actionTypes'
import * as actions from '../src/actions'

describe('actions', () => {
  describe('invalidateSession', () => {
    it('returns action that invalidates session', () => {
      const expected = { type: INVALIDATE_SESSION }

      const action = actions.invalidateSession()

      expect(action).toEqual(expected)
    })
  })

  describe('authenticate', () => {
    it('returns action that describes authentication', () => {
      const authenticator = 'test-authenticator'
      const payload = { email: 'test@test.com', password: 'password' }
      const expected = {
        type: AUTHENTICATE,
        meta: { authenticator },
        payload
      }

      const action = actions.authenticate(authenticator, payload)

      expect(action).toEqual(expected)
    })
  })

  describe('fetch', () => {
    it('returns action that describes fetch request', () => {
      const expected = {
        type: FETCH,
        payload: { url: 'https://test.com', options: {}}
      }

      const action = actions.fetch('https://test.com')

      expect(action).toEqual(expected)
    })

    it('sets request options in payload', () => {
      const expected = {
        type: FETCH,
        payload: {
          url: 'https://test.com',
          options: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          }
        }
      }

      const action = actions.fetch('https://test.com', {
        authorizer: 'jwt',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      expect(action).toEqual(expected)
    })
  })
})
