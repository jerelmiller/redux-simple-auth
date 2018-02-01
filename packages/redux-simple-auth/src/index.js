import * as _actionTypes from './actionTypes'

export { default as createAuthMiddleware } from './middleware'
export { default as reducer } from './reducer'
export { default as createAuthenticator } from './createAuthenticator'
export { authenticate, fetch, invalidateSession } from './actions'
export { default as createAdaptiveStore } from './storage/adaptive'
export { default as createLocalStorageStore } from './storage/localStorage'
export { default as createSessionStorageStore } from './storage/sessionStorage'
export { default as createCookieStore } from './storage/cookie'
export { default as getInitialAuthState } from './enhancer'
export { default as storage } from './storage/default'
export {
  getSessionData,
  getIsAuthenticated,
  getAuthenticator,
  getIsRestored,
  getLastError,
  getHasFailedAuth
} from './selectors'

export const actionTypes = _actionTypes
