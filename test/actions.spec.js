import { AUTHENTICATE, INVALIDATE_SESSION } from '../src/actionTypes'
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
      const expected = { type: AUTHENTICATE, authenticator, payload }

      const action = actions.authenticate(authenticator, payload)

      expect(action).toEqual(expected)
    })
  })
})
