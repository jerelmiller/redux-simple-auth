import {
  authenticate,
  createAuthenticator,
  createAuthMiddleware,
  reducer
} from '../src'
import createMockStorage from './utils/testStorage'
import configureStore from 'redux-mock-store'

const storage = createMockStorage()

const createTestAuthenticator = () => createAuthenticator({
  name: 'test',
  authenticate: jest.fn(data => Promise.resolve(data))
})

beforeEach(() => {
  storage.clear.mockReset()
  storage.persist.mockReset()
  storage.restore.mockReset()
})

describe('auth middleware', () => {
  const middleware = createAuthMiddleware()

  it('returns a function that handles {getState, dispatch}', () => {
    expect(middleware).toBeInstanceOf(Function)
    expect(middleware.length).toBe(1)
  })

  describe('store handler', () => {
    it('returns function that handles next', () => {
      const nextHandler = middleware({})

      expect(nextHandler).toBeInstanceOf(Function)
      expect(nextHandler.length).toBe(1)
    })
  })

  describe('action handler', () => {
    it('action handler returns a function that handles action', () => {
      const nextHandler = middleware({})
      const actionHandler = nextHandler()

      expect(actionHandler).toBeInstanceOf(Function)
      expect(actionHandler.length).toBe(1)
    })
  })

  describe('when no longer authenticated', () => {
    it('clears state from storage', () => {
      const middleware = createAuthMiddleware({ storage })
      const mockStore = configureStore([middleware])
      const getState = jest.fn()
        .mockReturnValueOnce({ session: { isAuthenticated: true }})
        .mockReturnValueOnce({ session: { isAuthenticated: false }})
      const store = mockStore(getState)

      store.dispatch({ type: 'test' })

      expect(storage.clear).toHaveBeenCalled()
    })

    it('does not clear if still authenticated', () => {
      const middleware = createAuthMiddleware({ storage })
      const mockStore = configureStore([middleware])
      const getState =
        jest.fn()
          .mockReturnValueOnce({ session: { isAuthenticated: true }})
          .mockReturnValueOnce({ session: { isAuthenticated: true }})
      const store = mockStore(getState)

      store.dispatch({ type: 'test' })

      expect(storage.clear).not.toHaveBeenCalled()
    })

    it('does not clear if previously unauthenticated', () => {
      const middleware = createAuthMiddleware({ storage })
      const mockStore = configureStore([middleware])
      const getState =
        jest.fn()
          .mockReturnValueOnce({ session: { isAuthenticated: false }})
          .mockReturnValueOnce({ session: { isAuthenticated: false }})
      const store = mockStore(getState)

      store.dispatch({ type: 'test' })

      expect(storage.clear).not.toHaveBeenCalled()
    })
  })

  describe('when authenticating', () => {
    it('calls authenticators authenticate', () => {
      const testAuthenticator = createTestAuthenticator()
      const middleware = createAuthMiddleware({
        storage,
        authenticators: [testAuthenticator]
      })
      const mockStore = configureStore([middleware])
      const store = mockStore()
      const data = { username: 'test', password: 'password' }
      const action = authenticate('test', data)

      store.dispatch(action)

      expect(testAuthenticator.authenticate).toHaveBeenCalledWith(data)
    })

    describe('when successful', () => {
      it('sets authenticated data on local storage', done => {
        const testAuthenticator = createAuthenticator({
          name: 'test',
          authenticate: jest.fn(data => Promise.resolve({ token: 'abcd' }))
        })
        const middleware = createAuthMiddleware({
          storage,
          authenticators: [testAuthenticator]
        })
        const mockStore = configureStore([middleware])
        const store = mockStore()
        const data = { username: 'test', password: 'password' }
        const action = authenticate('test', data)

        store.dispatch(action).then(() => {
          expect(storage.persist).toHaveBeenCalledWith({
            authenticator: 'test',
            authenticated: {
              token: 'abcd'
            }
          })
          done()
        })
      })
    })
  })
})
