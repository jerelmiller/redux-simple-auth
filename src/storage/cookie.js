import Cookie from 'js-cookie'

const DEFAULT_COOKIE_NAME = 'redux-simple-auth-session'
const secondsFromNow = seconds => new Date(Date.now() + seconds * 1000)

export default (
  {
    name = DEFAULT_COOKIE_NAME,
    path = '/',
    domain = null,
    secure = false,
    expires = null
  } = {}
) => ({
  persist: data => {
    Cookie.set(name, data, {
      domain,
      path,
      secure,
      expires: expires && secondsFromNow(expires)
    })
  },
  restore: () => Cookie.getJSON(name)
})
