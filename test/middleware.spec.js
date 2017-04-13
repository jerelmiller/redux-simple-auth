import { createAuthMiddleware } from '../src'

describe('auth middleware', () => {
  const middleware = createAuthMiddleware()
  const nextHandler = middleware({})
  const actionHandler = nextHandler()

  test('it returns a function that handles store', () => {
    expect(middleware).toBeInstanceOf(Function)
    expect(middleware.length).toBe(1)
  })

  test('store handler returns function that handles next', () => {
    expect(nextHandler).toBeInstanceOf(Function)
    expect(nextHandler.length).toBe(1)
  })

  test('action handler returns a function that handles action', () => {
    expect(actionHandler).toBeInstanceOf(Function)
    expect(actionHandler.length).toBe(1)
  })
})
