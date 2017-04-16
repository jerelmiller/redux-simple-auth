const createAuthenticator = ({
  restore = () => Promise.reject(),
  authenticate = () => Promise.reject(),
  invalidate = () => Promise.resolve()
} = {}) => ({
  restore,
  authenticate,
  invalidate
})

export default createAuthenticator
