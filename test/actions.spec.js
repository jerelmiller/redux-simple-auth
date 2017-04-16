import { INVALIDATE_SESSION } from '../src/actionTypes'
import * as actions from '../src/actions'

describe('actions', () => {
  describe('invalidateSession', () => {
    it('returns action that invalidates session', () => {
      const expected = { type: INVALIDATE_SESSION }
      const action = actions.invalidateSession()

      expect(action).toEqual(expected)
    })
  })
})
