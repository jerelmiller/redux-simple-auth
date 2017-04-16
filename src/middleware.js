import createLocalStorageStore from './sessionStores/localStorage'
import { AUTHENTICATE } from './actionTypes'

const createAuthMiddleware = (config = {}) => {
  const storage = config.storage || createLocalStorageStore()

  return ({ getState }) => next => action => {
    if (action.type === AUTHENTICATE) {
      action.authenticator.authenticate(action.payload)
    }

    const { session: prevSession } = getState()
    next(action)
    const { session } = getState()

    if (prevSession.isAuthenticated && !session.isAuthenticated) {
      storage.clear()
    }
  }
}

export default createAuthMiddleware
