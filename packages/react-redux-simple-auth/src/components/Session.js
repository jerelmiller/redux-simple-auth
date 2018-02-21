import { connect } from 'react-redux'
import {
  getIsAuthenticated,
  getAuthenticator,
  getHasFailedAuth,
  getIsRestored,
  getSessionData
} from 'redux-simple-auth'

const Session = ({ render, ...session }) => render(session)

const mapStateToProps = state => ({
  authenticator: getAuthenticator(state),
  data: getSessionData(state),
  hasFailedAuth: getHasFailedAuth(state),
  isAuthenticated: getIsAuthenticated(state),
  isRestored: getIsRestored(state)
})

export default connect(mapStateToProps)(Session)
