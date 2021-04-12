import React from 'react'
import Pagination from 'react-bootstrap/Pagination'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const MyPager = (props) => {
  const { pager } = props
  let items = []

  const renderPager = (pager) => {
    //TODO always show active pager item
    if (pager.totalPages > 10) {
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
    <React.Fragment>
      <Pagination.First onClick={(event) => props.action(event, 1)} />
      <Pagination.Prev onClick={(event) => props.action(event, previous)} />
    </React.Fragment>
  )

  const renderNext = (next) => (
    <React.Fragment>
      <Pagination.Next onClick={(event) => props.action(event, next)} />
      <Pagination.Last
        onClick={(event) => props.action(event, pager.totalPages)}
      />
    </React.Fragment>
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
