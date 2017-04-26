import { createCookieStore } from '../../src/storage'
import Cookie from 'js-cookie'

describe('cookie store', () => {
  describe('#persist', () => {
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

    it('allows setting secure cookie', () => {
      const cookieStore = createCookieStore({ secure: true })
      const spy = jest.spyOn(Cookie, 'set')

      cookieStore.persist({ key: 'value' })

      expect(spy).toHaveBeenCalledWith(
        'redux-simple-auth-session',
        { key: 'value' },
        { domain: null, expires: null, path: '/', secure: true }
      )
    })

    it('allows setting expiration in seconds', () => {
      const now = Date.now()
      const nativeNow = Date.now
      Date.now = jest.fn(() => now)
      const expectedDate = new Date(now + 120 * 1000)
      const cookieStore = createCookieStore({ expires: 120 })
      const spy = jest.spyOn(Cookie, 'set')

      cookieStore.persist({ key: 'value' })

      expect(spy).toHaveBeenCalledWith(
        'redux-simple-auth-session',
        { key: 'value' },
        { domain: null, expires: expectedDate, path: '/', secure: false }
      )

      Date.now = nativeNow
    })
  })

  describe('#restore', () => {
    it('returns data from cookie', () => {
      const cookieStore = createCookieStore()
      cookieStore.persist({ key: 'value' })

      const result = cookieStore.restore()

      expect(result).toEqual({ key: 'value' })
    })

    it('honors custom key', () => {
      const cookieStore = createCookieStore({ name: 'my-custom-session' })
      cookieStore.persist({ key: 'value' })

      const result = cookieStore.restore()

      expect(result).toEqual({ key: 'value' })
    })
  })
})
