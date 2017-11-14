import enhancer from '../src/enhancer'
import createMockStorage from './utils/testStorage'

describe('enhancer', () => {
  it('returns enhanced store with initial storage state', () => {
    const enhancedCreateStore = enhancer({ storage: createMockStorage() })

    expect(enhancedCreateStore).toBeInstanceOf(Function)
  })

  it('sets up store with initial storage state', () => {
    const mock = jest.fn()
    const dummyData = {
      authenticated: {
        authenticator: 'dummy',
        token: 'abcde'
      }
    }
    const storage = createMockStorage(dummyData)
    const createStore = jest.fn()

    enhancer({ storage })(createStore)(mock, null, mock)

    expect(createStore).toHaveBeenCalledWith(
      mock,
      {
        session: {
          authenticator: 'dummy',
          data: { token: 'abcde' },
          isAuthenticated: false,
          lastError: null
        }
      },
      mock
    )
  })

  it('throws when no storage given', () => {
    expect(() => enhancer({ storage: null })).toThrow(
      'Expected `storage` to be a valid storage. You either forgot to ' +
        'include it or you passed an invalid storage object'
    )
  })
})
