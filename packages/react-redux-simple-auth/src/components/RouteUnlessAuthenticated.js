import React from 'react'
import Session from './Session'
import { Redirect, Route } from 'react-router-dom'

const RouteUnlessAuthenticated = ({ component: Component, to, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Session
        render={({ isAuthenticated }) =>
          isAuthenticated ? <Redirect to={to} /> : <Component {...props} />
        }
      />
    )}
  />
)

export default RouteUnlessAuthenticated
