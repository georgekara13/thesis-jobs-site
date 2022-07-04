import axios from 'axios'
import Cookies from 'js-cookie'

import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  ADD_USER_FAV,
  RM_USER_FAV,
} from './types'

export function loginUser(data) {
  const request = axios
    .post(`${process.env.REACT_APP_API}/api/auth/signin`, data)
    .then((response) => {
      const { token } = response?.data
      Cookies.set('userSession', token)
      return response.data
    })
  return {
    type: LOGIN_USER,
    payload: request,
  }
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post(`${process.env.REACT_APP_API}/api/register`, dataToSubmit)
    .then((response) => response.data)
  return {
    type: REGISTER_USER,
    payload: request,
  }
}

export function auth() {
  const request = axios
    .get(`${process.env.REACT_APP_API}/api/userisauth`)
    .then((response) => response.data)
  //const request = Cookies.get('userSession') || false
  return {
    type: AUTH_USER,
    payload: request,
  }
}

export function logoutUser() {
  const request = axios
    .get(`${process.env.REACT_APP_API}/api/logout`)
    .then((response) => response.data)

  return {
    type: LOGOUT_USER,
    payload: request,
  }
}

export function addUserFav(jobId, uid) {
  const request = axios
    .post(
      `${process.env.REACT_APP_API}/api/addtofavourites?userid=${uid}&jobid=${jobId}`
    )
    .then((response) => response.data.doc.favourites)
  return {
    type: ADD_USER_FAV,
    payload: request,
  }
}

export function rmUserFav(jobId, uid) {
  const request = axios
    .delete(
      `${process.env.REACT_APP_API}/api/deletefromfavourites?userid=${uid}&jobid=${jobId}`
    )
    .then((response) => response.data.doc.favourites)
  return {
    type: RM_USER_FAV,
    payload: request,
  }
}
