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

it('allows content-type to be overridden', () => {
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
