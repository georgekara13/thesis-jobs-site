import React from 'react'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import AdFields from '../utils/adfields'

// Search results container
const SRC = (props) => {
  const mapSearchResults = () => {
    return !props.error ? (
      props.data.map((result) => (
        <Col key={result._id} xs>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>
                <a href={result.url} target="_blank">
                  {result.title}
                </a>
              </Card.Title>
              <AdFields item={result} container="src" />
              <hr />
              <Card.Text>{truncateDescription(result.description)}</Card.Text>
              <Button
                variant="secondary"
                onClick={(event) => props.handleShow(event, result)}
              >
                Περισσότερα
              </Button>
            </Card.Body>
          </Card>
          <br />
        </Col>
      ))
    ) : (
      <Col className="error_label">{props.error}</Col>
    )
  }

  const truncateDescription = (description) => {
    return description.substring(0, 300).concat('...')
  }

  return (
    <div className="src_wrapper">
      <Container>
        <Row className="src_container">{mapSearchResults()}</Row>
      </Container>
    </div>
  )
}

export default SRC
