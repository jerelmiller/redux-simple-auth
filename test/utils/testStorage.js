export default () => ({
  persist: jest.fn(),
  restore: jest.fn(() => ({
    authenticated: {
      authenticator: 'test'
    }
  }))
})
