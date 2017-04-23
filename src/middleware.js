import createLocalStorageStore from './storage/localStorage'
import { AUTHENTICATE } from './actionTypes'
import { authenticateFailed, authenticateSucceeded } from './actions'

const createAuthMiddleware = (config = {}) => {
  const storage = config.storage || createLocalStorageStore()
  const authenticators = config.authenticators || []

  const findAuthenticator = name =>
    authenticators.find(authenticator => authenticator.name === name)

  return ({ dispatch, getState }) => {
    storage.restore()

    return next => async action => {
      switch (action.type) {
        case AUTHENTICATE:
          const authenticator = findAuthenticator(action.authenticator)
          try {
            const data = await authenticator.authenticate(action.payload)
            storage.persist({
              authenticator: action.authenticator,
              authenticated: data
            })

            dispatch(authenticateSucceeded(data))
          } catch(e) {
            storage.clear()
            dispatch(authenticateFailed())
          }
          return
        default:
          const { session: prevSession } = getState()

          next(action)

          const { session } = getState()

          if (prevSession.isAuthenticated && !session.isAuthenticated) {
            storage.clear()
          }
      }
    }
  }
}

export default createAuthMiddleware
