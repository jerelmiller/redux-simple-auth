import { createAuthenticator } from '../../src'

export const spiedAuthenticator = createAuthenticator({
  name: 'test',
  authenticate: jest.fn(data => Promise.resolve(data))
})

export const successAuthenticator = createAuthenticator({
  name: 'test',
  authenticate: data => Promise.resolve({ token: 'abcdefg' })
})

export const failAuthenticator = createAuthenticator({
  name: 'test',
  authenticate: () => Promise.reject()
})
