import React, { Component } from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getAnnouncements } from '../../actions/announcement_actions'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class Announcements extends Component {

  state = {
    announcements: [],
    errorMsg: ''
  }

  componentDidMount() {
    this.props.dispatch(getAnnouncements()).then(response => {
      if (response.payload.results) {
        this.setState({
          announcements: response.payload.announcements
        })
      }
      else {
        this.setState({
          errorMsg: 'Δεν υπάρχουν ανακοινώσεις'
        })
      }
    })
    .catch(err => {
      this.setState({
        errorMsg: 'Σφάλμα σύνδεσης με τον Διακομιστή ανακοινώσεων'
      })
    })
  }

  mapAnnouncements(){
    //If there are any error msgs(no announcements/server error), render messages
    return !this.state.errorMsg ? this.state.announcements.map(announcement => (
                                        <div key={announcement._id}>
                                          <div className="left">
                                            <h5>{announcement.title}</h5>
                                          </div>
                                          <div className="right">
                                            <h6 className="announcement_date">{this.processDate(announcement.updatedAt)}</h6>
                                          </div>
                                          <br/><br/>
                                          <p style={{'textAlign':'left'}}>{announcement.content}</p>
                                          <hr/>
                                        </div>
                                  ))
                                : <p>{this.state.errorMsg}</p>
  }

  processDate(date){
    //date formats are YY-MM-DD(T)HR:MIN:SEC.MS(Z) E.g 2020-11-29T18:37:50.686Z
    return date.replace(/T|Z|\.\d+/g,' ')
  }

  render() {
    //TODO ADD pager
    return (
      <div className="announcement_wrapper">
        <Container>
          <Row className="login_announcements_container">
            <Col>
              <h3>Ανακοινώσεις</h3>
              <hr/>
              {this.mapAnnouncements()}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

}

export default connect()(withRouter(Announcements))
