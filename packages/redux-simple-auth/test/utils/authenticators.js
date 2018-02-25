import { createAuthenticator } from '../../src'

export const testAuthenticator = createAuthenticator({
  name: 'test',
  authenticate: () => Promise.resolve({ token: 'abcdefg' }),
  restore: () => Promise.resolve(),
  invalidate: () => Promise.resolve()
})
