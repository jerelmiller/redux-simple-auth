import Cookie from 'js-cookie'

const secondsFromNow = seconds => new Date(Date.now() + seconds * 1000)

export default ({
  name = 'redux-simple-auth-session',
  path = '/',
  domain = null,
  secure = false,
  expires = null
} = {}) => ({
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
