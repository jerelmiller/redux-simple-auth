import createAdaptiveStore from './storage/adaptive'
import { AUTHENTICATE, FETCH } from './actionTypes'
import {
  authenticateFailed,
  authenticateSucceeded,
  invalidateSession,
  restore,
  restoreFailed
} from './actions'

export default ({
  authenticator,
  authenticators,
  authorize,
  storage = createAdaptiveStore()
} = {}) => {
  if (authenticator == null && authenticators == null) {
    throw new Error(
      'No authenticator was given. Be sure to configure an authenticator ' +
      'by using the `authenticator` option for a single authenticator or ' +
      'using the `authenticators` option to allow multiple authenticators'
    )
  }

  if (!Array.isArray(authenticators) && authenticator == null) {
    throw new Error(
      'Expected `authenticators` to be an array. If you only need a single ' +
      'authenticator, consider using the `authenticator` option.'
    )
  }

  if (Array.isArray(authenticator) && authenticators == null) {
    throw new Error(
      'Expected `authenticator` to be an object. If you need multiple ' +
      'authenticators, consider using the `authenticators` option.'
    )
  }

  authenticators = authenticators || [].concat(authenticator)

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
          const { session } = getState()
          const { url, options = {}} = action.payload
          const { headers = {}} = options

          if (authorize) {
            authorize(session.data, (name, value) => {
              headers[name] = value
            })
          }

          return fetch(url, { ...options, headers })
            .then(response => {
              if (response.status === 401 && session.isAuthenticated) {
                dispatch(invalidateSession())
              }

              return response
            })
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
