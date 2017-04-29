import createAdaptiveStore from './storage/adaptive'
import { AUTHENTICATE, FETCH } from './actionTypes'
import {
  authenticateFailed,
  authenticateSucceeded,
  restore,
  restoreFailed
} from './actions'

export default (config = {}) => {
  const storage = config.storage || createAdaptiveStore()
  const authenticators = config.authenticators || []

  const findAuthenticator = name =>
    authenticators.find(authenticator => authenticator.name === name)

  return ({ dispatch, getState }) => {
    const { authenticated = {}} = storage.restore()
    const { authenticator: authenticatorName, ...data } = authenticated
    const authenticator = findAuthenticator(authenticatorName)

    if (authenticator) {
      authenticator
        .restore(data)
        .then(
          () => dispatch(restore(authenticated)),
          () => dispatch(restoreFailed())
        )
    }

    return next => action => {
      switch (action.type) {
        case AUTHENTICATE: {
          const authenticator = findAuthenticator(action.meta.authenticator)

          if (!authenticator) {
            throw new Error(
              `No authenticator with name \`${action.meta.authenticator}\` ` +
              'was found. Be sure you have defined it in the authenticators ' +
              'config.'
            )
          }

          return authenticator
            .authenticate(action.payload)
            .then(
              data => dispatch(authenticateSucceeded(authenticator.name, data)),
              () => dispatch(authenticateFailed())
            )
        }
        case FETCH: {
          const { url } = action.payload

          return fetch(url)
        }
        default: {
          const { session: prevSession } = getState()
          next(action)
          const { session } = getState()

          if (session.data !== prevSession.data) {
            const { authenticator, data } = session

            storage.persist({ authenticated: { ...data, authenticator }})
          }
        }
      }
    }
  }
}
