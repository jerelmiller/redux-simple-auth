export default (initialData = {}) => {
  let data = initialData

  return {
    reset: () => (data = initialData),
    getData: () => data,
    persist: d => (data = d),
    restore: jest.fn(() => data)
  }
}
