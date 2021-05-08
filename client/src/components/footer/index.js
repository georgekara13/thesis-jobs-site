import React from 'react'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope'

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'

//TODO instead of using bootstrap css classes, use bootstrap  component  props and pass args
const Footer = () => (
  <Container
    fluid
    className="pb-0 mb-0 justify-content-center text-light bg-dark"
  >
    <footer>
      <Row className="justify-content-center py-5">
        <Col className="col-11">
          <Row>
            <Col className="col-xl-8 col-md-4 col-sm-4 col-12 my-auto mx-auto a">
              <h3 className="text-muted mb-md-0 mb-5 bold-text">
                Ιστότοπος εύρεσης εργασίας
                <br />
                Πανεπιστημίου Πελοποννήσου
              </h3>
            </Col>
            <Col className="col-xl-2 col-md-4 col-sm-4 col-auto order-1 align-self-end ">
              <h6 className="mt-55 mt-2 text-muted bold-text">
                <b>
                  Φοιτητής:
                  <br /> Γιώργος Καραγιάννης
                </b>
              </h6>
              <small>
                {' '}
                <span>
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>{' '}
                cst12041@uop.gr
              </small>
            </Col>
            <Col className="col-xl-2 col-md-4 col-sm-4 col-auto order-2 align-self-end mt-3 ">
              <h6 className="text-muted bold-text">
                <b>
                  Επιβλέπων Καθηγητής:
                  <br /> Νικόλαος Πλατής
                </b>
              </h6>
              <small>
                <span>
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>{' '}
                nplatis@uop.gr
              </small>
            </Col>
          </Row>
        </Col>
      </Row>
    </footer>
  </Container>
)

export default Footer
