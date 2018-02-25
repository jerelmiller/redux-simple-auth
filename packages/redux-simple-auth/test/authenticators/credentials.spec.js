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
