import React from 'react'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

// 7 rows Title/Location/Company/Salary/Url/View/Remove from favourites
const UserFavourites = ({ user }) => {
  const mapFavourites = () => {
    let { favourites } = user.userData

    return favourites.map((favourite) => (
      <tr>
        <th>{favourite.title}</th>
        <th>{favourite.location}</th>
        <th>{favourite.company}</th>
        <th>{favourite.salary}</th>
        <th>{favourite.url}</th>
        <th>
          <Button>More</Button>
        </th>
        <th>remove from favourites</th>
      </tr>
    ))
  }

  return (
    <div className="general_wrapper">
      <Container>
        <Row>
          <Table responsive>
            <thead>
              <tr>
                <th>Τίτλος</th>
                <th>Τοποθεσία</th>
                <th>Εταιρεία</th>
                <th>Μισθός</th>
                <th>Σύνδεσμος</th>
                <th>Λεπτομέρειες</th>
                <th>Αφαίρεση</th>
              </tr>
            </thead>
            <tbody>{mapFavourites()}</tbody>
          </Table>
        </Row>
      </Container>
    </div>
  )
}

export default UserFavourites
