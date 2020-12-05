import React, { Component } from 'react'

import Search from '../search'
import Announcements from '../announcements'

class Home extends Component {

  render() {
    return (
      <div className="general_wrapper">
        <Search/>
        <Announcements/>
      </div>
    )
  }

}

export default Home
