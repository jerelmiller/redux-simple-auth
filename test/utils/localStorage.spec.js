import { isLocalStorageAvailable } from '../../src/utils/localStorage'

describe('isLocalStorageAvailable', () => {
  it('when local storage is available it returns true', () => {
    const result = isLocalStorageAvailable()

    expect(result).toBe(true)
  })

  it('when localStorage is not available it returns false', () => {
    const originalSetItem = localStorage.setItem
    localStorage.setItem = jest.fn(() => { throw new Error('') })

    const result = isLocalStorageAvailable()

    expect(result).toBe(false)

    localStorage.setItem = originalSetItem
  })
})
