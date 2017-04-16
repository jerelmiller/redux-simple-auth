import createAuthenticator from '../createAuthenticator'

export default createAuthenticator({
  authenticate: data => Promise.resolve(data),
  restore: data => Promise.resolve(data),
  invalidate: () => Promise.resolve()
})
