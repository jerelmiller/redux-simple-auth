const createLocalStorageMock = () => {
  let store = {}

  return {
    setItem(key, value) {
      store[key] = value.toString()
    },
    getItem(key) {
      return store[key] || null
    },
    removeItem(key) {
      delete store[key]
    },
    clear() {
      store = {}
    }
  }
}

Object.defineProperty(window, 'localStorage', {
  value: createLocalStorageMock()
})
