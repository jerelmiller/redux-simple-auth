export default (
  {
    name,
    restore = () => Promise.reject(),
    authenticate = () => Promise.reject()
  } = {}
) => {
  if (name == null) {
    throw new Error('Authenticators must define a `name` property')
  }

  if (typeof name !== 'string') {
    throw new Error(
      'Expected the `name` property of the authenticator to be a string'
    )
  }

  return {
    name,
    restore,
    authenticate
  }
}
