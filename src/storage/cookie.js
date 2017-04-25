import Cookie from 'js-cookie'

const secondsFromNow = seconds => new Date(Date.now() + seconds * 1000)

const createCookieStore = ({
  name = 'redux-simple-auth-session',
  path = '/',
  domain = null,
  secure = false,
  expires = null
} = {}) => ({
  persist(data) {
    Cookie.set(name, data, {
      domain,
      path,
      secure,
      expires: expires && secondsFromNow(expires),
    })

    return Promise.resolve()
  },
  restore() {
    return Promise.resolve({})
  }
})

export default createCookieStore
