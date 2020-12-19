import axios from 'axios'

import { GET_JOBS } from './types'

//TODO improve search both server & client side
export function getJobs(params) {
  let { keyword, loc_keyword, company_keyword } = params
  let reqUrl = `/api/getjobs`
  let queryParams = []

  if (keyword) queryParams.push(`keyword=${keyword}`)
  if (loc_keyword) queryParams.push(`location=${loc_keyword}`)
  if (company_keyword) queryParams.push(`company=${company_keyword}`)

  for (let param of queryParams) {
    reqUrl += reqUrl.match(/\?/) ? `&${param}` : `?${param}`
  }

  const request = axios.get(reqUrl).then((response) => response.data)
  return {
    type: GET_JOBS,
    payload: request,
  }
}
