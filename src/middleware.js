import createLocalStorageStore from './sessionStores/localStorage'

const createAuthMiddleware = (config = {}) => {
  const storage = config.storage || createLocalStorageStore()

  return store => next => action => next(action)
}

export default createAuthMiddleware
