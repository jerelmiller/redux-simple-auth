import { AUTHENTICATE, INVALIDATE_SESSION } from './actionTypes'

export const authenticate = (authenticator, payload) => ({
  type: AUTHENTICATE,
  authenticator,
  payload
})

export const invalidateSession = () => ({
  type: INVALIDATE_SESSION
})
