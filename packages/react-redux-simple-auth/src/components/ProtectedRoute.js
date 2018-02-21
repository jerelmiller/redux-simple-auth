import React from 'react'
import Session from './Session'
import { Redirect, Route } from 'react-router-dom'

const ProtectedRoute = ({ component: Component, to, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Session
        render={({ isAuthenticated }) =>
          isAuthenticated ? <Component {...props} /> : <Redirect to={to} />
        }
      />
    )}
  />
)

export default ProtectedRoute
