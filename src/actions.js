import {
  AUTHENTICATE,
  AUTHENTICATE_SUCCEEDED,
  INVALIDATE_SESSION
} from './actionTypes'

export const authenticate = (authenticator, payload) => ({
  type: AUTHENTICATE,
  authenticator,
  payload
})

export const authenticateSucceeded = () => ({
  type: AUTHENTICATE_SUCCEEDED
})

export const invalidateSession = () => ({
  type: INVALIDATE_SESSION
})
