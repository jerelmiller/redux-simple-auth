import createAuthenticator from '../createAuthenticator'
import identity from '../utils/identity'
import invariant from 'invariant'

const defaultRestore = data => {
  if (Object.keys(data).length > 0) {
    return Promise.resolve(data)
  }

  return Promise.reject()
}

const defaultInvalidate = data => Promise.resolve(data)

export default ({
  endpoint,
  contentType = 'application/json',
  headers = {},
  invalidate = defaultInvalidate,
  method = 'POST',
  restore = defaultRestore,
  transformRequest = JSON.stringify,
  transformResponse = identity
} = {}) => {
  invariant(
    endpoint,
    'You must provide an endpoint for the `credentials` authenticator'
  )

  return createAuthenticator({
    name: 'credentials',
    authenticate: credentials =>
      fetch(endpoint, {
        method,
        headers: {
          'Content-Type': contentType,
          ...headers
        },
        body: transformRequest(credentials)
      }).then(response =>
        response.json().then(json => {
          if (!response.ok) {
            return Promise.reject(json)
          }

          return transformResponse(json)
        })
      ),
    restore,
    invalidate
  })
}
