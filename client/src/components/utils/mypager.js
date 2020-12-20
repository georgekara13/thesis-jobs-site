import React from 'react'
import Pagination from 'react-bootstrap/Pagination'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const MyPager = (props) => {
  const { pager } = props
  let items = []
  const renderPager = (pager) => {
    for (let num = 1; num <= pager.totalPages; num++) {
      items.push(
        <Pagination.Item key={num} active={num === pager.currentPage}>
          {num}
        </Pagination.Item>
      )
    }
  }

  if (pager.results) {
    renderPager(pager)
  }

  return pager.results ? (
    <Container>
      <Row>
        <Col>
          <Pagination size="sm">
            <Pagination.First />
            <Pagination.Prev />
            {items}
            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
        </Col>
      </Row>
    </Container>
  ) : (
    ''
  )
}

export default MyPager
