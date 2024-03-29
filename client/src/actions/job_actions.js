import axios from 'axios'

import { GET_JOBS } from './types'

export function getJobs(params) {
  let {
    keyword,
    location,
    jobTag,
    salaryMin,
    page = 1,
    perPage = 9,
    _id,
  } = params
  let reqUrl = `${process.env.REACT_APP_API}/api/getjobs`
  let queryParams = []

  if (keyword) queryParams.push(`keyword=${keyword}`)
  if (location) queryParams.push(`location=${location}`)
  if (jobTag) queryParams.push(`jobTag=${jobTag}`)
  if (salaryMin) queryParams.push(`salaryMin=${salaryMin}`)
  if (_id) queryParams.push(`_id=${_id}`)

  queryParams.push(`page=${page}`)
  queryParams.push(`limit=${perPage}`)

  for (let param of queryParams) {
    reqUrl += reqUrl.match(/\?/) ? `&${param}` : `?${param}`
  }

  const request = axios.get(reqUrl).then((response) => response.data)
  return {
    type: GET_JOBS,
    payload: request,
  }
}
