export default ({
  name,
  restore = () => Promise.reject(),
  authenticate = () => Promise.reject(),
  invalidate = () => Promise.resolve()
} = {}) => {
  if (name == null) {
    throw new Error('Authenticators must define a `name` property')
  }

  return {
    name,
    restore,
    authenticate,
    invalidate
  }
}
