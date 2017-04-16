import createLocalStorageStore from './sessionStores/localStorage'
import { AUTHENTICATE } from './actionTypes'

const createAuthMiddleware = (config = {}) => {
  const storage = config.storage || createLocalStorageStore()
  const authenticators = config.authenticators || []

  const findAuthenticator = name =>
    authenticators.find(authenticator => authenticator.name === name)

  return ({ getState }) => next => action => {
    const { session: prevSession } = getState()

    if (action.type === AUTHENTICATE) {
      findAuthenticator(action.authenticator).authenticate(action.payload)
    } else {
      next(action)
    }

    const { session } = getState()

    if (prevSession.isAuthenticated && !session.isAuthenticated) {
      storage.clear()
    }
  }
}

export default createAuthMiddleware
