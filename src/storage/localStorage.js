const createLocalStorageStore = ({
  key = 'redux-simple-auth-session'
} = {}) => ({
  persist: data => {
    localStorage.setItem(key, JSON.stringify(data || {}))
  },
  restore: () => JSON.parse(localStorage.getItem(key)) || {}
})

export default createLocalStorageStore
