import React, { Component } from "react"

import Form from "react-bootstrap/Form"

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import FormField from "../utils/formfield"
import MyModal from "../utils/mymodal"
import { update, generateData, isFormValid } from "../utils/formactions"

class Search extends Component {
  state = {
    showModal: false,
    formError: false,
    errorMsg: "",
    formSuccess: "",
    formdata: {
      search: {
        element: "input",
        value: "",
        config: {
          name: "search_keyword",
          type: "search",
          placeholder: "Εισάγετε λέξεις κλειδιά για αναζήτηση",
        },
        validation: {
          required: false,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
    },
    modalFields: {
      location: {
        element: "input",
        value: "",
        config: {
          name: "location_keyword",
          type: "search",
          placeholder: "Περιοχή",
        },
        validation: {
          required: false,
        },
      },
      salaryMin: {
        element: "input",
        value: "",
        config: {
          name: "salarymin_keyword",
          type: "search",
          placeholder: "Ελάχιστος μισθός",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      salaryMax: {
        element: "input",
        value: "",
        config: {
          name: "salarymax_keyword",
          type: "search",
          placeholder: "Μέγιστος μισθός",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      jobTag: {
        element: "checkbox",
        value: "",
        config: {
          name: "jobtag_checkbox",
          type: "search",
          placeholder: "Κατηγορίες",
        },
        validation: {
          required: false,
        },
      },
      company: {
        element: "input",
        value: "",
        config: {
          name: "company_keyword",
          type: "search",
          placeholder: "Εταιρεία",
        },
        validation: {
          required: false,
        },
      },
    },
  }

  handleClose = () => {
    this.setState({ showModal: false })
  }

  handleShow = () => {
    this.setState({ showModal: true })
  }

  updateForm = (element) => {
    const newFormData = update(element, this.state.modalFields, "search")

    this.setState({
      formError: false,
      formdata: newFormData,
    })
  }

  render() {
    return (
      <div className="general_wrapper">
        <Container>
          <Row>
            <Col>
              <Form onSubmit={(event) => this.submitForm()}>
                <FormField
                  id={"jobsearch"}
                  label={"Search"}
                  formdata={this.state.formdata.search}
                  change={(element) => this.updateForm(element)}
                />

                <Button
                  className="bg-dark"
                  variant="primary"
                  onClick={this.handleShow}
                >
                  Περισσότερα φίλτρα
                </Button>
                <Button
                  className="bg-dark"
                  variant="primary"
                  type="Submit"
                  onClick={(event) => this.submitForm(event)}
                >
                  Αναζήτηση
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
        <MyModal
          handleShow={this.handleShow}
          handleClose={this.handleClose}
          data={this.state}
          updateForm={this.updateForm}
        />
      </div>
    )
  }
}

export default Search
