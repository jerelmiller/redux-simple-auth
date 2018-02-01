import fetch from 'jest-fetch-mock'

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

const createSessionStorageMock = () => {
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

global.fetch = fetch
global.localStorage = createLocalStorageMock()
global.sessionStorage = createSessionStorageMock()
