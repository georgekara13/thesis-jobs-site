import { combineReducers } from 'redux'
import user from './user_reducer'
import announcement from './announcement_reducer'

const rootReducer = combineReducers({
  user,
  announcement
})

export default rootReducer
