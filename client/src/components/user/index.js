import React from 'react'
import PropTypes from 'prop-types'
import UserLayout from '../../hoc/user'
import MyButton from '../utils/button'

//user is getting passed as props from the auth hoc
const UserDashboard = ({user}) => {
  return (
    <UserLayout>
      <div>
        <div className="user_nfo_panel">
          <h1>User Information</h1>
          <div>
            <span>{user.userData.name}</span>
            <span>{user.userData.lastname}</span>
            <span>{user.userData.email}</span>
          </div>

          <MyButton
            type="default"
            title="Edit account info"
            linkTo="user/profile"
          />
        </div>

        <div className="user_nfo_panel">
          <h1>Purchase history</h1>
          <div className="user_product_block_wrapper">
            history
          </div>
        </div>
      </div>
    </UserLayout>
  )
}

export default UserDashboard
