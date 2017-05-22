/* eslint-disable no-unused-expressions */
import { createAuthenticator } from '../src'

describe('createAuthenticator', () => {
  describe('config', () => {
    it('throws when no name is given', () => {
      expect(() => createAuthenticator()).toThrow(
        'Authenticators must define a `name` property'
      )
    })

    it('throws when name is not a string', () => {
      expect(() => createAuthenticator({ name: {}})).toThrow(
        'Expected the `name` property of the authenticator to be a string'
      )
    })
  })

  describe('#restore', () => {
    it('defaults to return a rejected promise', () => {
      const authenticator = createAuthenticator({ name: 'test' })

      const promise = authenticator.restore()

      expect(promise).rejects
    })
  })

  describe('#authenticate', () => {
    it('defaults to return a rejected promise', () => {
      const authenticator = createAuthenticator({ name: 'test' })

      const promise = authenticator.authenticate()

      expect(promise).rejects
    })
  })

  describe('#invalidate', () => {
    it('defaults to return a resolved promise', () => {
      const authenticator = createAuthenticator({ name: 'test' })

      const promise = authenticator.invalidate()

      expect(promise).resolves
    })
  })
})
