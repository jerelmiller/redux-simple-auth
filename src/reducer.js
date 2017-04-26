import {
  AUTHENTICATE_FAILED,
  AUTHENTICATE_SUCCEEDED,
  INVALIDATE_SESSION,
  RESTORE,
  RESTORE_FAILED
} from './actionTypes'

const initialState = {
  authenticator: null,
  isAuthenticated: false,
  data: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE_SUCCEEDED:
      return {
        ...state,
        authenticator: action.authenticator,
        isAuthenticated: true,
        data: action.payload
      }
    case AUTHENTICATE_FAILED:
    case INVALIDATE_SESSION:
    case RESTORE_FAILED:
      return {
        ...state,
        authenticator: null,
        isAuthenticated: false,
        data: {}
      }
    case RESTORE: {
      const { authenticator, ...data } = action.payload

      return {
        ...state,
        authenticator,
        data,
        isAuthenticated: true
      }
    }
    default:
      return state
  }
}

export default reducer
