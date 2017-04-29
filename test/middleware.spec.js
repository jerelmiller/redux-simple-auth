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
  storage.persist.mockClear()
  storage.restore.mockClear()
})

describe('auth middleware', () => {
  const middleware = createAuthMiddleware({ storage })

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

  describe('when authenticated data changes', () => {
    it('persists changes to storage', () => {
      const middleware = configureMiddleware(successAuthenticator)
      const mockStore = configureStore([middleware])
      const getState = jest.fn()
        .mockReturnValueOnce({
          session: { authenticator: null, data: {}}
        })
        .mockReturnValueOnce({
          session: { authenticator: 'test', data: { token: '1234' }}
        })
      const store = mockStore(getState)

      store.dispatch({ type: 'test' })

      expect(storage.persist).toHaveBeenCalledWith({
        authenticated: {
          authenticator: 'test',
          token: '1234'
        }
      })
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

      spiedAuthenticator.authenticate.mockClear()
    })

    describe('when authenticator is not found', () => {
      it('throws error', () => {
        const authenticator = createAuthenticator({
          name: 'fake'
        })
        const middleware = configureMiddleware(authenticator)
        const mockStore = configureStore([middleware])
        const store = mockStore()
        const action = authenticate('not-real', {})

        expect(() => store.dispatch(action))
          .toThrow(
            'No authenticator with name `not-real` was found. Be sure ' +
            'you have defined it in the authenticators config'
          )
      })
    })

    describe('when successful', () => {
      const middleware = configureMiddleware(successAuthenticator)
      const mockStore = configureStore([middleware])

      it('sets authenticated data on local storage', async () => {
        const initialState = reducer(undefined, {})
        const getState = jest.fn()
          .mockReturnValueOnce({ session: initialState })
          .mockReturnValueOnce({
            session: reducer(
              initialState,
              authenticateSucceeded('test', { token: '1234' })
            )
          })
        const store = mockStore(getState)
        const data = { username: 'test', password: 'password' }
        const action = authenticate('test', data)

        await store.dispatch(action)

        expect(storage.persist).toHaveBeenCalledWith({
          authenticated: {
            token: '1234',
            authenticator: 'test'
          }
        })
      })

      it('dispatches AUTHENTICATE_SUCCEEDED', async () => {
        const store = mockStore({ session: reducer(undefined, {}) })
        const data = { username: 'test', password: 'password' }
        const action = authenticate('test', data)
        const expectedAction = authenticateSucceeded('test', {
          token: 'abcdefg'
        })

        await store.dispatch(action)

        expect(store.getActions()).toContainEqual(expectedAction)
      })
    })

    describe('when not successful', () => {
      it('dispatches AUTHENTICATE_FAILED', async () => {
        const middleware = configureMiddleware(failAuthenticator)
        const mockStore = configureStore([middleware])
        const store = mockStore({ session: { isAuthenticated: false }})
        const data = { username: 'test', password: 'password' }
        const action = authenticate('test', data)

        await store.dispatch(action)

        expect(store.getActions()).toContainEqual(authenticateFailed())
      })
    })
  })

  describe('session restoration', () => {
    it('hydrates session data from storage', () => {
      const middleware = configureMiddleware()
      const mockStore = configureStore([middleware])
      mockStore({ session: { isAuthenticated: false }})

      expect(storage.restore).toHaveBeenCalled()
    })
  })

  describe('when fetch action is dispatched', () => {
    it('fetches data', () => {
      const middleware = configureMiddleware()


    })
  })
})
