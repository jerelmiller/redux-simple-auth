import Cookie from 'js-cookie'

const createCookieStore = ({
  key = 'redux-simple-auth-session',
} = {}) => ({
  persist(data) {
    Cookie.set(key, data, {
      domain: null,
      expires: null,
      path: '/',
      secure: false
    })
    return Promise.resolve()
  },
  restore() {
    return Promise.resolve({})
  }
})

export default createCookieStore
