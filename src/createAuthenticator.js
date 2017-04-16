const createAuthenticator = ({
  name,
  restore = () => Promise.reject(),
  authenticate = () => Promise.reject(),
  invalidate = () => Promise.resolve()
} = {}) => ({
  name,
  restore,
  authenticate,
  invalidate
})

export default createAuthenticator
