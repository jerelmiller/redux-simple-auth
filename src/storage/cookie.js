import Cookie from 'js-cookie'

const createCookieStore = ({
  name = 'redux-simple-auth-session',
  path = '/',
  domain = null,
  secure = false
} = {}) => ({
  persist(data) {
    Cookie.set(name, data, {
      domain,
      expires: null,
      path,
      secure
    })
    return Promise.resolve()
  },
  restore() {
    return Promise.resolve({})
  }
})

export default createCookieStore
