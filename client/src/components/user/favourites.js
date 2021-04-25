import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getJobs } from '../../actions/job_actions'

import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import MyPager from '../utils/mypager'
import MyModal from '../utils/mymodal'

// TODO Improve styling
/* Used by the favourites route. Atm, we are stringifying the 'favourites' list
found in the user.userData props, and dispatch a getjobs action. It's not optimal,
as in theory we could get the result objects beforehand
during auth, and avoid sending an extra request to the server.
But in order to do so, we would need to update
various routes/components of the codebase. So it's fine for now.
*/
class UserFavourites extends Component {
  state = {
    items: [],
    pager: {
      totalPages: 0,
      currentPage: 1,
      perPage: 9,
      nextPage: 0,
      previousPage: 0,
      results: 0,
    },
    adc: {
      show: false,
      item: '',
    },
  }

  componentDidMount = () => {
    this.dispatchSearch()
  }

  dispatchSearch = (event, page = 1) => {
    if (event) event.preventDefault()

    let _id = this.props.user.userData.favourites.join(',')

    this.props.dispatch(getJobs({ _id, page })).then((response) => {
      if (response.payload.results) {
        this.setState({
          ...this.state,
          items: response.payload.jobs,
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
      }
    })
  }

  handleAdcShow = () => {
    this.setState({
      ...this.state,
      adc: { show: true },
    })
  }

  handleAdcClose = () => {
    this.setState({
      ...this.state,
      adc: { show: false, item: '' },
    })
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
      ...this.state,
      adc: {
        show: true,
        item,
      },
    })
  }

  mapFavourites = () => {
    let { items } = this.state

    return items.map((item) => (
      <tr key={item._id}>
        <th>
          <a href={item.url} target="_blank">
            {item.title}
          </a>
        </th>
        <th>{item.location ? item.location : '-'}</th>
        <th>{item.company ? item.company : '-'}</th>
        <th>{item.salary ? item.salary : '-'}</th>
        <th>
          <Button onClick={(event) => this.showAdc(event, item)}>
            Εμφάνιση
          </Button>
        </th>
      </tr>
    ))
  }

  render() {
    return (
      <div className="general_wrapper">
        <Container>
          <Row>
            <Table responsive>
              <thead>
                <tr>
                  <th>Τίτλος</th>
                  <th>Τοποθεσία</th>
                  <th>Εταιρεία</th>
                  <th>Μισθός</th>
                  <th>Λεπτομέρειες</th>
                </tr>
              </thead>
              <tbody>{this.mapFavourites()}</tbody>
            </Table>
          </Row>
          {this.state.adc.show ? this.renderAdc() : ''}
          <MyPager pager={this.state.pager} action={this.dispatchSearch} />
        </Container>
      </div>
    )
  }
}

export default connect()(withRouter(UserFavourites))
