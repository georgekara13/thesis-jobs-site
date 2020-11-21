import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faCompass from '@fortawesome/fontawesome-free-solid/faCompass'
import faPhone from '@fortawesome/fontawesome-free-solid/faPhone'
import faClock from '@fortawesome/fontawesome-free-solid/faClock'
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope'

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'

//TODO instead of using bootstrap css classes, use bootstrap  component  props and pass args
const Footer = ({}) => (
  <Container fluid className="pb-0 mb-0 justify-content-center text-dark bck-blue">
      <footer>
          <Row className="my-5 justify-content-center py-5">
              <Col className="col-11">
                  <Row>
                      <Col className="col-xl-8 col-md-4 col-sm-4 col-12 my-auto mx-auto a">
                          <h3 className="text-muted mb-md-0 mb-5 bold-text">Uop Job site.</h3>
                      </Col>
                      <Col className="col-xl-2 col-md-4 col-sm-4 col-12">
                          <h6 className="mb-3 mb-lg-4 bold-text "><b>MENU</b></h6>
                          <ul className="list-unstyled">
                              <li>Home</li>
                              <li>About</li>
                              <li>Blog</li>
                              <li>Portfolio</li>
                          </ul>
                      </Col>
                      <Col className="col-xl-2 col-md-4 col-sm-4 col-12">
                          <h6 className="mb-3 mb-lg-4 text-muted bold-text mt-sm-0 mt-5"><b>ADDRESS</b></h6>
                          <p className="mb-1">605, RATAN ICON BUILDING</p>
                          <p>SEAWOODS SECTOR</p>
                      </Col>
                  </Row>
                  <Row>
                      <Col className="col-xl-2 col-md-4 col-sm-4 col-auto order-1 align-self-end ">
                          <h6 className="mt-55 mt-2 text-muted bold-text"><b>ANIRUDH SINGLA</b></h6><small> <span><i className="fa fa-envelope" aria-hidden="true"></i></span> anirudh@gmail.com</small>
                      </Col>
                      <Col className="col-xl-2 col-md-4 col-sm-4 col-auto order-2 align-self-end mt-3 ">
                          <h6 className="text-muted bold-text"><b>RISHABH SHEKHAR</b></h6><small><span><i className="fa fa-envelope" aria-hidden="true"></i></span> rishab@gmail.com</small>
                      </Col>
                  </Row>
              </Col>
          </Row>
      </footer>
  </Container>
)

export default Footer
