import createLocalStorageStore from './localStorage'

const createAdaptiveStore = ({
  localStorageKey = 'redux-simple-auth-session'
} = {}) => {
  return createLocalStorageStore({ key: localStorageKey })
}

export default createAdaptiveStore
