export default () => ({
  clear: jest.fn(() => Promise.resolve()),
  persist: jest.fn(data => Promise.resolve(data)),
  restore: jest.fn(() => Promise.resolve({ authenticated: {}}))
})
