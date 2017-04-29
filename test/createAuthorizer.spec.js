import { createAuthorizer } from '../src'

describe('createAuthorizer', () => {
  it('returns authorizer', () => {
    const authorizer = createAuthorizer({
      name: 'jwt',
      authorize() {}
    })

    expect(authorizer).toHaveProperty('name')
    expect(authorizer).toHaveProperty('authorize')
  })
})
