import React, { Component } from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getJobs } from '../../actions/job_actions'
import { addUserFav, rmUserFav } from '../../actions/user_actions'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FormField from '../utils/formfield'
import MyModal from '../utils/mymodal'
import MyPager from '../utils/mypager'
import MyDropdown from '../utils/mydropdown'
import SearchFilter from './searchfilter'
import SRC from './src'
import { update, generateData, isFormValid } from '../utils/formactions'

//TODO FIX Spaghetti code - Huge state, too many renders
class Search extends Component {
  state = {
    user: {
      favourites: this.props.user.userData.favourites,
    },
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
          element: 'range',
          value: 0,
          config: {
            name: 'salarymin_keyword',
            type: 'range',
            placeholder: 'Ελάχιστος μισθός',
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
          value: [],
          items: [
            { label: 'Αθλητισμός', value: 'sports' },
            { label: 'Αποθήκες', value: 'logistics' },
            { label: 'Απροσδιόριστο', value: 'unknown' },
            { label: 'Εξυπηρέτηση Πελατών', value: 'customer-service' },
            { label: 'Marketing', value: 'marketing' },
            { label: 'Οικονομικά', value: 'economics' },
            { label: 'Πληροφορική', value: 'it' },
            { label: 'Πωλήσεις', value: 'sales' },
            { label: 'Σερβιτόροι', value: 'catering' },
            { label: 'Τέχνες', value: 'arts' },
            { label: 'Υγεία', value: 'healthcare' },
          ],
          config: {
            name: 'jobtag_checkbox',
            type: 'checkbox',
            placeholder: 'Κατηγορίες',
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
    let newFormData = update(element, this.state.modalFields.formdata, 'search')

    if (element.id === 'jobtag_checkbox') {
      let currentJobTags = this.state.modalFields.formdata.jobtag_checkbox.value
      if (currentJobTags.includes(element.event.target.value)) {
        currentJobTags = currentJobTags.filter(
          (item) => item !== element.event.target.value
        )
      } else {
        currentJobTags.push(element.event.target.value)
      }
      newFormData.jobtag_checkbox.value = currentJobTags
    }

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
        <MyDropdown
          label={this.state.pager.perPage}
          items={[9, 18, 36]}
          action={this.dispatchSearch}
        />
        <br />
      </Container>
    ) : (
      ''
    )
  }

  //used by the favourites component to set/remove favourite jobs
  dispatchRemoveFavourites = (event, jobId, uid) => {
    event.preventDefault()

    this.props.dispatch(rmUserFav(jobId, uid)).then((response) => {
      this.setState({
        user: {
          favourites: response.payload,
        },
      })
    })
  }

  dispatchAddFavourites = (event, jobId, uid) => {
    event.preventDefault()

    this.props.dispatch(addUserFav(jobId, uid)).then((response) => {
      this.setState({
        user: {
          favourites: response.payload,
        },
      })
    })
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
    //DEBUG
    //console.log(this.props.user)
    return (
      <div className="general_wrapper">
        <Container ref={(ref) => (this.myRef = ref)}>
          <Row>
            <Col>
              <Form onSubmit={(event) => this.dispatchSearch()}>
                <FormField
                  id={'jobsearch'}
                  formdata={this.state.formdata.jobsearch}
                  change={(element) => this.updateFormSearch(element)}
                />

                <SearchFilter
                  dispatchSearch={this.dispatchSearch}
                  active={this.state.formdata.jobsearch.value}
                  searchFields={this.state.modalFields.formdata}
                  updateFields={this.updateFormModal}
                />
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
          uid={this.props.user.userData.id}
          userFavourites={this.state.user.favourites}
          addFav={this.dispatchAddFavourites}
          rmFav={this.dispatchRemoveFavourites}
        />
        <MyPager pager={this.state.pager} action={this.dispatchSearch} />
      </div>
    )
  }
}

export default connect()(withRouter(Search))
