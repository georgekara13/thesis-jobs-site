import React, { Component } from 'react'
import { logoutUser } from '../../actions/user_actions'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

class LogOut extends Component {
  state = {}
  componentDidMount() {
    this.props.dispatch(logoutUser()).then((response) => {
      if (response.payload.sucess) {
        this.props.history.push('/')
      }
    })
  }

  render() {
    return <div>Signing out...</div>
  }
}

export default connect()(withRouter(LogOut))
