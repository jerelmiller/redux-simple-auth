import { createCookieStore } from '../../src/storage'
import Cookie from 'js-cookie'

describe('cookie store', () => {
  describe('#persist', () => {
    it('returns resolved promise', () => {
      const cookieStore = createCookieStore()

      expect(cookieStore.persist()).resolves
    })

    it('saves data to cookie with default key', () => {
      const cookieStore = createCookieStore()
      const spy = jest.spyOn(Cookie, 'set')

      cookieStore.persist({ key: 'value' })

      expect(spy).toHaveBeenCalledWith(
        'redux-simple-auth-session',
        { key: 'value' },
        { domain: null, expires: null, path: '/', secure: false }
      )
    })
  })
})
