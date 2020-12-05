import React from "react"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

import FormField from "./formfield"
import FontAwesomeIcon from "@fortawesome/react-fontawesome"

const MyModal = ({ handleShow, handleClose, data, updateForm }) => {
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
    let { modalFields } = data
    let fieldsArr = []
    //transform keys to array - required for map traversal
    for (let field in modalFields) {
      fieldsArr.push(modalFields[field])
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
    let modalTemplate = (
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
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    )
    return modalTemplate
  }

  return <div>{RenderTemplate()}</div>
}

export default MyModal