import React, { Component } from 'react';

import { connect } from 'react-redux'
import FormField from '../utils/formfield'
import { update, generateData, isFormValid } from '../utils/formactions'
import { withRouter } from 'react-router-dom'

import { loginUser } from '../../actions/user_actions'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class Login extends Component {

  state = {
    formError: false,
    errorMsg:'',
    formSuccess:'',
    formdata: {
      email: {
        element: 'input',
        value:'',
        config:{
          name:'email_input',
          type:'email',
          placeholder:'Εισάγετε διεύθυνση email'
        },
        validation:{
          required: true,
          email: true
        },
        valid: false,
        touched: false,
        validationMessage:''
      },
      password: {
        element: 'input',
        value:'',
        config:{
          name:'password_input',
          type:'password',
          placeholder:'Εισάγετε κωδικό πρόσβασης'
        },
        validation:{
          required: true,
          password: true
        },
        valid: false,
        touched: false,
        validationMessage:''
      }
    }
  }

  updateForm = (element) => {
    const newFormData = update(element,this.state.formdata,'login')

    this.setState({
      formError: false,
      formdata: newFormData
    })
  }

  submitForm = (event) => {
    event.preventDefault()

    let dataToSubmit = generateData(this.state.formdata, 'login')
    let formIsValid  = isFormValid(this.state.formdata, 'login')

    if (formIsValid) {
      this.props.dispatch(loginUser(dataToSubmit)).then(response => {
        if(response.payload.isAuth){
          this.props.history.push('/')
        }
        else {
          this.setState({
            formError: true,
            errorMsg: 'Wrong credentials'
          })
        }
      })
      .catch(err => {
        this.setState({
          formError: true,
          errorMsg: 'Wrong credentials'
        })
      })
    }
    else {
      this.setState({
        formError: true,
        errorMsg: 'Check your input'
      })
    }
  }

  render() {
    return (
      <div className="signin_wrapper">
        <Form onSubmit={(event) => this.submitForm()}>
          <FormField
            id={'email'}
            label={'Email'}
            formdata={this.state.formdata.email}
            change={(element) => this.updateForm(element)}
          />

          <FormField
            id={'password'}
            label={'Κωδικός πρόσβασης'}
            formdata={this.state.formdata.password}
            change={(element) => this.updateForm(element)}
          />

        { this.state.formError ? <div className="error_label">Error: {this.state.errorMsg}</div>
                                 : null
          }

          <Button className="bg-dark" variant="primary" type="Submit" onClick={(event) => this.submitForm(event)}>Σύνδεση</Button>
        </Form>
      </div>
    )
  }

}

export default connect()(withRouter(Login))
