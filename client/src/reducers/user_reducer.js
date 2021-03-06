import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  ADD_USER_FAV,
  RM_USER_FAV,
} from '../actions/types'

export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload }
    case REGISTER_USER:
      return { ...state, registerSuccess: action.payload }
    case AUTH_USER:
      return { ...state, userData: action.payload }
    case LOGOUT_USER:
      return { ...state }
    case ADD_USER_FAV:
      return { ...state, favourites: action.payload }
    case RM_USER_FAV:
      return { ...state, favourites: action.payload }
    default:
      return state
  }
}
