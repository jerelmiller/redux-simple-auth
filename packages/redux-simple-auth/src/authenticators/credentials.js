import createAuthenticator from '../createAuthenticator'
import identity from '../utils/identity'
import invariant from 'invariant'

export default ({
  endpoint,
  contentType = 'application/json',
  headers = {},
  transformRequest = JSON.stringify,
  transformResponse = identity,
  method = 'POST'
}) => {
  invariant(
    endpoint,
    'You must provide an endpoint to use the `credentials` authenticator'
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
      }).then(async response => {
        const json = await response.json()

        if (!response.ok) {
          return Promise.reject(json)
        }

        return transformResponse(json)
      })
  })
}
