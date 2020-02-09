import { combineReducers } from 'redux'
import userReducer from './useReducer'

export default combineReducers({
    users: userReducer
})