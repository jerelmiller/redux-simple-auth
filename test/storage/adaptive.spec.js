import { createAdaptiveStore } from '../../src/storage'

describe('Adaptive store', () => {
  describe('it builds a store', () => {
    const store = createAdaptiveStore()

    expect(store).toHaveProperty('persist')
    expect(store).toHaveProperty('restore')
  })

  describe('when localStorage is available', () => {
    xit('builds localStorage store if available')
    xit('honors local storage options')
  })

  describe('when local storage is not available', () => {
    xit('builds cookie store')
    xit('honors cookie options')
  })
})
