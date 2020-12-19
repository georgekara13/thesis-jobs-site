import React from 'react'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

// Search results container
const SRC = (props) => {
  //TODO map all data
  const mapSearchResults = () => {
    return props.data ? (
      props.data.map((result) => (
        <Col xs>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>
                <a href={result.url} target="_blank">
                  {result.title}
                </a>
              </Card.Title>
              <Card.Text>{result.location}</Card.Text>
              <Button variant="secondary" href={result.url} target="_blank">
                Περισσότερα
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))
    ) : (
      <div>{props.error}</div>
    )
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
