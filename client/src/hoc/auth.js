import React from 'react'
import { connect } from 'react-redux'
import { authUserCheck } from '../actions/user_actions'
import CircularProgress from '@material-ui/core/CircularProgress'
import Cookies from 'js-cookie'

export default function (ComposedClass, reload, adminRoute = null) {
  class AuthenticationCheck extends React.Component {
    state = {
      loading: true,
    }

    componentDidMount() {
      const token = Cookies.get('userSession') || ''
      //let user = this.props.user.userData

      this.props.dispatch(authUserCheck({ token })).then((response) => {
        const { isAuth, roles } = response.payload
        if (!isAuth) {
          if (reload) {
            this.props.history.push('/login')
          }
          this.props.history.push('/login')
        } else {
          if (!reload) {
            this.props.history.push('/')
          }
        }
      })
      this.setState({ loading: false })
    }

    render() {
      if (this.state.loading) {
        return (
          <div className="main_loader">
            <CircularProgress style={{ color: '#2196F3' }} thickness={7} />
          </div>
        )
      }

      return <ComposedClass {...this.props} user={this.props.user} />
    }
  }

  function mapStateToProps(state) {
    return {
      user: state.user,
    }
  }

  return connect(mapStateToProps)(AuthenticationCheck)
}
