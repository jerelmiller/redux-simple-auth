import enhancer from '../src/enhancer'
import createMockStorage from './utils/testStorage'

describe('enhancer', () => {
  it('returns enhanced store with initial storage state', () => {
    const enhancedCreateStore = enhancer()

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

    const enhancedCreateStore = enhancer({ storage })(createStore)(
      mock,
      null,
      mock
    )

    expect(createStore).toHaveBeenCalledWith(
      mock,
      {
        session: {
          authenticator: 'dummy',
          data: { token: 'abcde' },
          isAuthenticated: false
        }
      },
      mock
    )
  })
})
