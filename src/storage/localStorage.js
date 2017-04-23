const createLocalStorageStore = ({
  key = 'redux-simple-auth-session',
  promiseImplementation: Promise = window.Promise,
  localStorageImplementation: localStorage = window.localStorage
} = {}) => ({
  persist(data) {
    localStorage.setItem(key, JSON.stringify(data || {}))

    return Promise.resolve()
  },
  restore() {
    const data = localStorage.getItem(key)

    return Promise.resolve(JSON.parse(data) || {})
  },
  clear() {
    localStorage.removeItem(key)

    return Promise.resolve()
  }
})

export default createLocalStorageStore
