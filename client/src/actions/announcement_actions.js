import axios from 'axios'

import { GET_ANNOUNCEMENTS } from './types'

export function getAnnouncements() {
  const request = axios.get(`/api/getannouncements`)
                       .then(response => response.data)
  return  {
    type: GET_ANNOUNCEMENTS,
    payload: request
  }
}
