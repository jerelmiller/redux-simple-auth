import createCredentialsAuthenticator from '../../src/authenticators/credentials'

beforeEach(() => {
  fetch.resetMocks()
})

it('fetches from given endpoint using default config', () => {
  fetch.mockResponse(JSON.stringify({ ok: true }))
  const credentials = createCredentialsAuthenticator({
    endpoint: '/authenticate'
  })
  const creds = { email: 'text@example.com', password: 'password' }

  credentials.authenticate(creds)

  expect(fetch).toHaveBeenCalledWith('/authenticate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds)
  })
})

it('resolves with returned data by default', async () => {
  fetch.mockResponse(JSON.stringify({ token: '12345' }))
  const credentials = createCredentialsAuthenticator({
    endpoint: '/authenticate'
  })

  const promise = credentials.authenticate({
    email: 'text@example.com',
    password: 'password'
  })

  await expect(promise).resolves.toEqual({ token: '12345' })
})

it('handles invalid responses', async () => {
  const error = { error: 'Wrong email or password' }
  fetch.mockResponse(JSON.stringify(error), { status: 401 })
  const credentials = createCredentialsAuthenticator({
    endpoint: '/authenticate'
  })

  const promise = credentials.authenticate({
    email: 'text@example.com',
    password: 'password'
  })

  await expect(promise).rejects.toEqual(error)
})

it('throws invariant if `endpoint` is not given', () => {
  expect(() => createCredentialsAuthenticator()).toThrow(
    'You must provide an endpoint for the `credentials` authenticator'
  )
})

it('allows content-type to be configured', () => {
  fetch.mockResponse(JSON.stringify({ ok: true }))
  const credentials = createCredentialsAuthenticator({
    endpoint: '/authenticate',
    contentType: 'application/vnd.api+json'
  })
  const creds = { email: 'text@example.com', password: 'password' }

  credentials.authenticate(creds)

  expect(fetch).toHaveBeenCalledWith('/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.api+json'
    },
    body: JSON.stringify(creds)
  })
})

it('allows headers to be configured', () => {
  fetch.mockResponse(JSON.stringify({ ok: true }))
  const credentials = createCredentialsAuthenticator({
    endpoint: '/authenticate',
    headers: {
      Accept: 'text/html',
      'X-Token': '1234'
    }
  })
  const creds = { email: 'text@example.com', password: 'password' }

  credentials.authenticate(creds)

  expect(fetch).toHaveBeenCalledWith('/authenticate', {
    method: 'POST',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'application/json',
      'X-Token': '1234'
    },
    body: JSON.stringify(creds)
  })
})

it('allows method to be configured', () => {
  fetch.mockResponse(JSON.stringify({ ok: true }))
  const credentials = createCredentialsAuthenticator({
    endpoint: '/authenticate',
    method: 'PUT'
  })
  const creds = { email: 'text@example.com', password: 'password' }

  credentials.authenticate(creds)

  expect(fetch).toHaveBeenCalledWith('/authenticate', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(creds)
  })
})

it('allows request body to be transform by configuration', () => {
  fetch.mockResponse(JSON.stringify({ ok: true }))
  const transformRequest = creds =>
    Object.keys(creds)
      .map(
        key => `${encodeURIComponent(key)}=${encodeURIComponent(creds[key])}`
      )
      .join('&')
  const credentials = createCredentialsAuthenticator({
    endpoint: '/authenticate',
    contentType: 'application/x-www-form-urlencoded',
    transformRequest
  })
  const creds = { email: 'text@example.com', password: 'password' }

  credentials.authenticate(creds)

  expect(fetch).toHaveBeenCalledWith('/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: transformRequest(creds)
  })
})

it('allows response to be transformed by configuration', async () => {
  fetch.mockResponse(JSON.stringify({ response: { token: '1234' } }))
  const credentials = createCredentialsAuthenticator({
    endpoint: '/authenticate',
    contentType: 'application/x-www-form-urlencoded',
    transformResponse: data => ({ token: data.response.token })
  })
  const creds = { email: 'text@example.com', password: 'password' }

  const promise = credentials.authenticate(creds)

  await expect(promise).resolves.toEqual({ token: '1234' })
})

it('default restore resolves if data exists', async () => {
  const credentials = createCredentialsAuthenticator({
    endpoint: '/authenticate'
  })

  const promise = credentials.restore({ token: '1234' })

  await expect(promise).resolves.toEqual({ token: '1234' })
})

it('default restore rejects if no data', async () => {
  const credentials = createCredentialsAuthenticator({
    endpoint: '/authenticate'
  })

  const promise = credentials.restore({})

  await expect(promise).rejects.toBeUndefined()
})

it('allows restore to be configured', async () => {
  const credentials = createCredentialsAuthenticator({
    endpoint: '/authenticate',
    restore: data => {
      if (data.token === 'secret-key') {
        return Promise.resolve(data)
      }

      return Promise.reject()
    }
  })

  const valid = credentials.restore({ token: 'secret-key' })
  const invalid = credentials.restore({ token: 'nope' })

  await expect(valid).resolves.toEqual({ token: 'secret-key' })
  await expect(invalid).rejects.toBeUndefined()
})

it('has default invalidate', async () => {
  const credentials = createCredentialsAuthenticator({
    endpoint: '/authenticate'
  })

  const promise = credentials.invalidate({})

  await expect(promise).resolves.toEqual({})
})

it('allows invalidate to be configured', () => {
  const invalidate = jest.fn()
  const credentials = createCredentialsAuthenticator({
    endpoint: '/authenticate',
    invalidate
  })
  const data = { token: '1234' }

  credentials.invalidate(data)

  expect(invalidate).toHaveBeenCalledWith(data)
})
