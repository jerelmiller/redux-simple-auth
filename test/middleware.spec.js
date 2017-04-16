import { authenticate, createAuthMiddleware, reducer } from '../src'
import testAuthenticator from '../src/authenticators/test'

const createMockStorage = () => ({
  clear: jest.fn()
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
      const getState =
        jest.fn()
          .mockReturnValueOnce({ session: { isAuthenticated: true }})
          .mockReturnValueOnce({ session: { isAuthenticated: false }})
      const nextHandler = middleware({ getState })
      const actionHandler = nextHandler(() => {})

      actionHandler({ type: 'test' })

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
      const getState = () => ({ session: reducer(undefined, {}) })
      const spy = jest.spyOn(testAuthenticator, 'authenticate')
      const middleware = createAuthMiddleware()
      const nextHandler = middleware({ getState })
      const actionHandler = nextHandler(() => {})
      const data = { username: 'test', password: 'password' }
      const action = authenticate(testAuthenticator, data)

      actionHandler(action)

      expect(spy).toHaveBeenCalledWith(data)
    })
  })
})
