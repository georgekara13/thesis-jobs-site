import React from 'react'
import Pagination from 'react-bootstrap/Pagination'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const MyPager = (props) => {
  const { pager } = props
  let items = []

  const renderPager = (pager) => {
    //TODO Ellipsis pager - remove pager.EllipsisInProgress condition when done!
    if (pager.totalPages > 10 && pager.EllipsisInProgress) {
      if (pager.currentPage < pager.totalPages - 4) {
        for (let num = pager.currentPage; num <= pager.currentPage + 2; num++) {
          items.push(
            <Pagination.Item
              key={num}
              active={num === pager.currentPage}
              onClick={(event) => props.action(event, num)}
            >
              {num}
            </Pagination.Item>
          )
        }
      } else {
        for (let num = 1; num <= 3; num++) {
          items.push(
            <Pagination.Item
              key={num}
              active={num === pager.currentPage}
              onClick={(event) => props.action(event, num)}
            >
              {num}
            </Pagination.Item>
          )
        }
      }

      items.push(<Pagination.Ellipsis />)

      for (let num = pager.totalPages - 2; num <= pager.totalPages; num++) {
        items.push(
          <Pagination.Item
            key={num}
            active={num === pager.currentPage}
            onClick={(event) => props.action(event, num)}
          >
            {num}
          </Pagination.Item>
        )
      }
    } else {
      for (let num = 1; num <= pager.totalPages; num++) {
        items.push(
          <Pagination.Item
            key={num}
            active={num === pager.currentPage}
            onClick={(event) => props.action(event, num)}
          >
            {num}
          </Pagination.Item>
        )
      }
    }
  }

  const renderPrevious = (previous) => (
    <Pagination.Prev onClick={(event) => props.action(event, previous)} />
  )

  const renderNext = (next) => (
    <Pagination.Next onClick={(event) => props.action(event, next)} />
  )

  if (pager.totalPages > 1) {
    renderPager(pager)
  }

  return pager.results ? (
    <Container>
      <Row>
        <Col>
          <Pagination size="sm">
            {pager.previousPage ? renderPrevious(pager.previousPage) : ''}
            {items}
            {pager.nextPage ? renderNext(pager.nextPage) : ''}
          </Pagination>
        </Col>
      </Row>
    </Container>
  ) : (
    ''
  )
}

export default MyPager
