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
      expect(() => createAuthenticator({ name: {} })).toThrow(
        'Expected the `name` property of the authenticator to be a string'
      )
    })
  })

  describe('#restore', () => {
    it('defaults to return a rejected promise', async () => {
      const authenticator = createAuthenticator({ name: 'test' })

      const promise = authenticator.restore()

      await expect(promise).rejects.toBeUndefined()
    })
  })

  describe('#authenticate', () => {
    it('defaults to return a rejected promise', async () => {
      const authenticator = createAuthenticator({ name: 'test' })

      const promise = authenticator.authenticate()

      await expect(promise).rejects.toBeUndefined()
    })
  })
})
