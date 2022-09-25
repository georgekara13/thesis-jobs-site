import React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import FormField from '../utils/formfield'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faSort from '@fortawesome/fontawesome-free-solid/faSort'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'

const SearchFilter = (props) => {
  const mapFormFields = () =>
    Object.keys(props.searchFields).map((field) => (
      <FormField
        key={props.searchFields[field].config.name}
        id={props.searchFields[field].config.name}
        icon={props.searchFields[field].config.icon}
        label={props.searchFields[field].config.placeholder}
        formdata={props.searchFields[field]}
        change={(element) => props.updateFields(element)}
        textColor="text-dark"
      />
    ))

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
          <Card.Body>{mapFormFields()}</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  )
}

export default SearchFilter
