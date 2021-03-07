import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'

const MyDropDown = (props) => {
  let { label, items, action } = props

  const renderItems = () => {
    let renderedItems = []
    renderedItems = items.map((item) => (
      <Dropdown.Item key={item} onClick={(event) => action(event, 1, item)}>
        {item}
      </Dropdown.Item>
    ))

    return renderedItems
  }

  return (
    <Row>
      <Col>
        <Dropdown>
          Ανά σελίδα:{' '}
          <Dropdown.Toggle variant="primary" id="dropdown-variants-primary">
            {label}
          </Dropdown.Toggle>
          <Dropdown.Menu>{renderItems()}</Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  )
}

export default MyDropDown
