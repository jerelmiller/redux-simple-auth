const createLocalStorageMock = () => {
  const store = {}

  return {
    setItem(key, value) {
      store[key] = value.toString()
    },
    getItem(key) {
      return store[key] || null
    },
    removeItem(key) {
      delete store[key]
    }
  }
}

Object.defineProperty(window, 'localStorage', {
  value: createLocalStorageMock()
})
