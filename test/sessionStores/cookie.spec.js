import { createCookieStore } from '../../src/storage'

const defaultKey = 'redux-simple-auth-session'

describe('cookie store', () => {
  describe('#persist', () => {
    it('returns resolved promise', () => {
      const cookieStore = createCookieStore()

      expect(cookieStore.persist()).resolves
    })
  })
})
