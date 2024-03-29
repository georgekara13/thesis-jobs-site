import React from 'react'
import Form from 'react-bootstrap/Form'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const FormField = ({
  formdata,
  change,
  id,
  label,
  icon,
  textColor = 'text-light',
}) => {
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
      return <FontAwesomeIcon icon={icon} />
    } else {
      return ''
    }
  }

  const RenderTemplate = () => {
    let formTemplate = null

    switch (formdata.element) {
      case 'input':
        formTemplate = (
          <Form.Group
            controlId={id}
            className={formdata.className ? formdata.className : textColor}
          >
            {hasIcon(icon)} <Form.Label>{label}</Form.Label>
            <Form.Control
              type={id}
              {...formdata.config}
              value={formdata.value}
              onBlur={(event) => change({ event, id, blur: true })}
              onChange={(event) => change({ event, id })}
            />
            {showError()}
          </Form.Group>
        )
        break
      case 'range':
        formTemplate = (
          <Form.Group controlId={id}>
            {hasIcon(icon)}
            <Form.Label className={textColor}>
              {label}{' '}
              {formdata.value && formdata.value > 0
                ? `: €${formdata.value}00+`
                : ''}
            </Form.Label>
            <Form.Control
              {...formdata.config}
              value={formdata.value}
              onBlur={(event) => change({ event, id, blur: true })}
              onChange={(event) => change({ event, id })}
            />
            {showError()}
          </Form.Group>
        )
        break
      case 'checkbox':
        formTemplate = (
          <Form.Group controlId={id}>
            {hasIcon(icon)}
            <Form.Label className={textColor}>{label}</Form.Label>
            {formdata.items.map((item) => (
              <Form.Check
                {...formdata.config}
                value={item.value}
                onChange={(event) => change({ event, id })}
                label={item.label}
                key={item.value}
              />
            ))}
            {showError()}
          </Form.Group>
        )
        break
      default:
        formTemplate = null
    }

    return formTemplate
  }

  return <div>{RenderTemplate()}</div>
}

export default FormField
