import axios from 'axios'

import { GET_JOBS } from './types'

//TODO add company/location/jobtag extra filters & salary rheostat https://www.npmjs.com/package/rheostat
export function getJobs(params) {
  let { keyword, loc_keyword, company_keyword, page = 1, perPage = 9 } = params
  let reqUrl = `/api/getjobs`
  let queryParams = []

  if (keyword) queryParams.push(`keyword=${keyword}`)
  if (loc_keyword) queryParams.push(`location=${loc_keyword}`)
  if (company_keyword) queryParams.push(`company=${company_keyword}`)
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
