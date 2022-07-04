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
      username: {
        element: 'input',
        className: 'text-light',
        value: '',
        config: {
          name: 'username_input',
          type: 'text',
          placeholder: 'Εισάγετε όνομα χρήστη',
        },
        validation: {
          required: true,
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

  submitForm = (event) => {
    event.preventDefault()

    let dataToSubmit = generateData(this.state.formdata, 'login')
    let formIsValid = isFormValid(this.state.formdata, 'login')

    if (formIsValid) {
      this.props
        .dispatch(loginUser(dataToSubmit))
        .then((response) => {
          if (response.payload.token) {
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
    } else {
      this.setState({
        formError: true,
        errorMsg: 'Ελέγξτε τα πεδία',
      })
    }
  }

  render() {
    return (
      <div className="signin_wrapper">
        <Form onSubmit={(event) => this.submitForm()}>
          <FormField
            id={'username'}
            icon={faUser}
            label={'Όνομα χρήστη'}
            formdata={this.state.formdata.username}
            change={(element) => this.updateForm(element)}
          />

          <FormField
            id={'password'}
            icon={faKey}
            label={'Κωδικός πρόσβασης'}
            formdata={this.state.formdata.password}
            change={(element) => this.updateForm(element)}
          />

          {this.state.formError ? (
            <div className="error_label">Σφάλμα: {this.state.errorMsg}</div>
          ) : null}

          <Button
            className="bg-dark"
            variant="primary"
            type="Submit"
            onClick={(event) => this.submitForm(event)}
          >
            Σύνδεση
          </Button>
        </Form>
      </div>
    )
  }
}

export default connect()(withRouter(Login))
