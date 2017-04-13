import { createAuthMiddleware } from '../src'

describe('auth middleware', () => {
  const middleware = createAuthMiddleware()

  test('it is factory function', () => {
    expect(middleware).toBeInstanceOf(Function)
  })
})
