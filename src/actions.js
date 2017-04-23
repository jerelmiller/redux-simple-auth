import {
  AUTHENTICATE,
  AUTHENTICATE_FAILED,
  AUTHENTICATE_SUCCEEDED,
  INVALIDATE_SESSION,
  RESTORE,
  RESTORE_FAILED
} from './actionTypes'

export const authenticate = (authenticator, payload) => ({
  type: AUTHENTICATE,
  authenticator,
  payload
})

export const authenticateSucceeded = (authenticator, payload) => ({
  type: AUTHENTICATE_SUCCEEDED,
  authenticator,
  payload
})

export const authenticateFailed = () => ({
  type: AUTHENTICATE_FAILED
})

export const invalidateSession = () => ({
  type: INVALIDATE_SESSION
})

export const restore = payload => ({
  type: RESTORE,
  payload
})

export const restoreFailed = () => ({
  type: RESTORE_FAILED
})
