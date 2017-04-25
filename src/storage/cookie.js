const createCookieStore = ({
  key = 'redux-simple-auth-session'
} = {}) => ({
  persist(data) {
    return Promise.resolve()
  },
  restore() {
    return Promise.resolve({})
  }
})

export default createCookieStore
