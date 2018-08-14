import {combineReducers} from 'redux'
import loginReducers from "./reducers/loginReducers"
import advocateLoginReducers from "./reducers/advocateLoginReducers"
import courtAdminLoginReducers from "./reducers/courtAdminLoginReducers"
import factReducers from "./reducers/factReducers"

export default combineReducers({
    loginReducers,
    advocateLoginReducers,
    courtAdminLoginReducers,
    factReducers,
})
