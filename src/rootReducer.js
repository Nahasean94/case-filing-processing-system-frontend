import {combineReducers} from 'redux'
import loginReducers from "./reducers/loginReducers"
import advocateLoginReducers from "./reducers/advocateLoginReducers"
import courtAdminLoginReducers from "./reducers/courtAdminLoginReducers"
import formReducers from "./reducers/formReducers"


export default combineReducers({
    loginReducers,
    advocateLoginReducers,
    courtAdminLoginReducers,
    formReducers,

})
