import createAuthenticator from '../createAuthenticator'

export default () =>
  createAuthenticator({
    name: 'oauth2-implicit-grant',
    restore: data =>
      new Promise((resolve, reject) => {
        if (!data || !data.access_token) {
          return reject('Could not restore session - "access_token" missing.')
        }

        return resolve(data)
      }),
    authenticate: hash =>
      new Promise((resolve, reject) => {
        if (hash.error) {
          reject(hash.error)
        } else if (!hash || !hash.access_token) {
          reject('Invalid auth params - "access_token" missing.')
        } else {
          resolve(hash)
        }
      })
  })
