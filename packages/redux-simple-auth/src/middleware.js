import defaultStorage from './storage/default'
import isPlainObject from 'lodash.isplainobject'
import { AUTHENTICATE, FETCH, INVALIDATE_SESSION } from './actionTypes'
import {
  authenticateFailed,
  authenticateSucceeded,
  invalidateSession,
  invalidateSessionFailed,
  restore,
  restoreFailed,
  syncTab,
  updateSession
} from './actions'
import {
  getSessionData,
  getAuthenticator,
  getIsAuthenticated
} from './selectors'
import warning from 'warning'

const validateAuthenticatorsPresence = ({ authenticator, authenticators }) => {
  if (authenticator == null && authenticators == null) {
    throw new Error(
      'No authenticator was given. Be sure to configure an authenticator ' +
        'by using the `authenticator` option for a single authenticator or ' +
        'using the `authenticators` option to allow multiple authenticators'
    )
  }
}

const validateAuthenticatorsIsArray = authenticators => {
  if (!Array.isArray(authenticators)) {
    throw new Error(
      'Expected `authenticators` to be an array. If you only need a single ' +
        'authenticator, consider using the `authenticator` option.'
    )
  }
}

const validateAuthenticatorIsObject = authenticator => {
  if (!isPlainObject(authenticator)) {
    throw new Error(
      'Expected `authenticator` to be an object. If you need multiple ' +
        'authenticators, consider using the `authenticators` option.'
    )
  }
}

const validateConfig = config => {
  const { authenticator, authenticators } = config

  validateAuthenticatorsPresence(config)
  authenticator == null && validateAuthenticatorsIsArray(authenticators)
  authenticators == null && validateAuthenticatorIsObject(authenticator)
}

export default (config = {}) => {
  validateConfig(config)

  const {
    authenticator,
    authenticators,
    authorize,
    refresh,
    syncTabs = false,
    storage = defaultStorage
  } = config

  const findAuthenticator = authenticator
    ? () => authenticator
    : name => authenticators.find(authenticator => authenticator.name === name)

  return ({ dispatch, getState }) => {
    const { authenticated = {} } = storage.restore() || {}
    const { authenticator: authenticatorName, ...data } = authenticated
    const authenticator = findAuthenticator(authenticatorName)

    if (authenticator) {
      authenticator
        .restore(data)
        .then(
          () => dispatch(restore(authenticated)),
          () => dispatch(restoreFailed())
        )
    } else {
      dispatch(restoreFailed())
    }

    if (syncTabs && storage.__syncsAcrossTabs) {
      window.addEventListener('storage', e => {
        if (
          !e.isTrusted ||
          e.key !== storage.__key ||
          e.newValue === e.oldValue
        ) {
          return
        }

        const { authenticated = {} } = JSON.parse(e.newValue)

        authenticator
          .restore(authenticated)
          .then(
            () => dispatch(syncTab({ isAuthenticated: true, authenticated })),
            () => dispatch(syncTab({ isAuthenticated: false, authenticated }))
          )
      })
    }

    return next => action => {
      const sync = () => {
        const { session: prevSession } = getState()
        const result = next(action)
        const { session } = getState()

        if (session.data !== prevSession.data) {
          const { authenticator, data } = session

          storage.persist({ authenticated: { ...data, authenticator } })
        }

        return result
      }

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
              error => Promise.reject(dispatch(authenticateFailed(error)))
            )
        }
        case FETCH: {
          const state = getState()
          const { url, options = {} } = action.payload
          const { headers = {} } = options

          if (authorize) {
            authorize(getSessionData(state), (name, value) => {
              headers[name] = value
            })
          }

          return fetch(url, { ...options, headers }).then(response => {
            if (response.status === 401 && getIsAuthenticated(state)) {
              dispatch(invalidateSession())
            } else if (refresh) {
              const result = refresh(response)

              result !== null && dispatch(updateSession(result))
            }

            return response
          })
        }
        case INVALIDATE_SESSION: {
          const state = getState()
          const authenticatorName = getAuthenticator(state)
          const authenticator = findAuthenticator(authenticatorName)

          if (!getIsAuthenticated(state)) {
            warning(
              false,
              'You are trying to invalidate a session that is not authenticated.'
            )
            return Promise.reject(dispatch(invalidateSessionFailed()))
          }

          if (!authenticator) {
            throw new Error(
              `No authenticator with name \`${authenticatorName}\` ` +
                'was found. Be sure you have defined it in the authenticators ' +
                'config.'
            )
          }

          return authenticator
            .invalidate(getSessionData(state))
            .then(sync, () =>
              Promise.reject(dispatch(invalidateSessionFailed()))
            )
        }
        default: {
          return sync()
        }
      }
    }
  }
}
