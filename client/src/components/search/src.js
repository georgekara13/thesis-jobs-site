import React from 'react'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import faCalendar from '@fortawesome/fontawesome-free-solid/faCalendar'
import faMapMarkerAlt from '@fortawesome/fontawesome-free-solid/faMapMarkerAlt'
import faBuilding from '@fortawesome/fontawesome-free-solid/faBuilding'

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
              <h6>
                <FontAwesomeIcon icon={faCalendar} />{' '}
                {result.updatedAt.replace(/T.*/, '')}
              </h6>
              <h6>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {result.location}
              </h6>
              <h6>
                <FontAwesomeIcon icon={faBuilding} /> {result.company}
              </h6>
              <hr />
              <Card.Text>{truncateDescription(result.description)}</Card.Text>
              <Button variant="secondary" href={result.url} target="_blank">
                Περισσότερα
              </Button>
            </Card.Body>
          </Card>
          <br />
        </Col>
      ))
    ) : (
      <div>{props.error}</div>
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
