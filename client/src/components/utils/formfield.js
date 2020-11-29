import React from 'react'
import Form from 'react-bootstrap/Form'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const FormField = ({formdata, change, id, label, icon}) => {

  const showError = () => {
    let errorMessage = null

    if (formdata.validation && !formdata.valid) {
      errorMessage = (
        <div className="error_label">{formdata.validationMessage}</div>
      )
    }

    return errorMessage
  }

  const hasIcon = (icon) => {
    if (icon) {
      return (
        <FontAwesomeIcon icon={icon} className="icon" />
      )
    }
    else {
      return ''
    }
  }

  const RenderTemplate = () => {
    let formTemplate = null

    switch(formdata.element){
      case('input'):
        formTemplate = (
          <Form.Group controlId={id}>
            {hasIcon(icon)}
            <Form.Label className="text-light">{label}</Form.Label>
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
