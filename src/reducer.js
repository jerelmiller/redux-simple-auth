import { INVALIDATE_SESSION } from './actionTypes'
const defaultState = {
  isAuthenticated: false,
  data: {}
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case INVALIDATE_SESSION:
      return { ...state, isAuthenticated: false }
    default:
      return state
  }
}

export default reducer
