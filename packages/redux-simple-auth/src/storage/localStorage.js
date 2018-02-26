const DEFAULT_KEY = 'redux-simple-auth-session'

export default ({ key = DEFAULT_KEY } = {}) => ({
  persist: data => {
    localStorage.setItem(key, JSON.stringify(data || {}))
  },
  restore: () => JSON.parse(localStorage.getItem(key)) || {},
  __key: key,
  __syncsAcrossTabs: true
})
