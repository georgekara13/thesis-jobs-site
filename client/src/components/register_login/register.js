import React, { Component } from 'react'
import FormField from '../utils/formfield'
import { update, generateData, isFormValid } from '../utils/formactions'
import { withRouter } from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog'
import Button from 'react-bootstrap/Button'
import faUser from '@fortawesome/fontawesome-free-solid/faUser'
import faKey from '@fortawesome/fontawesome-free-solid/faKey'
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope'

import { connect } from 'react-redux'
import { registerUser } from '../../actions/user_actions'

class Register extends Component {
  state = {
    formError: false,
    errorMessage: '',
    formSuccess: false,
    formdata: {
      userName: {
        element: 'input',
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
      email: {
        element: 'input',
        value: '',
        config: {
          name: 'email_input',
          type: 'email',
          placeholder: 'Εισάγετε email',
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
      confirmPassword: {
        element: 'input',
        value: '',
        config: {
          name: 'confirm_password_input',
          type: 'password',
          placeholder: 'Επιβεβαιώστε τον κωδικό πρόσβασης',
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
          if (response.payload.token) {
            this.setState({
              formError: false,
              formSuccess: true,
            })
            this.props.history.push('/')
          } else {
            this.setState({
              ...this.state,
              formError: true,
              errorMessage: response.payload.message,
            })
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
        errorMessage: 'Σφάλμα: Παρακαλούμε ελέγξτε τα πεδία',
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
      <div className="signin_wrapper">
        <form onSubmit={(event) => this.submitForm(event)}>
          <h2>Εγγραφή</h2>
          <div className="form_block_two">
            <div className="block">
              <FormField
                icon={faUser}
                label={'Όνομα χρήστη'}
                id={'userName'}
                formdata={this.state.formdata.userName}
                change={(element) => this.updateForm(element)}
              />
            </div>
          </div>
          <div>
            <FormField
              id={'email'}
              icon={faEnvelope}
              label={'Email'}
              formdata={this.state.formdata.email}
              change={(element) => this.updateForm(element)}
            />
          </div>
          <div className="form_block_two">
            <div className="block">
              <FormField
                id={'password'}
                icon={faKey}
                label={'Κωδικός πρόσβασης'}
                formdata={this.state.formdata.password}
                change={(element) => this.updateForm(element)}
              />
            </div>
            <div className="block">
              <FormField
                id={'confirmPassword'}
                icon={faKey}
                label={'Επιβεβαίωση κωδικού πρόσβασης'}
                formdata={this.state.formdata.confirmPassword}
                change={(element) => this.updateForm(element)}
              />
            </div>
          </div>
          {this.state.formError ? (
            <p className="error_label">{this.state.errorMessage}</p>
          ) : (
            ''
          )}
          <div>
            <Button
              variant="primary"
              type="Submit"
              onClick={(event) => this.submitForm(event)}
            >
              Εγγραφή
            </Button>
            <span
              className="register_text"
              onClick={() => this.props.showLogin(true)}
            >
              ...ή σύνδεση
            </span>
          </div>
        </form>

        <Dialog open={this.state.formSuccess}>
          <div className="dialog_alert">
            <div>Ευχαριστούμε για την εγγραφή</div>
            <div>Μετάβαση στο πεδίο σύνδεσης...</div>
          </div>
        </Dialog>
      </div>
    )
  }
}

export default connect()(withRouter(Register))
