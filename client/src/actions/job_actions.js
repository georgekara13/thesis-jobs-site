import axios from 'axios'

import { GET_JOBS } from './types'

export function getJobs(params) {
  let { keyword, location, jobTag, page = 1, perPage = 9 } = params
  let reqUrl = `/api/getjobs`
  let queryParams = []

  if (keyword) queryParams.push(`keyword=${keyword}`)
  if (location) queryParams.push(`location=${location}`)
  if (jobTag) queryParams.push(`jobTag=${jobTag}`)
  //todo salarymin
  queryParams.push(`page=${page}`)
  queryParams.push(`limit=${perPage}`)

  for (let param of queryParams) {
    reqUrl += reqUrl.match(/\?/) ? `&${param}` : `?${param}`
  }

  console.log(reqUrl)
  const request = axios.get(reqUrl).then((response) => response.data)
  return {
    type: GET_JOBS,
    payload: request,
  }
}
