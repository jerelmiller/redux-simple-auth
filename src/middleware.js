import createLocalStorageStore from './storage/localStorage'
import { AUTHENTICATE } from './actionTypes'
import { authenticateSucceeded } from './actions'

const createAuthMiddleware = (config = {}) => {
  const storage = config.storage || createLocalStorageStore()
  const authenticators = config.authenticators || []

  const findAuthenticator = name =>
    authenticators.find(authenticator => authenticator.name === name)

  return ({ dispatch, getState }) => next => action => {
    const { session: prevSession } = getState()

    if (action.type === AUTHENTICATE) {
      return findAuthenticator(action.authenticator)
        .authenticate(action.payload)
        .then(data => {
          storage.persist({
            authenticator: action.authenticator,
            authenticated: data
          })

          dispatch(authenticateSucceeded())
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
