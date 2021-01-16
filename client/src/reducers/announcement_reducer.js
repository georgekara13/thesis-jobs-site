import { GET_ANNOUNCEMENTS } from '../actions/types'

export default function(state={}, action){
  switch(action.type){
    case GET_ANNOUNCEMENTS:
      return {...state }
    default:
      return state
  }
}
