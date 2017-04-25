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

    it('allows a configured cookie name', () => {
      const cookieStore = createCookieStore({ name: 'my-cookie-session' })
      const spy = jest.spyOn(Cookie, 'set')

      cookieStore.persist({ key: 'value' })

      expect(spy).toHaveBeenCalledWith(
        'my-cookie-session',
        { key: 'value' },
        { domain: null, expires: null, path: '/', secure: false }
      )
    })

    it('allows a custom path', () => {
      const cookieStore = createCookieStore({ path: '/hello-world' })
      const spy = jest.spyOn(Cookie, 'set')

      cookieStore.persist({ key: 'value' })

      expect(spy).toHaveBeenCalledWith(
        'redux-simple-auth-session',
        { key: 'value' },
        { domain: null, expires: null, path: '/hello-world', secure: false }
      )
    })

    it('allows a custom domain', () => {
      const cookieStore = createCookieStore({ domain: 'domain.com' })
      const spy = jest.spyOn(Cookie, 'set')

      cookieStore.persist({ key: 'value' })
      expect(spy).toHaveBeenCalledWith(
        'redux-simple-auth-session',
        { key: 'value' },
        { domain: 'domain.com', expires: null, path: '/', secure: false }
      )
    })

    xit('allows setting expiration')
    xit('allows setting secure cookie')
  })
})
