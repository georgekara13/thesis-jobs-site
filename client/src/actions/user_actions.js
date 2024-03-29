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

      if (token) {
        Cookies.set('userSession', token, { expires: 7 })
      }

      return response.data
    })
  return {
    type: LOGIN_USER,
    payload: request,
  }
}

export function authUserCheck(data) {
  const request = axios
    .get(`${process.env.REACT_APP_API}/api/auth/userisauth`, {
      headers: {
        token: data.token,
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return { isAuth: false }
    })
  return {
    type: AUTH_USER,
    payload: request,
  }
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post(`${process.env.REACT_APP_API}/api/auth/signup`, dataToSubmit)
    .then((response) => {
      const { token } = response?.data
      if (token) {
        Cookies.set('userSession', token, { expires: 7 })
      }

      return response.data
    })
  return {
    type: REGISTER_USER,
    payload: request,
  }
}

export function logoutUser() {
  Cookies.remove('userSession')
  window.location.href = '/login'

  // unreachable
  /*return {
    type: LOGOUT_USER,
    payload: { success: true },
  }*/
}

export function addUserFav(jobId) {
  const token = Cookies.get('userSession') || ''
  const request = axios
    .post(
      `${process.env.REACT_APP_API}/api/addtofavourites`,
      {
        jobId,
      },
      {
        headers: {
          token,
        },
      }
    )
    .then((response) => response.data.doc.favourites)
  return {
    type: ADD_USER_FAV,
    payload: request,
  }
}

export function rmUserFav(jobId) {
  const token = Cookies.get('userSession') || ''
  const request = axios
    .delete(`${process.env.REACT_APP_API}/api/deletefromfavourites`, {
      headers: { token },
      data: { jobId },
    })
    .then((response) => response.data.doc.favourites)
  return {
    type: RM_USER_FAV,
    payload: request,
  }
}
