import React from 'react'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import faCalendar from '@fortawesome/fontawesome-free-solid/faCalendar'
import faMapMarkerAlt from '@fortawesome/fontawesome-free-solid/faMapMarkerAlt'
import faBuilding from '@fortawesome/fontawesome-free-solid/faBuilding'
import faMoneyBillWave from '@fortawesome/fontawesome-free-solid/faMoneyBillWave'
import faTags from '@fortawesome/fontawesome-free-solid/faTags'
import faPhone from '@fortawesome/fontawesome-free-solid/faPhone'
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope'

const AdFields = ({ item, container }) => {
  const renderFields = () => {
    let itemsLi = []

    if (item.location) {
      itemsLi.push(
        <h6>
          <FontAwesomeIcon icon={faMapMarkerAlt} /> {item.location}
        </h6>
      )
    }

    if (item.company) {
      itemsLi.push(
        <h6>
          <FontAwesomeIcon icon={faBuilding} /> {item.company}
        </h6>
      )
    }

    if ((item.salaryMin || item.salaryMax) && container === 'adc') {
      itemsLi.push(
        <h6>
          <FontAwesomeIcon icon={faMoneyBillWave} />{' '}
          {formatSalary(item.salaryMin, item.salaryMax)}
        </h6>
      )
    }

    if (item.jobTag && container === 'adc') {
      itemsLi.push(
        <h6>
          <FontAwesomeIcon icon={faTags} /> {formatTags(item.jobTag)}
        </h6>
      )
    }

    if (item.contactEmail && container === 'adc') {
      itemsLi.push(
        <h6>
          <FontAwesomeIcon icon={faEnvelope} /> {item.contactEmail}
        </h6>
      )
    }

    if (item.contactPhone && container === 'adc') {
      itemsLi.push(
        <h6>
          <FontAwesomeIcon icon={faPhone} /> {item.contactPhone}
        </h6>
      )
    }

    itemsLi.push(
      <h6>
        <FontAwesomeIcon icon={faCalendar} /> {formatDate(item.updatedAt)}
      </h6>
    )

    return itemsLi
  }

  const formatDate = (date) => {
    return date.replace(/T.*$/, '')
  }

  const formatSalary = (min, max) => {
    let formatter = ''

    if (min && max) {
      // template strings - no pun intended :)
      formatter = `${min} - ${max}`
    } else if (min && !max) {
      formatter = min
    } else if (!min && max) {
      formatter = max
    } else {
      formatter = ''
    }

    return formatter
  }

  const formatTags = (tags) => {
    return tags.join(', ')
  }

  return <div className="adfields_container">{renderFields()}</div>
}

export default AdFields
