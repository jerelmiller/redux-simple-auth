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
  lastError: null,
  data: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE:
      const { authenticated: { authenticator, ...data } = {} } = action.payload

      return {
        authenticator,
        data,
        isAuthenticated: false,
        lastError: null
      }
    case AUTHENTICATE_SUCCEEDED:
      return {
        ...state,
        authenticator: action.meta.authenticator,
        isAuthenticated: true,
        data: action.payload,
        lastError: null
      }
    case AUTHENTICATE_FAILED:
      return {
        ...state,
        authenticator: null,
        isAuthenticated: false,
        isRestored: true,
        lastError: action.payload,
        data: {}
      }
    case INVALIDATE_SESSION:
    case RESTORE_FAILED:
      return {
        ...state,
        authenticator: null,
        isAuthenticated: false,
        isRestored: true,
        lastError: null,
        data: {}
      }
    case RESTORE: {
      const { authenticator, ...data } = action.payload

      return {
        ...state,
        authenticator,
        data,
        isAuthenticated: true,
        isRestored: true,
        lastError: null
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
