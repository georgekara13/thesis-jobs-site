import { GET_JOBS } from "../actions/types"

export default function (state = {}, action) {
  switch (action.type) {
    case GET_JOBS:
      return { ...state }
    default:
      return state
  }
}
