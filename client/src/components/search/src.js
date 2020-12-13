import React from "react"

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

// Search results container
const SRC = (props) => {
  //TODO map all data
  const mapSearchResults = () => {
    return props.data.map((result) => <h3>{result.description}</h3>)
  }

  return (
    <div className="src_wrapper">
      <Container>
        <Row className="src_container">
          <Col>
            <div>{mapSearchResults()}</div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default SRC
