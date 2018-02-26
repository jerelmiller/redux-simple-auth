import invariant from 'invariant'

export default ({
  name,
  restore = () => Promise.reject(),
  authenticate = () => Promise.reject(),
  invalidate = data => Promise.resolve(data)
} = {}) => {
  invariant(name != null, 'Authenticators must define a `name` property')

  invariant(
    typeof name === 'string',
    'Expected the `name` property of the authenticator to be a string'
  )

  return {
    name,
    restore,
    authenticate,
    invalidate
  }
}
