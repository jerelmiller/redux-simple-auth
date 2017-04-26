import { createLocalStorageStore } from '../../src/storage'

const defaultKey = 'redux-simple-auth-session'

describe('local storage', () => {
  afterEach(() => localStorage.clear())

  describe('#persist', () => {
    it('sets item on local storage', () => {
      const spy = jest.spyOn(localStorage, 'setItem')
      const storage = createLocalStorageStore()
      const data = { email: 'user@example.com' }

      storage.persist(data)

      expect(spy).toHaveBeenCalledWith(
        defaultKey,
        JSON.stringify(data)
      )
    })

    describe('when key is custom key', () => {
      it('sets data for key', () => {
        const spy = jest.spyOn(localStorage, 'setItem')
        const storage = createLocalStorageStore({ key: 'my-custom-key' })
        const data = { email: 'user@example.com' }

        storage.persist(data)

        expect(spy).toHaveBeenCalledWith(
          'my-custom-key',
          JSON.stringify(data)
        )
      })
    })
  })

  describe('#restore', () => {
    it('returns resolved promise with data from local storage', () => {
      const data = { id: 1, name: 'John Doe' }
      const storage = createLocalStorageStore()
      storage.persist(data)

      expect(storage.restore()).toEqual(data)
    })

    it('returns empty object if no data for key', () => {
      const storage = createLocalStorageStore()

      expect(storage.restore()).toEqual({})
    })

    describe('when custom key is given', () => {
      it('gets data from local storage for key', () => {
        const spy = jest.spyOn(localStorage, 'getItem')
        const storage = createLocalStorageStore({ key: 'my-custom-key' })

        storage.restore()

        expect(spy).toHaveBeenCalledWith('my-custom-key')
      })
    })
  })
})
