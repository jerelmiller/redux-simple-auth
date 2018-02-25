import createAuthenticator from '../createAuthenticator'
import identity from '../utils/identity'
import invariant from 'invariant'

export default ({
  endpoint,
  contentType = 'application/json',
  headers = {},
  method = 'POST',
  transformRequest = JSON.stringify,
  transformResponse = identity
}) => {
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
      }).then(async response => {
        const json = await response.json()

        if (!response.ok) {
          return Promise.reject(json)
        }

        return transformResponse(json)
      }),
    restore: data => {
      if (Object.keys(data).length > 0) {
        return Promise.resolve(data)
      }

      return Promise.reject()
    }
  })
}
