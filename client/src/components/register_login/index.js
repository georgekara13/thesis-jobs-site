import React from 'react'
import MyButton from '../utils/button'
import Login from './login'

const RegisterLogin = ({}) => (
  <div className="page_wrapper">
    <div className="container">
      <div className ="register_login_container">
        <div className="right">
          <h2>Registered customers</h2>
          <p>If you have an account, please login.</p>
          <Login/>
        </div>
      </div>
    </div>
  </div>
)

export default RegisterLogin
