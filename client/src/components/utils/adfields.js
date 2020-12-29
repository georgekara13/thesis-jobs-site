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
        <div key="ad_location">
          <FontAwesomeIcon icon={faMapMarkerAlt} /> {item.location}
        </div>
      )
    }

    if (item.company) {
      itemsLi.push(
        <div key="ad_company">
          <FontAwesomeIcon icon={faBuilding} /> {item.company}
        </div>
      )
    }

    if ((item.salaryMin || item.salaryMax) && container === 'adc') {
      itemsLi.push(
        <div key="ad_salary">
          <FontAwesomeIcon icon={faMoneyBillWave} />{' '}
          {formatSalary(item.salaryMin, item.salaryMax)}
        </div>
      )
    }

    if (item.jobTag && container === 'adc') {
      itemsLi.push(
        <div key="ad_jobTag">
          <FontAwesomeIcon icon={faTags} /> {formatTags(item.jobTag)}
        </div>
      )
    }

    if (item.contactEmail && container === 'adc') {
      itemsLi.push(
        <div key="ad_email">
          <FontAwesomeIcon icon={faEnvelope} /> {item.contactEmail}
        </div>
      )
    }

    if (item.contactPhone && container === 'adc') {
      itemsLi.push(
        <div key="ad_phone">
          <FontAwesomeIcon icon={faPhone} /> {item.contactPhone}
        </div>
      )
    }

    itemsLi.push(
      <div key="ad_date">
        <FontAwesomeIcon icon={faCalendar} /> {formatDate(item.updatedAt)}
      </div>
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
