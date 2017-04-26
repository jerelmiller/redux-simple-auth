import { createAdaptiveStore } from '../../src/storage'

describe('Adaptive store', () => {
  describe('it builds a store', () => {
    const result = createAdaptiveStore()

    expect(result).toHaveProperty('persist')
    expect(result).toHaveProperty('restore')
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
