import { createAuthenticator } from '../src'

describe('createAuthenticator', () => {
  describe('restore', () => {
    it('defaults to return a rejected promise', () => {
      const authenticator = createAuthenticator()

      const promise = authenticator.restore()

      expect(promise).rejects
    })
  })

  describe('authenticate', () => {
    it('defaults to return a rejected promise', () => {
      const authenticator = createAuthenticator()

      const promise = authenticator.authenticate()

      expect(promise).rejects
    })
  })

  describe('invalidate', () => {
    it('defaults to return a resolved promise', () => {
      const authenticator = createAuthenticator()

      const promise = authenticator.invalidate()

      expect(promise).resolves
    })
  })
})
