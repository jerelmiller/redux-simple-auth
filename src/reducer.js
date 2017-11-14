import {
  AUTHENTICATE_FAILED,
  AUTHENTICATE_SUCCEEDED,
  INITIALIZE,
  INVALIDATE_SESSION,
  RESTORE,
  RESTORE_FAILED
} from './actionTypes'

const initialState = {
  authenticator: null,
  isAuthenticated: false,
  isRestored: false,
  data: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE:
      const { authenticated: { authenticator, ...data } = {} } = action.payload

      return {
        authenticator,
        data,
        isAuthenticated: false
      }
    case AUTHENTICATE_SUCCEEDED:
      return {
        ...state,
        authenticator: action.meta.authenticator,
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
        isRestored: true,
        data: {}
      }
    case RESTORE: {
      const { authenticator, ...data } = action.payload

      return {
        ...state,
        authenticator,
        data,
        isAuthenticated: true,
        isRestored: true
      }
    }
    default:
      return state
  }
}

export default reducer

export const getData = state => state.data
export const getIsAuthenticated = state => state.isAuthenticated
export const getAuthenticator = state => state.authenticator
export const getIsRestored = state => state.isRestored
