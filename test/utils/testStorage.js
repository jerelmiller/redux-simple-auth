export default () => ({
  persist: jest.fn(data => Promise.resolve(data)),
  restore: jest.fn(() =>
    Promise.resolve({ authenticated: { authenticator: 'test' }})
  )
})
