import { createAuthenticator } from '../../src'

export const spiedAuthenticator = createAuthenticator({
  name: 'test',
  authenticate: jest.fn(data => Promise.resolve(data)),
  restore: jest.fn(() => Promise.resolve())
})

export const successAuthenticator = createAuthenticator({
  name: 'test',
  authenticate: () => Promise.resolve({ token: 'abcdefg' }),
  restore: () => Promise.resolve()
})

export const failAuthenticator = createAuthenticator({
  name: 'test',
  authenticate: () => Promise.reject(),
  restore: () => Promise.reject()
})
