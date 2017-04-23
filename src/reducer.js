import {
  AUTHENTICATE_SUCCEEDED,
  INVALIDATE_SESSION
} from './actionTypes'
const defaultState = {
  isAuthenticated: false,
  data: {}
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case AUTHENTICATE_SUCCEEDED:
      return { ...state, isAuthenticated: true }
    case INVALIDATE_SESSION:
      return { ...state, isAuthenticated: false }
    default:
      return state
  }
}

export default reducer
