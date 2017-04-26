import { createAdaptiveStore } from '../../src/storage'

describe('Adaptive store', () => {
  describe('it builds a store', () => {
    const result = createAdaptiveStore()

    expect(result).toHaveProperty('persist')
    expect(result).toHaveProperty('restore')
  })
})
