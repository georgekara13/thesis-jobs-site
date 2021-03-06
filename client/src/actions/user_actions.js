import axios from 'axios'

import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  ADD_USER_FAV,
  RM_USER_FAV,
} from './types'

export function loginUser(dataToSubmit) {
  const request = axios
    .post(`/api/login`, dataToSubmit)
    .then((response) => response.data)
  return {
    type: LOGIN_USER,
    payload: request,
  }
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post(`/api/register`, dataToSubmit)
    .then((response) => response.data)
  return {
    type: REGISTER_USER,
    payload: request,
  }
}

export function auth() {
  const request = axios.get(`/api/userisauth`).then((response) => response.data)
  return {
    type: AUTH_USER,
    payload: request,
  }
}

export function logoutUser() {
  const request = axios.get(`/api/logout`).then((response) => response.data)

  return {
    type: LOGOUT_USER,
    payload: request,
  }
}

export function addUserFav(jobId, uid) {
  const request = axios
    .post(`/api/addtofavourites?userid=${uid}&jobid=${jobId}`)
    .then((response) => response.data.doc.favourites)
  return {
    type: ADD_USER_FAV,
    payload: request,
  }
}

export function rmUserFav(jobId, uid) {
  const request = axios
    .delete(`/api/deletefromfavourites?userid=${uid}&jobid=${jobId}`)
    .then((response) => response.data.doc.favourites)
  return {
    type: RM_USER_FAV,
    payload: request,
  }
}
