import enhancer from '../src/enhancer'
import createMockStorage from './utils/testStorage'

describe('enhancer', () => {
  it('returns enhanced store with initial storage state', () => {
    const enhancedCreateStore = enhancer()

    expect(enhancedCreateStore).toBeInstanceOf(Function)
  })
})
