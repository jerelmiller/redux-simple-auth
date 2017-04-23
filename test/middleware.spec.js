import {
  authenticate,
  createAuthenticator,
  createAuthMiddleware,
  reducer
} from '../src'
import {
  authenticateFailed,
  authenticateSucceeded
} from '../src/actions'
import {
  failAuthenticator,
  spiedAuthenticator,
  successAuthenticator
} from './utils/authenticators'
import createMockStorage from './utils/testStorage'
import configureStore from 'redux-mock-store'

const storage = createMockStorage()

const configureMiddleware = (...authenticators) =>
  createAuthMiddleware({ storage, authenticators })

afterEach(() => {
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
      const middleware = configureMiddleware()
      const mockStore = configureStore([middleware])
      const getState = jest.fn()
        .mockReturnValueOnce({ session: { isAuthenticated: true }})
        .mockReturnValueOnce({ session: { isAuthenticated: false }})
      const store = mockStore(getState)

      store.dispatch({ type: 'test' })

      expect(storage.clear).toHaveBeenCalled()
    })

    it('does not clear if still authenticated', () => {
      const middleware = configureMiddleware()
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
      const middleware = configureMiddleware()
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
      const middleware = configureMiddleware(spiedAuthenticator)
      const mockStore = configureStore([middleware])
      const store = mockStore()
      const data = { username: 'test', password: 'password' }
      const action = authenticate('test', data)

      store.dispatch(action)

      expect(spiedAuthenticator.authenticate).toHaveBeenCalledWith(data)

      spiedAuthenticator.authenticate.mockReset()
    })

    describe('when successful', () => {
      const middleware = configureMiddleware(successAuthenticator)
      const mockStore = configureStore([middleware])
      const store = mockStore({ session: reducer(undefined, {})})

      afterEach(() => store.clearActions())

      it('sets authenticated data on local storage', async () => {
        const data = { username: 'test', password: 'password' }
        const action = authenticate('test', data)

        await store.dispatch(action)

        expect(storage.persist).toHaveBeenCalledWith({
          authenticator: 'test',
          authenticated: {
            token: 'abcdefg'
          }
        })
      })

      it('dispatches AUTHENTICATE_SUCCEEDED', async () => {
        const data = { username: 'test', password: 'password' }
        const action = authenticate('test', data)
        const expectedActions = [authenticateSucceeded({ token: 'abcdefg' })]

        await store.dispatch(action)

        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('when not successful', () => {
      it('clears data on local storage', async () => {
        const middleware = configureMiddleware(failAuthenticator)
        const mockStore = configureStore([middleware])
        const store = mockStore({ session: { isAuthenticated: false }})
        const data = { username: 'test', password: 'password' }
        const action = authenticate('test', data)

        await store.dispatch(action)

        expect(storage.clear).toHaveBeenCalled()
      })

      it('dispatches AUTHENTICATE_FAILED', async () => {
        const middleware = configureMiddleware(failAuthenticator)
        const mockStore = configureStore([middleware])
        const store = mockStore({ session: { isAuthenticated: false }})
        const data = { username: 'test', password: 'password' }
        const action = authenticate('test', data)
        const expectedActions = [authenticateFailed()]

        await store.dispatch(action)

        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})
