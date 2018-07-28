import {combineReducers} from 'redux'
import loginReducers from "./reducers/loginReducers"
import advocateLoginReducers from "./reducers/advocateLoginReducers"

export default combineReducers({
    loginReducers,
    advocateLoginReducers
})
