import React, { Component } from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getJobs } from '../../actions/job_actions'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormField from '../utils/formfield'
import MyModal from '../utils/mymodal'
import MyPager from '../utils/mypager'
import SRC from './src'
import { update, generateData, isFormValid } from '../utils/formactions'

class Search extends Component {
  state = {
    searchResults: [],
    pager: {
      totalPages: 0,
      currentPage: 1,
      results: 0,
    },
    showModal: false,
    formError: false,
    errorMsg: '',
    formSuccess: '',
    formdata: {
      jobsearch: {
        element: 'input',
        value: '',
        config: {
          name: 'search_keyword',
          type: 'search',
          placeholder: 'Εισάγετε λέξεις κλειδιά για αναζήτηση',
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationMessage: '',
      },
    },
    modalFields: {
      errorMsg: '',
      formSuccess: '',
      formdata: {
        location_keyword: {
          element: 'input',
          value: '',
          config: {
            name: 'location_keyword',
            type: 'search',
            placeholder: 'Περιοχή',
          },
          validation: {
            required: false,
          },
        },
        salarymin_keyword: {
          element: 'input',
          value: '',
          config: {
            name: 'salarymin_keyword',
            type: 'search',
            placeholder: 'Ελάχιστος μισθός',
          },
          validation: {
            required: false,
          },
          valid: false,
          touched: false,
          validationMessage: '',
        },
        salarymax_keyword: {
          element: 'input',
          value: '',
          config: {
            name: 'salarymax_keyword',
            type: 'search',
            placeholder: 'Μέγιστος μισθός',
          },
          validation: {
            required: false,
          },
          valid: false,
          touched: false,
          validationMessage: '',
        },
        jobtag_checkbox: {
          element: 'checkbox',
          value: '',
          config: {
            name: 'jobtag_checkbox',
            type: 'search',
            placeholder: 'Κατηγορίες',
          },
          validation: {
            required: false,
          },
        },
        company_keyword: {
          element: 'input',
          value: '',
          config: {
            name: 'company_keyword',
            type: 'search',
            placeholder: 'Εταιρεία',
          },
          validation: {
            required: false,
          },
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

  updateFormModal = (element) => {
    const newFormData = update(
      element,
      this.state.modalFields.formdata,
      'search'
    )

    this.setState({
      formError: false,
      modalFields: {
        formdata: newFormData,
      },
    })
  }

  updateFormSearch = (element) => {
    const newFormData = update(element, this.state.formdata, 'search')

    this.setState({
      formError: false,
      formdata: newFormData,
    })
  }

  showTotal = () => {
    return this.state.pager.results && !this.state.errorMsg ? (
      <Container>
        <Row>
          <Col>Σύνολο αποτελεσμάτων: {this.state.pager.results}</Col>
        </Row>
        <br />
      </Container>
    ) : (
      ''
    )
  }

  dispatchSearch = (event) => {
    if (event) event.preventDefault()

    //TODO add the rest of the filter params
    //TODO add page & limit options
    let keyword = this.state.formdata.jobsearch.value

    this.props
      .dispatch(getJobs({ keyword }))
      .then((response) => {
        if (response.payload.results) {
          this.setState({
            searchResults: response.payload.jobs,
            pager: {
              totalPages: response.payload.totalPages,
              currentPage: response.payload.currentPage,
              results: response.payload.results,
            },
            errorMsg: response.payload.error,
          })
        } else {
          this.setState({
            errorMsg: 'Δεν βρέθηκαν αποτελέσματα!',
            pager: {
              totalPages: 0,
              currentPage: 1,
              results: 0,
            },
          })
        }
      })
      .catch((err) => {
        this.setState({
          errorMsg: `Σφάλμα σύνδεσης με τον Διακομιστή: ${err}`,
          pager: {
            totalPages: 0,
            currentPage: 1,
            results: 0,
          },
        })
      })
  }

  render() {
    return (
      <div className="general_wrapper">
        <Container>
          <Row>
            <Col>
              <Form onSubmit={(event) => this.dispatchSearch()}>
                <FormField
                  id={'jobsearch'}
                  label={'Search'}
                  formdata={this.state.formdata.jobsearch}
                  change={(element) => this.updateFormSearch(element)}
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
                  onClick={(event) => this.dispatchSearch(event)}
                >
                  Αναζήτηση
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
        <br />
        {this.showTotal()}
        <SRC data={this.state.searchResults} error={this.state.errorMsg} />
        <MyPager pager={this.state.pager} action={this.dispatchSearch} />
        <MyModal
          handleShow={this.handleShow}
          handleClose={this.handleClose}
          data={this.state}
          updateForm={this.updateFormModal}
        />
      </div>
    )
  }
}

export default connect()(withRouter(Search))
