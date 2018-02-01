import isPlainObject from 'lodash.isplainobject'
import { initialize } from './actions'
import reducer from './reducer'

const validateStorage = storage => {
  if (!isPlainObject(storage) || storage.restore == null) {
    throw new Error(
      'Expected `storage` to be a valid storage. You either forgot to ' +
        'include it or you passed an invalid storage object'
    )
  }
}

const enhancer = ({ storage } = {}) => {
  validateStorage(storage)

  return createStore => (rootReducer, preloadedState, enhancer) => {
    const initialState = {
      session: reducer(null, initialize(storage.restore())),
      ...preloadedState
    }

    return createStore(rootReducer, initialState, enhancer)
  }
}

export default enhancer
