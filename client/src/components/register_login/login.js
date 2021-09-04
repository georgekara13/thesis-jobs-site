import React, { Component } from 'react'

import { connect } from 'react-redux'
import FormField from '../utils/formfield'
import { update, generateData, isFormValid } from '../utils/formactions'
import { withRouter } from 'react-router-dom'

import { loginUser } from '../../actions/user_actions'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import faUser from '@fortawesome/fontawesome-free-solid/faUser'
import faKey from '@fortawesome/fontawesome-free-solid/faKey'

class Login extends Component {
  state = {
    formError: false,
    errorMsg: '',
    formSuccess: '',
    formdata: {
      email: {
        element: 'input',
        className: 'text-light',
        value: '',
        config: {
          name: 'email_input',
          type: 'email',
          placeholder: 'Εισάγετε διεύθυνση email',
        },
        validation: {
          required: true,
          email: true,
        },
        valid: false,
        touched: false,
        validationMessage: '',
      },
      password: {
        element: 'input',
        className: 'text-light',
        value: '',
        config: {
          name: 'password_input',
          type: 'password',
          placeholder: 'Εισάγετε κωδικό πρόσβασης',
        },
        validation: {
          required: true,
          password: true,
        },
        valid: false,
        touched: false,
        validationMessage: '',
      },
    },
  }

  updateForm = (element) => {
    const newFormData = update(element, this.state.formdata, 'login')

    this.setState({
      formError: false,
      formdata: newFormData,
    })
  }

  submitForm = () => {
    this.props
      .dispatch(loginUser())
      .then((response) => {
        if (response.payload.isAuth) {
          this.props.history.push('/')
        } else {
          this.setState({
            formError: true,
            errorMsg: 'Λάθος στοιχεία εισόδου',
          })
        }
      })
      .catch((err) => {
        this.setState({
          formError: true,
          errorMsg: 'Λάθος στοιχεία εισόδου',
        })
      })
  }

  render() {
    return (
      <div className="signin_wrapper">
        <p>Κεντρική υπηρεσία πιστοποίησης</p>
        <Button
          className="bck-blue"
          variant="primary"
          type="Submit"
          onClick={() => this.submitForm()}
        >
          Σύνδεση
        </Button>
      </div>
    )
  }
}

export default connect()(withRouter(Login))
