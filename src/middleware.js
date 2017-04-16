import createLocalStorageStore from './sessionStores/localStorage'

const createAuthMiddleware = (config = {}) => {
  const storage = config.storage || createLocalStorageStore()

  return ({ getState }) => next => action => {
    const { session: prevSession } = getState()
    next(action)
    const { session } = getState()

    if (prevSession.isAuthenticated && !session.isAuthenticated) {
      storage.clear()
    }
  }
}

export default createAuthMiddleware
