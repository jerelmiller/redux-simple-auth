import createLocalStorageStore from './storage/localStorage'
import { AUTHENTICATE } from './actionTypes'

const createAuthMiddleware = (config = {}) => {
  const storage = config.storage || createLocalStorageStore()
  const authenticators = config.authenticators || []

  const findAuthenticator = name =>
    authenticators.find(authenticator => authenticator.name === name)

  return ({ getState }) => next => action => {
    const { session: prevSession } = getState()

    if (action.type === AUTHENTICATE) {
      return findAuthenticator(action.authenticator)
        .authenticate(action.payload)
        .then(data => {
          storage.persist({
            authenticator: action.authenticator,
            authenticated: data
          })
        })
    }

    next(action)

    const { session } = getState()

    if (prevSession.isAuthenticated && !session.isAuthenticated) {
      storage.clear()
    }
  }
}

export default createAuthMiddleware
