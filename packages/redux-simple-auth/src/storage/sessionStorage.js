const DEFAULT_KEY = 'redux-simple-auth-session'

export default ({ key = DEFAULT_KEY } = {}) => ({
  persist: data => {
    sessionStorage.setItem(key, JSON.stringify(data || {}))
  },
  restore: () => JSON.parse(sessionStorage.getItem(key)) || {},
  __key: key,
  __syncsAcrossTabs: true
})
