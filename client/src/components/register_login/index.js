import React from 'react'
import MyButton from '../utils/button'
import Login from './login'

const RegisterLogin = ({}) => (
  <div className="page_wrapper">
    <div className="container">
      <div className ="register_login_container">
        <div className="right">
          <h2>Είσοδος με τα διαπιστευτήρια του πανεπιστημίου</h2>
          <p>Παρακαλούμε χρησιμοποιήστε τα στοιχεία εισόδου του πανεπιστημίου.</p>
          <Login/>
        </div>
      </div>
    </div>
  </div>
)

export default RegisterLogin
