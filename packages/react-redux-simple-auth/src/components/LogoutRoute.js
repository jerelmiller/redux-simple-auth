import React from 'react'
import Logout from './Logout'
import { Route } from 'react-router-dom'

const LogoutRoute = ({ redirect, ...props }) => (
  <Route
    {...props}
    render={props => <Logout redirect={redirect} {...props} />}
  />
)

export default LogoutRoute
