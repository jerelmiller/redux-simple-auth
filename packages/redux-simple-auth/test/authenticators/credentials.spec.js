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

it('resolves with returned data by default', () => {
  fetch.mockResponse(JSON.stringify({ token: '12345' }))
  const credentials = createCredentialsAuthenticator({
    endpoint: '/authenticate'
  })
  const creds = { email: 'text@example.com', password: 'password' }

  const promise = credentials.authenticate(creds)

  expect(promise).resolves.toEqual({ token: '12345' })
})
