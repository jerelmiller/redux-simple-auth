import createLocalStorageStore from './storage/localStorage'
import { AUTHENTICATE } from './actionTypes'
import { authenticateSucceeded } from './actions'

const createAuthMiddleware = (config = {}) => {
  const storage = config.storage || createLocalStorageStore()
  const authenticators = config.authenticators || []

  const findAuthenticator = name =>
    authenticators.find(authenticator => authenticator.name === name)

  return ({ dispatch, getState }) => next => async action => {
    const { session: prevSession } = getState()

    if (action.type === AUTHENTICATE) {
      const authenticator = findAuthenticator(action.authenticator)
      const data = await authenticator.authenticate(action.payload)

      storage.persist({
        authenticator: action.authenticator,
        authenticated: data
      })

      return dispatch(authenticateSucceeded())
    }

    next(action)

    const { session } = getState()

    if (prevSession.isAuthenticated && !session.isAuthenticated) {
      storage.clear()
    }
  }
}

export default createAuthMiddleware
