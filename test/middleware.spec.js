import {
  authenticate,
  createAuthenticator,
  createAuthMiddleware,
  reducer
} from '../src'
import createMockStorage from './utils/testStorage'
import configureStore from 'redux-mock-store'

const createTestAuthenticator = () => createAuthenticator({
  name: 'test',
  authenticate: jest.fn(data => Promise.resolve(data))
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
      const storage = createMockStorage()
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
      const storage = createMockStorage()
      const middleware = createAuthMiddleware({ storage })
      const getState =
        jest.fn()
          .mockReturnValueOnce({ session: { isAuthenticated: true }})
          .mockReturnValueOnce({ session: { isAuthenticated: true }})
      const nextHandler = middleware({ getState })
      const actionHandler = nextHandler(() => {})

      actionHandler({ type: 'test' })

      expect(storage.clear).not.toHaveBeenCalled()
    })

    it('does not clear if not previously authenticated', () => {
      const storage = createMockStorage()
      const middleware = createAuthMiddleware({ storage })
      const getState =
        jest.fn()
          .mockReturnValueOnce({ session: { isAuthenticated: false }})
          .mockReturnValueOnce({ session: { isAuthenticated: false }})
      const nextHandler = middleware({ getState })
      const actionHandler = nextHandler(() => {})

      actionHandler({ type: 'test' })

      expect(storage.clear).not.toHaveBeenCalled()
    })
  })

  describe('when authenticating', () => {
    it('calls authenticators authenticate', () => {
      const testAuthenticator = createTestAuthenticator()
      const getState = () => ({ session: reducer(undefined, {}) })
      const middleware = createAuthMiddleware({
        authenticators: [testAuthenticator]
      })
      const nextHandler = middleware({ getState })
      const actionHandler = nextHandler(() => {})
      const data = { username: 'test', password: 'password' }
      const action = authenticate('test', data)

      actionHandler(action)

      expect(testAuthenticator.authenticate).toHaveBeenCalledWith(data)
    })

    describe('when successful', () => {
      it('sets authenticated data on local storage', done => {
        const testAuthenticator = createAuthenticator({
          name: 'test',
          authenticate: jest.fn(data => Promise.resolve({ token: 'abcd' }))
        })
        const getState = () => ({ session: reducer(undefined, {}) })
        const storage = {
          persist: jest.fn()
        }
        const middleware = createAuthMiddleware({
          storage,
          authenticators: [testAuthenticator]
        })
        const nextHandler = middleware({ getState })
        const actionHandler = nextHandler(() => {})
        const data = { username: 'test', password: 'password' }
        const action = authenticate('test', data)

        actionHandler(action).then(() => {
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
