import React from 'react'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import FormField from './formfield'
import AdFields from './adfields'

// TODO Fix spaghetti code - component should be more generic
const MyModal = ({ handleShow, handleClose, data, updateForm, type }) => {
  const showError = () => {
    let errorMessage = null

    if (data.fields.validation && !data.fields.valid) {
      errorMessage = (
        <div className="error_label">{data.fields.validationMessage}</div>
      )
    }

    return errorMessage
  }

  const renderModalFields = () => {
    let { formdata } = data.modalFields
    let fieldsArr = []
    //transform keys to array - required for map traversal
    for (let field in formdata) {
      fieldsArr.push(formdata[field])
    }

    return fieldsArr.map((field) => (
      <FormField
        key={field.config.name}
        id={field.config.name}
        icon={field.config.icon}
        label={field.config.placeholder}
        formdata={field}
        change={(element) => updateForm(element)}
      />
    ))
  }

  const RenderTemplate = () => {
    let modalTemplate =
      type === 'search' ? (
        <Modal show={data.showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Περισσότερα Φίλτρα</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(event) => this.submitForm()}>
              {renderModalFields()}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Κλείσιμο
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal show={data.adc.show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{data.adc.item.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AdFields item={data.adc.item} container="adc" />
            <hr />
            <div className="adc_description">{data.adc.item.description}</div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" href={data.adc.item.url} target="_blank">
              Μετάβαση στην σελίδα εργοδότη
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Κλείσιμο
            </Button>
          </Modal.Footer>
        </Modal>
      )
    return modalTemplate
  }

  return <div>{RenderTemplate()}</div>
}

export default MyModal
