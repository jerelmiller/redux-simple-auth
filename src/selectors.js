import * as fromSession from './reducer'

export const getSessionData = state => fromSession.getData(state.session)

export const getIsAuthenticated = state =>
  fromSession.getIsAuthenticated(state.session)

export const getAuthenticator = state =>
  fromSession.getAuthenticator(state.session)
