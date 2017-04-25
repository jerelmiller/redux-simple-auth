import Cookie from 'js-cookie'

const createCookieStore = ({
  name = 'redux-simple-auth-session',
  path = '/'
} = {}) => ({
  persist(data) {
    Cookie.set(name, data, {
      domain: null,
      expires: null,
      path,
      secure: false
    })
    return Promise.resolve()
  },
  restore() {
    return Promise.resolve({})
  }
})

export default createCookieStore
