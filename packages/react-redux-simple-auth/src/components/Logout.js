import React, { Component } from 'react'
import { connect } from 'react-redux'
import { invalidateSession } from 'redux-simple-auth'
import { Redirect, withRouter } from 'react-router-dom'

class Logout extends Component {
  static defaultProps = {
    redirect: '/'
  }

  componentDidMount() {
    this.props.invalidateSession()
  }

  render() {
    return <Redirect to={this.props.redirect} />
  }
}

export default withRouter(connect(null, { invalidateSession })(Logout))
