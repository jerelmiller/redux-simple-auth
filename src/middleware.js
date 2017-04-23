import createLocalStorageStore from './storage/localStorage'
import { AUTHENTICATE } from './actionTypes'
import { authenticateFailed, authenticateSucceeded, restore } from './actions'

const createAuthMiddleware = (config = {}) => {
  const storage = config.storage || createLocalStorageStore()
  const authenticators = config.authenticators || []

  const findAuthenticator = name =>
    authenticators.find(authenticator => authenticator.name === name)

  return ({ dispatch, getState }) => {
    storage
      .restore()
      .then(({ authenticated = {}}) => {
        const authenticator = findAuthenticator(authenticated.authenticator)

        if (authenticator) {
          return authenticator
            .restore(authenticated)
            .then(() => dispatch(restore(authenticated)))
        }
      })

    return next => action => {
      switch (action.type) {
        case AUTHENTICATE:
          const authenticator = findAuthenticator(action.authenticator)

          return authenticator
            .authenticate(action.payload)
            .then(data => {
              storage.persist({
                authenticated: {
                  ...data,
                  authenticator: action.authenticator
                }
              })

              dispatch(authenticateSucceeded(authenticator.name, data))
            }, () => {
              storage.clear()
              dispatch(authenticateFailed())
            })
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
