import React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSort from '@fortawesome/fontawesome-free-solid/faSort'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'

const SearchFilter = (props) => {
  return (
    <Accordion defaultActiveKey="0">
      <Card className="searchfilter_card">
        <Card.Header>
          <Accordion.Toggle as={Button} eventKey="1">
            <FontAwesomeIcon icon={faSort} /> Φίλτρα Αναζήτησης
          </Accordion.Toggle>
          {props.active ? (
            <Button
              className="button_submit_src"
              variant="primary"
              type="Submit"
              onClick={(event) => props.dispatchSearch(event)}
            >
              <FontAwesomeIcon icon={faSearch} /> Αναζήτηση
            </Button>
          ) : (
            <Button
              className="button_submit_src"
              variant="primary"
              type="Submit"
              onClick={(event) => props.dispatchSearch(event)}
              disabled
            >
              <FontAwesomeIcon icon={faSearch} /> Αναζήτηση
            </Button>
          )}
        </Card.Header>
        <Accordion.Collapse eventKey="1">
          <Card.Body>Hello! I'm another body</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  )
}

export default SearchFilter
