import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { logoutUser } from '../../actions/user_actions'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'

class Header extends Component {

  state = {
    page: [
      {
        name: 'ΑΡΧΙΚΗ',
        linkTo: '/',
        public: true
      },
      {
        name: 'ΕΙΣΟΔΟΣ',
        linkTo: '/login',
        public: true
      }
    ],
    user: [
      {
        name: 'My Account',
        linkTo: '/user/dashboard',
        public: false
      },
      {
        name: 'Log out',
        linkTo: '/user/logout',
        public: false
      }
    ]
  }

  defaultLink = (item, i) => (
    item.name === 'Log out' ?
    <Nav.Link className="log_out_link" key={i} onClick={() => this.logOutHandler()}>
      {item.name}
    </Nav.Link>
    :
    <Nav.Link><Link to={item.linkTo} key={i}>
      {item.name}
    </Link></Nav.Link>
  )

  logOutHandler = () => {
    this.props.dispatch(logoutUser()).then(response => {
      if (response.payload.sucess){
        this.props.history.push('/')
      }
    })
  }

  showLinks = (type) => {
    let list = []

    if(this.props.user.userData){
      type.forEach(item => {
        //check if user is authenticated
        if (!this.props.user.userData.isAuth){
          //push public links
          if (item.public){
            list.push(item)
          }
        }
        else {
          //push all items but the login, for authenticated user
          if (item.name !== 'Log in'){
            list.push(item)
          }
        }
      })
    }

    return list.map((item,i)  =>  {
      return this.defaultLink(item,i)
    })
  }

  render() {
    return (
      <Navbar expand="lg" className="bck-blue">
        <Navbar.Brand>UOP Jobsite</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
              {this.showLinks(this.state.user)}
              {this.showLinks(this.state.page)}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

}

function mapStateToProps(state){
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(withRouter(Header))
