import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { logoutUser } from '../../actions/user_actions'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

class Header extends Component {
  state = {
    page: [
      {
        name: 'ΑΡΧΙΚΗ',
        linkTo: '/',
        public: false,
      },
      {
        name: 'ΕΙΣΟΔΟΣ',
        linkTo: '/login',
        public: true,
      },
    ],
    user: [
      {
        name: 'ΑΠΟΘΗΚΕΥΜΕΝΑ',
        linkTo: '/user/favourites',
        public: false,
      },
      {
        name: 'ΑΠΟΣΥΝΔΕΣΗ',
        linkTo: '/login',
        public: false,
      },
    ],
  }

  defaultLink = (item, i) =>
    item.name === 'ΑΠΟΣΥΝΔΕΣΗ' ? (
      <Nav.Item key={i} onClick={() => this.logOutHandler()}>
        <Nav.Link href={item.linkTo}>{item.name}</Nav.Link>
      </Nav.Item>
    ) : (
      <Nav.Item key={i}>
        <Nav.Link href={item.linkTo}>{item.name}</Nav.Link>
      </Nav.Item>
    )

  logOutHandler = () => {
    this.props.dispatch(logoutUser()).then((response) => {
      if (response.payload.sucess) {
        this.props.history.push('/')
      }
    })
  }

  showLinks = (type) => {
    let list = []

    if (this.props.user.userData) {
      type.forEach((item) => {
        //check if user is authenticated
        if (!this.props.user.userData.token) {
          //push public links
          if (item.public) {
            list.push(item)
          }
        } else {
          //push all items but the login, for authenticated user
          if (item.name !== 'ΕΙΣΟΔΟΣ') {
            list.push(item)
          }
        }
      })
    }

    return list.map((item, i) => {
      return this.defaultLink(item, i)
    })
  }

  render() {
    return (
      <Navbar sticky="top" className="navbar-dark bg-dark" expand="lg">
        <Navbar.Brand>
          <img
            src="/assets/images/uop-logo-50x50.png"
            width="50"
            height="50"
            className="d-inline-block align-top"
            alt="UOP Job Site logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {this.showLinks(this.state.page)}
            {this.showLinks(this.state.user)}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(withRouter(Header))
