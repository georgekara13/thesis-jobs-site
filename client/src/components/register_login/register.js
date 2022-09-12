import React, { Component } from 'react'
import FormField from '../utils/formfield'
import { update, generateData, isFormValid } from '../utils/formactions'
import { withRouter } from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog'

import { connect } from 'react-redux'
import { registerUser } from '../../actions/user_actions'

class Register extends Component {
  state = {
    formError: false,
    formSuccess: false,
    formdata: {
      name: {
        element: 'input',
        value: '',
        config: {
          name: 'name_input',
          type: 'text',
          placeholder: 'Enter your name',
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: '',
      },
      lastname: {
        element: 'input',
        value: '',
        config: {
          name: 'lastname_input',
          type: 'text',
          placeholder: 'Enter your last name',
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: '',
      },
      email: {
        element: 'input',
        value: '',
        config: {
          name: 'email_input',
          type: 'email',
          placeholder: 'Enter your email',
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
        value: '',
        config: {
          name: 'password_input',
          type: 'password',
          placeholder: 'Enter your password',
        },
        validation: {
          required: true,
          password: true,
        },
        valid: false,
        touched: false,
        validationMessage: '',
      },
      confirmPassword: {
        element: 'input',
        value: '',
        config: {
          name: 'confirm_password_input',
          type: 'password',
          placeholder: 'Confirm your password',
        },
        validation: {
          required: true,
          confirm: 'password',
        },
        valid: false,
        touched: false,
        validationMessage: '',
      },
    },
  }

  submitForm = (event) => {
    event.preventDefault()

    let dataToSubmit = generateData(this.state.formdata, 'register')
    let formIsValid = isFormValid(this.state.formdata, 'register')

    if (formIsValid) {
      this.props
        .dispatch(registerUser(dataToSubmit))
        .then((response) => {
          if (response.payload.success) {
            this.setState({
              formError: false,
              formSuccess: true,
            })
            setTimeout(() => {
              this.props.history.push('/register_login')
            }, 3000)
          } else {
            this.setState({ formError: true })
          }
        })
        .catch((error) => {
          this.setState({
            formError: true,
          })
        })
    } else {
      this.setState({
        formError: true,
      })
    }
  }

  updateForm = (element) => {
    const newFormData = update(element, this.state.formdata, 'register')

    this.setState({
      formError: false,
      formdata: newFormData,
    })
  }

  render() {
    return (
      <div className="page_wrapper">
        <div className="container">
          <div className="register_login_container">
            <div className="left">
              <form onSubmit={(event) => this.submitForm(event)}>
                <h2>Personal Information</h2>
                <div className="form_block_two">
                  <div className="block">
                    <FormField
                      id={'name'}
                      formdata={this.state.formdata.name}
                      change={(element) => this.updateForm(element)}
                    />
                  </div>
                  <div className="block">
                    <FormField
                      id={'lastname'}
                      formdata={this.state.formdata.lastname}
                      change={(element) => this.updateForm(element)}
                    />
                  </div>
                </div>
                <div>
                  <FormField
                    id={'email'}
                    formdata={this.state.formdata.email}
                    change={(element) => this.updateForm(element)}
                  />
                </div>
                <h2>Verify Password</h2>
                <div className="form_block_two">
                  <div className="block">
                    <FormField
                      id={'password'}
                      formdata={this.state.formdata.password}
                      change={(element) => this.updateForm(element)}
                    />
                  </div>
                  <div className="block">
                    <FormField
                      id={'confirmPassword'}
                      formdata={this.state.formdata.confirmPassword}
                      change={(element) => this.updateForm(element)}
                    />
                  </div>
                </div>
                <div>
                  <button onClick={(event) => this.submitForm(event)}>
                    Sign Up
                  </button>
                  <span
                    className="register_text"
                    onClick={() => this.props.showLogin(true)}
                  >
                    ...ή σύνδεση
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>

        <Dialog open={this.state.formSuccess}>
          <div className="dialog_alert">
            <div>Thanks for joining us!</div>
            <div>Redirecting to user login...</div>
          </div>
        </Dialog>
      </div>
    )
  }
}

export default connect()(withRouter(Register))
