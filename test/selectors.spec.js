import * as selectors from '../src/selectors'

describe('selectors', () => {
  it('includes selector to get session data', () => {
    const state = {
      session: {
        data: { token: 'abcde' }
      }
    }

    const result = selectors.getSessionData(state)

    expect(result).toEqual({ token: 'abcde' })
  })

  it('includes selector to get isAuthenticated', () => {
    const state = {
      session: {
        isAuthenticated: true
      }
    }

    const result = selectors.getIsAuthenticated(state)

    expect(result).toEqual(true)
  })

  it('includes selector to get authenticator', () => {
    const state = {
      session: {
        authenticator: 'credentials'
      }
    }

    const result = selectors.getAuthenticator(state)

    expect(result).toEqual('credentials')
  })
})
