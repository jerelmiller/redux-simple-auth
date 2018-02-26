import {
  AUTHENTICATE,
  AUTHENTICATE_FAILED,
  AUTHENTICATE_SUCCEEDED,
  FETCH,
  INITIALIZE,
  INVALIDATE_SESSION,
  INVALIDATE_SESSION_FAILED,
  UPDATE_SESSION,
  RESET,
  RESTORE,
  RESTORE_FAILED
} from './actionTypes'

export const authenticate = (authenticator, payload) => ({
  type: AUTHENTICATE,
  meta: { authenticator },
  payload
})

export const authenticateSucceeded = (authenticator, payload) => ({
  type: AUTHENTICATE_SUCCEEDED,
  meta: { authenticator },
  payload
})

export const authenticateFailed = payload => ({
  type: AUTHENTICATE_FAILED,
  payload
})

export const fetch = (url, options) => ({
  type: FETCH,
  payload: { url, options }
})

export const reset = () => ({
  type: RESET
})

export const invalidateSession = () => ({
  type: INVALIDATE_SESSION
})

export const invalidateSessionFailed = () => ({
  type: INVALIDATE_SESSION_FAILED
})

export const updateSession = payload => ({
  type: UPDATE_SESSION,
  payload
})

export const restore = payload => ({
  type: RESTORE,
  payload
})

export const restoreFailed = () => ({
  type: RESTORE_FAILED
})

export const initialize = payload => ({
  type: INITIALIZE,
  payload
})
