const LOCAL_STORAGE_TEST_KEY = '_redux-simple-auth-test'

export const isLocalStorageAvailable = () => {
  try {
    localStorage.setItem(LOCAL_STORAGE_TEST_KEY, true)
    localStorage.removeItem(LOCAL_STORAGE_TEST_KEY)
    return true
  } catch (e) {
    return false
  }
}
