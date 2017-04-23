import {
  AUTHENTICATE,
  AUTHENTICATE_FAILED,
  AUTHENTICATE_SUCCEEDED,
  INVALIDATE_SESSION
} from './actionTypes'

export const authenticate = (authenticator, payload) => ({
  type: AUTHENTICATE,
  authenticator,
  payload
})

export const authenticateSucceeded = payload => ({
  type: AUTHENTICATE_SUCCEEDED,
  payload
})

export const authenticateFailed = () => ({
  type: AUTHENTICATE_FAILED
})

export const invalidateSession = () => ({
  type: INVALIDATE_SESSION
})
