import React, { Component } from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getJobs } from '../../actions/job_actions'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import FormField from '../utils/formfield'
import MyModal from '../utils/mymodal'
import MyPager from '../utils/mypager'
import SRC from './src'
import { update, generateData, isFormValid } from '../utils/formactions'

//TODO FIX Spaghetti code - Huge state, too many renders
class Search extends Component {
  state = {
    searchResults: [],
    adc: {
      show: false,
      item: '',
    },
    pager: {
      totalPages: 0,
      currentPage: 1,
      perPage: 9,
      nextPage: 0,
      previousPage: 0,
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
    this.setState({
      showModal: false,
    })
  }

  handleAdcShow = () => {
    this.setState({ adc: { show: true } })
  }

  handleAdcClose = () => {
    this.setState({
      adc: { show: false, item: '' },
    })
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
        <Row>
          <Col>
            Ανά σελίδα:
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-variants-primary">
                {this.state.pager.perPage}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={(event) => this.dispatchSearch(event, 1, 9)}
                >
                  9
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={(event) => this.dispatchSearch(event, 1, 18)}
                >
                  18
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={(event) => this.dispatchSearch(event, 1, 36)}
                >
                  36
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <br />
      </Container>
    ) : (
      ''
    )
  }

  dispatchSearch = (event, page = 1, perPage = this.state.pager.perPage) => {
    if (event) event.preventDefault()

    //TODO add the rest of the filter params
    let keyword = this.state.formdata.jobsearch.value
    this.props
      .dispatch(getJobs({ keyword, page, perPage }))
      .then((response) => {
        if (response.payload.results) {
          this.setState({
            searchResults: response.payload.jobs,
            pager: {
              totalPages: response.payload.totalPages,
              currentPage: response.payload.currentPage,
              nextPage: response.payload.nextPage,
              previousPage: response.payload.previousPage,
              results: response.payload.results,
              perPage: response.payload.perPage,
            },
            errorMsg: response.payload.error,
          })
        } else {
          this.setState({
            errorMsg: 'Δεν βρέθηκαν αποτελέσματα!',
            pager: {
              totalPages: 0,
              currentPage: 1,
              nextPage: 0,
              previousPage: 0,
              results: 0,
              perPage: 9,
            },
          })
        }
      })
      .catch((err) => {
        this.setState({
          errorMsg: `Σφάλμα σύνδεσης με τον Διακομιστή: ${err}`,
          pager: {
            ...this.state.pager,
            totalPages: 0,
            currentPage: 1,
            nextPage: 0,
            previousPage: 0,
            results: 0,
            perPage: 9,
          },
        })
      })
    //after getting the results - smooth scroll into view
    this.myRef.scrollIntoView()
  }

  renderAdc = () => (
    <MyModal
      handleShow={this.handleAdcShow}
      handleClose={this.handleAdcClose}
      data={this.state}
      type={'adc'}
    />
  )

  showAdc = (event, item) => {
    event.preventDefault()
    this.setState({
      adc: {
        show: true,
        item,
      },
    })
  }

  render() {
    return (
      <div className="general_wrapper">
        <Container ref={(ref) => (this.myRef = ref)}>
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
                  className="bg-dark button_submit_src"
                  variant="primary"
                  type="Submit"
                  onClick={(event) => this.dispatchSearch(event)}
                >
                  Αναζήτηση
                </Button>
              </Form>
            </Col>
          </Row>
          {this.state.adc.show ? this.renderAdc() : ''}
        </Container>
        <br />
        {this.showTotal()}
        <MyPager pager={this.state.pager} action={this.dispatchSearch} />
        <SRC
          data={this.state.searchResults}
          error={this.state.errorMsg}
          handleShow={this.showAdc}
        />
        <MyPager pager={this.state.pager} action={this.dispatchSearch} />
        <MyModal
          handleShow={this.handleShow}
          handleClose={this.handleClose}
          data={this.state}
          updateForm={this.updateFormModal}
          type={'search'}
        />
      </div>
    )
  }
}

export default connect()(withRouter(Search))
