import { combineReducers } from "redux"
import user from "./user_reducer"
import announcement from "./announcement_reducer"
import job from "./job_reducer"

const rootReducer = combineReducers({
  user,
  announcement,
  job,
})

export default rootReducer
