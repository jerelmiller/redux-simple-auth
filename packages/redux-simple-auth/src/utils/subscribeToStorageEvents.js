import warning from 'warning'

export default (storage, fn) => {
  if (!storage.__syncsAcrossTabs) {
    warning(
      false,
      'You are trying to use a storage device that does not emit storage ' +
        'events. Please use the localStorage store or the sessionStorage store.'
    )
    return
  }

  window.addEventListener('storage', e => {
    if (!e.isTrusted || e.key !== storage.__key || e.newValue === e.oldValue) {
      return
    }

    try {
      fn(JSON.parse(e.newValue))
    } catch (e) {
      fn({})
    }
  })
}
