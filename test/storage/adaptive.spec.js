import { createAdaptiveStore } from '../../src/storage'
import Cookie from 'js-cookie'

describe('Adaptive store', () => {
  describe('it builds a store', () => {
    const store = createAdaptiveStore()

    expect(store).toHaveProperty('persist')
    expect(store).toHaveProperty('restore')
  })

  describe('when localStorage is available', () => {
    it('builds localStorage store if available', () => {
      const setItemSpy = jest.spyOn(localStorage, 'setItem')
      const getItemSpy = jest.spyOn(localStorage, 'getItem')

      const store = createAdaptiveStore()
      store.persist({ key: 'value' })
      store.restore()

      expect(setItemSpy).toHaveBeenCalled()
      expect(getItemSpy).toHaveBeenCalled()

      setItemSpy.mockRestore()
      getItemSpy.mockRestore()
    })

    it('honors local storage options', () => {
      const setItemSpy = jest.spyOn(localStorage, 'setItem')
      const getItemSpy = jest.spyOn(localStorage, 'getItem')

      const store = createAdaptiveStore({ localStorageKey: 'my-custom-key' })
      store.persist({ key: 'value' })
      store.restore()

      expect(setItemSpy).toHaveBeenCalledWith(
        'my-custom-key',
        JSON.stringify({ key: 'value' })
      )
      expect(getItemSpy).toHaveBeenCalledWith('my-custom-key')

      setItemSpy.mockRestore()
      getItemSpy.mockRestore()
    })
  })

  describe('when local storage is not available', () => {
    beforeEach(() => {
      localStorage.setItem = jest.fn(() => {
        throw new Error()
      })
    })

    it('builds cookie store', () => {
      const setSpy = jest.spyOn(Cookie, 'set')
      const getJSONSpy = jest.spyOn(Cookie, 'getJSON')

      const store = createAdaptiveStore()
      store.persist({ key: 'value' })
      store.restore()

      expect(setSpy).toHaveBeenCalled()
      expect(getJSONSpy).toHaveBeenCalled()
    })

    it('honors cookie options', () => {
      const setSpy = jest.spyOn(Cookie, 'set')
      const getJSONSpy = jest.spyOn(Cookie, 'getJSON')

      const store = createAdaptiveStore({
        cookieName: 'my-custom-cookie',
        cookieDomain: 'example.com',
        cookiePath: '/',
        cookieSecure: true,
        cookieExpires: 120
      })
      store.persist({ key: 'value' })
      store.restore()

      expect(setSpy).toHaveBeenCalledWith(
        'my-custom-cookie',
        { key: 'value' },
        {
          domain: 'example.com',
          path: '/',
          secure: true,
          expires: expect.any(Date)
        }
      )
      expect(getJSONSpy).toHaveBeenCalledWith('my-custom-cookie')
    })
  })
})
