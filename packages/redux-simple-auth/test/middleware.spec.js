import {
  authenticate,
  createAuthenticator,
  createAuthMiddleware,
  reducer
} from '../src'
import {
  authenticateFailed,
  authenticateSucceeded,
  fetch as fetchAction,
  invalidateSession,
  updateSession,
  invalidateSessionFailed,
  restore
} from '../src/actions'
import { spiedAuthenticator, testAuthenticator } from './utils/authenticators'
import createMockStorage from './utils/testStorage'
import configureStore from 'redux-mock-store'

const storage = createMockStorage()

const configureMiddleware = (...authenticators) =>
  createAuthMiddleware({ storage, authenticators })

beforeEach(() => {
  fetch.resetMocks()
})

it('throws when no authenticator is given', () => {
  expect(() =>
    createAuthMiddleware({
      storage,
      authenticator: undefined,
      authenticators: undefined
    })
  ).toThrow(
    'No authenticator was given. Be sure to configure an authenticator ' +
      'by using the `authenticator` option for a single authenticator or ' +
      'using the `authenticators` option to allow multiple authenticators'
  )
})

it('throws when authenticators are not an array', () => {
  expect(() =>
    createAuthMiddleware({ storage, authenticators: 'bloop' })
  ).toThrow(
    'Expected `authenticators` to be an array. If you only need a single ' +
      'authenticator, consider using the `authenticator` option.'
  )
})

it('throws when authenticator is an array', () => {
  expect(() => createAuthMiddleware({ storage, authenticator: [] })).toThrow(
    'Expected `authenticator` to be an object. If you need multiple ' +
      'authenticators, consider using the `authenticators` option.'
  )
})

it('persists changed authenticated data to storage', () => {
  const storage = createMockStorage()
  const middleware = createAuthMiddleware({
    storage,
    authenticator: testAuthenticator
  })
  const mockStore = configureStore([middleware])
  const getState = jest
    .fn()
    .mockReturnValueOnce({
      session: { authenticator: null, data: {} }
    })
    .mockReturnValueOnce({
      session: { authenticator: 'test', data: { token: '1234' } }
    })
  const store = mockStore(getState)

  store.dispatch({ type: 'test' })

  expect(storage.getData()).toEqual({
    authenticated: {
      authenticator: 'test',
      token: '1234'
    }
  })
})

it('hydrates session data from storage', async () => {
  const storage = createMockStorage({
    authenticated: { authenticator: 'test', token: 1234 }
  })
  const middleware = createAuthMiddleware({
    storage,
    authenticator: testAuthenticator
  })
  const mockStore = configureStore([middleware])

  const store = await mockStore()

  expect(store.getActions()).toContainEqual(
    restore({ authenticator: 'test', token: 1234 })
  )
})

describe('AUTHENTICATE dispatched', () => {
  it('authenticates with configured authenticator', () => {
    const storage = createMockStorage()
    const authenticator = createAuthenticator({
      name: 'test',
      authenticate: jest.fn(() => Promise.resolve())
    })
    const middleware = createAuthMiddleware({
      storage,
      authenticator
    })
    const mockStore = configureStore([middleware])
    const store = mockStore()
    const data = { username: 'test', password: 'password' }
    const action = authenticate('test', data)

    store.dispatch(action)

    expect(authenticator.authenticate).toHaveBeenCalledWith(data)
  })

  it('authenticates with matching authenticator', () => {
    const credsAuthenticator = createAuthenticator({
      name: 'creds',
      authenticate: jest.fn(() => Promise.resolve())
    })
    const testAuthenticator = createAuthenticator({
      name: 'test',
      authenticate: jest.fn(() => Promise.resolve())
    })
    const middleware = createAuthMiddleware({
      storage,
      authenticators: [credsAuthenticator, testAuthenticator]
    })
    const mockStore = configureStore([middleware])
    const store = mockStore()
    const data = { username: 'test', password: 'password' }
    const action = authenticate('test', data)

    store.dispatch(action)

    expect(testAuthenticator.authenticate).toHaveBeenCalledWith(data)
    expect(credsAuthenticator.authenticate).not.toHaveBeenCalled
  })

  it('throws error when authenticator is not found', () => {
    const authenticator = createAuthenticator({
      name: 'fake'
    })
    const middleware = configureMiddleware(authenticator)
    const mockStore = configureStore([middleware])
    const store = mockStore()
    const action = authenticate('not-real', {})

    expect(() => store.dispatch(action)).toThrow(
      'No authenticator with name `not-real` was found. Be sure ' +
        'you have defined it in the authenticators config'
    )
  })

  describe('when successful', () => {
    it('dispatches AUTHENTICATE_SUCCEEDED', async () => {
      const storage = createMockStorage()
      const middleware = createAuthMiddleware({
        storage,
        authenticator: testAuthenticator
      })
      const mockStore = configureStore([middleware])
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
      const storage = createMockStorage()
      const authenticator = createAuthenticator({
        name: 'fail',
        authenticate: () => Promise.reject()
      })
      const middleware = createAuthMiddleware({ storage, authenticator })
      const mockStore = configureStore([middleware])
      const store = mockStore()
      const data = { username: 'test', password: 'password' }
      const action = authenticate('test', data)

      try {
        await store.dispatch(action)
      } catch (e) {}

      expect(store.getActions()).toContainEqual(authenticateFailed())
    })

    it('returns rejected promise', async () => {
      const storage = createMockStorage()
      const authenticator = createAuthenticator({
        name: 'fail',
        authenticate: () => Promise.reject()
      })
      const middleware = createAuthMiddleware({ storage, authenticator })
      const mockStore = configureStore([middleware])
      const store = mockStore({ session: { isAuthenticated: false } })
      const data = { username: 'test', password: 'password' }
      const action = authenticate('test', data)

      const promise = store.dispatch(action)

      await expect(promise).rejects.toEqual(authenticateFailed())
    })
  })
})

describe('when invalidating', () => {
  it('calls authenticators invalidate', () => {
    const middleware = configureMiddleware(spiedAuthenticator)
    const mockStore = configureStore([middleware])
    const data = { username: 'test', password: 'password' }
    const store = mockStore({ session: { authenticator: 'test', data } })
    const invalidateAction = invalidateSession()

    store.dispatch(invalidateAction)
    expect(spiedAuthenticator.invalidate).toHaveBeenCalledWith(data)

    spiedAuthenticator.authenticate.mockClear()
    spiedAuthenticator.invalidate.mockClear()
  })

  describe('when there is no session', () => {
    it('throws error', () => {
      const authenticator = createAuthenticator({
        name: 'fake'
      })
      const middleware = configureMiddleware(authenticator)
      const mockStore = configureStore([middleware])
      const store = mockStore()
      const action = invalidateSession('not-real', {})

      expect(() => store.dispatch(action)).toThrow(
        'No session data to invalidate. Be sure you authenticate the ' +
          'session before you try to invalidate it'
      )
    })
  })

  describe('when redux store authenticator is not found', () => {
    it('returns a rejected promise and dispatches invalidate Session', async () => {
      const authenticator = createAuthenticator({
        name: 'unmatchable'
      })
      const middleware = configureMiddleware(authenticator)
      const mockStore = configureStore([middleware])
      const store = mockStore({ session: {} })
      await expect(store.dispatch(invalidateSession())).rejects.toEqual(
        new Error(
          'No authenticated session. Be sure you authenticate the session ' +
            'before you try to invalidate it'
        )
      )

      expect(store.getActions()).toContainEqual(invalidateSessionFailed())
    })
  })

  describe('when there is no authenticator', () => {
    it('throws error', () => {
      const authenticator = createAuthenticator({
        name: 'fake'
      })
      const middleware = configureMiddleware(authenticator)
      const mockStore = configureStore([middleware])
      const store = mockStore()
      const action = invalidateSession()

      expect(() => store.dispatch(action)).toThrow(
        'No session data to invalidate. Be sure you authenticate the ' +
          'session before you try to invalidate it'
      )
    })
  })
})

describe('when fetch action is dispatched', () => {
  it('fetches data', () => {
    fetch.mockResponse(JSON.stringify({ ok: true }))
    const middleware = configureMiddleware()
    const mockStore = configureStore([middleware])
    const store = mockStore({ session: reducer(undefined, {}) })

    store.dispatch(fetchAction('https://test.com'))

    expect(fetch).toHaveBeenCalledWith('https://test.com', { headers: {} })
  })

  it('passes request options to fetch', () => {
    fetch.mockResponse(JSON.stringify({ ok: true }))
    const middleware = configureMiddleware()
    const mockStore = configureStore([middleware])
    const store = mockStore({ session: reducer(undefined, {}) })

    store.dispatch(
      fetchAction('https://test.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com' })
      })
    )

    expect(fetch).toHaveBeenCalledWith('https://test.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com' })
    })
  })

  it('calls authorize with authenticated data', () => {
    fetch.mockResponse(JSON.stringify({ ok: true }))
    const authorize = jest.fn()
    const middleware = createAuthMiddleware({
      storage,
      authorize,
      authenticator: spiedAuthenticator
    })
    const mockStore = configureStore([middleware])
    const data = { token: '1235' }
    const store = mockStore({ session: { data } })

    store.dispatch(fetchAction('https://test.com'))

    expect(authorize).toHaveBeenCalledWith(data, expect.any(Function))
  })

  it('sets headers when authorize runs block function', () => {
    fetch.mockResponse(JSON.stringify({ ok: true }))
    const authorize = (data, block) => {
      block('Authorization', data.token)
    }
    const middleware = createAuthMiddleware({
      storage,
      authorize,
      authenticator: spiedAuthenticator
    })
    const mockStore = configureStore([middleware])
    const data = { token: '1235' }
    const store = mockStore({ session: { data } })

    store.dispatch(fetchAction('https://test.com'))

    expect(fetch).toHaveBeenCalledWith('https://test.com', {
      headers: { Authorization: '1235' }
    })
  })

  describe('when refresh option is set', () => {
    it('dispatches update session action', async () => {
      fetch.mockResponse(JSON.stringify({ ok: true }), {
        headers: {
          'x-access-token': '6789'
        }
      })
      const middleware = createAuthMiddleware({
        storage,
        authenticator: testAuthenticator,
        refresh: response => ({
          token: response.headers.get('x-access-token')
        })
      })
      const mockStore = configureStore([middleware])
      const data = { token: '1235' }
      const store = mockStore({ session: { data } })
      const updateAction = updateSession({ token: '6789' })

      await store.dispatch(fetchAction('https://test.com'))

      expect(store.getActions()).toEqual(expect.arrayContaining([updateAction]))
    })

    it('does not dispatch when returning null', async () => {
      fetch.mockResponse(JSON.stringify({ ok: true }), {
        headers: {
          'x-access-token': '6789'
        }
      })
      const middleware = createAuthMiddleware({
        storage,
        authenticator: testAuthenticator,
        refresh: () => null
      })
      const mockStore = configureStore([middleware])
      const data = { token: '1235' }
      const store = mockStore({ session: { data } })
      const updateAction = updateSession(null)

      await store.dispatch(fetchAction('https://test.com'))

      expect(store.getActions()).not.toEqual(
        expect.arrayContaining([updateAction])
      )
    })
  })

  describe('when request succeeds', () => {
    it('does not dispatch invalidate action', async () => {
      fetch.mockResponse(JSON.stringify({ ok: true }))
      const middleware = configureMiddleware()
      const mockStore = configureStore([middleware])
      const data = { token: '1235' }
      const store = mockStore({ session: { data } })
      const invalidateAction = invalidateSession()

      await store.dispatch(fetchAction('https://test.com'))

      expect(store.getActions()).not.toEqual(
        expect.arrayContaining([invalidateAction])
      )
    })
  })

  describe('when request returns 401 unauthorized', () => {
    it('calls authenticators invalidate', async () => {
      fetch.mockResponse(JSON.stringify({ ok: true }), { status: 401 })
      const middleware = configureMiddleware(spiedAuthenticator)
      const mockStore = configureStore([middleware])
      const data = { token: '1235' }
      const store = mockStore({
        session: { data, isAuthenticated: true, authenticator: 'test' }
      })

      await store.dispatch(fetchAction('https://test.com'))

      expect(spiedAuthenticator.invalidate).toHaveBeenCalledWith(data)

      spiedAuthenticator.authenticate.mockClear()
      spiedAuthenticator.invalidate.mockClear()
    })

    it('does not dispatch if not authenticated', async () => {
      fetch.mockResponse(JSON.stringify({ ok: true }), { status: 401 })
      const middleware = configureMiddleware()
      const mockStore = configureStore([middleware])
      const data = { token: '1235' }
      const store = mockStore({ session: { data, isAuthenticated: false } })
      const invalidateAction = invalidateSession()

      await store.dispatch(fetchAction('https://test.com'))

      expect(store.getActions()).not.toEqual(
        expect.arrayContaining([invalidateAction])
      )
    })
  })
})
