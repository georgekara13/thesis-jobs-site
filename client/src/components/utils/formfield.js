import React from 'react'
import Form from 'react-bootstrap/Form'

const FormField = ({formdata, change, id, label}) => {

  const showError = () => {
    let errorMessage = null

    if (formdata.validation && !formdata.valid) {
      errorMessage = (
        <div className="error_label">{formdata.validationMessage}</div>
      )
    }

    return errorMessage
  }

  const RenderTemplate = () => {
    let formTemplate = null

    switch(formdata.element){
      case('input'):
        formTemplate = (
          <Form.Group controlId={id}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
              type={id}
              {...formdata.config}
              value={formdata.value}
              onBlur={(event) => change({event,id,blur:true})}
              onChange={(event) => change({event,id})}
            />
          {showError()}
          </Form.Group>
        )
        break
      default:
        formTemplate = null
    }

    return formTemplate
  }

  return (
    <div>{RenderTemplate()}</div>
  )
}

export default FormField
