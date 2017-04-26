const createLocalStorageStore = ({
  key = 'redux-simple-auth-session',
  promiseImplementation: Promise = window.Promise,
  localStorageImplementation: localStorage = window.localStorage
} = {}) => ({
  persist: data => {
    localStorage.setItem(key, JSON.stringify(data || {}))
  },
  restore: () => JSON.parse(localStorage.getItem(key)) || {}
})

export default createLocalStorageStore
