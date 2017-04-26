import { createAdaptiveStore } from '../../src/storage'

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
    xit('builds cookie store')
    xit('honors cookie options')
  })
})
