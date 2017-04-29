import { createAuthorizer } from '../src'

describe('createAuthorizer', () => {
  it('returns authorizer', () => {
    const authorizer = createAuthorizer({
      name: 'jwt',
      authenticate() {}
    })

    expect(authorizer).toHaveProperty('name')
    expect(authorizer).toHaveProperty('authenticate')
  })
})
