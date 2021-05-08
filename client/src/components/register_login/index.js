import React from 'react'
import Login from './login'
import Announcements from '../announcements'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const RegisterLogin = () => (
  <div className="general_wrapper">
    <Container>
      <Row className="login_welcome_container">
        <Col>
          <h2>Καλωσήρθατε!</h2>
          <hr />
          <p>Ιστότοπος εύρεσης εργασίας πανεπιστημίου Πελοποννήσου</p>
        </Col>
      </Row>
    </Container>
    <Container className="login_page_wrapper">
      <Row className="register_login_container">
        <Col className="login_info_wrapper">
          <p>
            Η πλατφόρμα εύρεσης εργασίας αποτελεί ένα ολοκληρωμένο Σύστημα
            Διαχείρισης αγγελιών απ'τον ιστό. Ακολουθεί τη φιλοσοφία του
            λογισμικού ανοικτού κώδικα. Η πρόσβαση στην υπηρεσία γίνεται με τη
            χρήση ενός απλού φυλλομετρητή (web browser) χωρίς την απαίτηση
            εξειδικευμένων τεχνικών γνώσεων. Απαραίτητη προϋπόθεση για την
            πρόσβαση, είναι η χρήση λογαριασμού του Πανεπιστημίου.
          </p>
        </Col>
        <Col>
          <Login />
        </Col>
      </Row>
    </Container>
    <Announcements />
  </div>
)

export default RegisterLogin
