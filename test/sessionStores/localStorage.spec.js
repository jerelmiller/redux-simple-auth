import createLocalStorageStore from '../../src/sessionStores/localStorage'

const defaultKey = 'redux-simple-auth-session'

const createMockLocalStorage = () => ({
  setItem: jest.fn(),
  removeItem: jest.fn()
})

describe('local storage', () => {
  const mockPromise = {
    resolve: () => 'resolved'
  }

  describe('#persist', () => {
    it('returns resolved promise', () => {
      const localStorage = createMockLocalStorage()
      const storage = createLocalStorageStore({
        promiseImplementation: mockPromise,
        localStorageImplementation: localStorage
      })

      expect(storage.persist()).toBe('resolved')
    })

    it('sets item on local storage', () => {
      const localStorage = createMockLocalStorage()
      const storage = createLocalStorageStore({
        localStorageImplementation: localStorage
      })
      const data = { email: 'user@example.com' }

      storage.persist(data)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        defaultKey,
        JSON.stringify(data)
      )
    })

    describe('when key is custom key', () => {
      it('sets data for key', () => {
        const localStorage = createMockLocalStorage()
        const storage = createLocalStorageStore({
          key: 'my-custom-key',
          localStorageImplementation: localStorage
        })
        const data = { email: 'user@example.com' }

        storage.persist(data)

        expect(localStorage.setItem).toHaveBeenCalledWith(
          'my-custom-key',
          JSON.stringify(data)
        )
      })
    })
  })

  describe('#restore', () => {
    it('returns resolved promise with data from local storage', () => {
      const data = { id: 1, name: 'John Doe', }
      const storage = createLocalStorageStore({
        promiseImplementation: {
          resolve: data => data
        },
        localStorageImplementation: {
          getItem: () => JSON.stringify(data)
        }
      })

      expect(storage.restore()).toEqual(data)
    })

    it('returns empty object if no data for key', () => {
      const storage = createLocalStorageStore({
        promiseImplementation: {
          resolve: data => data
        },
        localStorageImplementation: {
          getItem: () => null
        }
      })

      expect(storage.restore()).toEqual({})
    })
  })

  describe('#clear', () => {
    it('clears data from local storage', () => {
      const localStorage = createMockLocalStorage()
      const storage = createLocalStorageStore({
        localStorageImplementation: localStorage
      })

      storage.clear()

      expect(localStorage.removeItem).toHaveBeenCalledWith(defaultKey)
    })

    it('returns resolved promise', () => {
      const storage = createLocalStorageStore({
        promiseImplementation: mockPromise,
        localStorageImplementation: createMockLocalStorage()
      })

      expect(storage.clear()).toBe('resolved')
    })

    describe('when custom key is given', () => {
      it('clears data using custom key', () => {
        const localStorage = createMockLocalStorage()
        const storage = createLocalStorageStore({
          key: 'my-custom-key',
          localStorageImplementation: localStorage
        })

        storage.clear()

        expect(localStorage.removeItem).toHaveBeenCalledWith(
          'my-custom-key'
        )
      })
    })
  })
})
