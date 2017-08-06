const dummyData = {
  authenticated: {
    authenticator: 'test'
  }
}

export default (data = dummyData) => ({
  persist: jest.fn(),
  restore: jest.fn(() => data)
})
